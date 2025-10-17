"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Reply } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ContactMessageReplyModal } from "@/components/contact-messages/ContactMessageReplyModal";
import { DeleteConfirmModal } from "@/components/contact-messages/DeleteConfirmModal";
import { StatusUpdateModal } from "@/components/contact-messages/StatusUpdateModal";
import { useToast } from "@/amal-ui/components/ToastProvider";
import * as API from "@/lib/api";
import { ServiceStatistics } from "@/components/ServiceStatistics";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ContactMessagesPage() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load messages from API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await API.contactMessagesAPI.getMessages();
        if (response.success) {
          setMessages(response.data);
          setFilteredMessages(response.data);
        }
      } catch (error) {
        console.error('Failed to load contact messages:', error);
        // Fallback to empty array on error
        setMessages([]);
        setFilteredMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, []);

  // Filter and sort messages
  useEffect(() => {
    let filtered = messages.filter(message => message != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(message => {
        const name = (message.name || '').toLowerCase();
        const email = (message.email || '').toLowerCase();
        const subject = (message.subject || '').toLowerCase();
        const messageText = (message.message || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return name.includes(searchLower) || 
               email.includes(searchLower) ||
               subject.includes(searchLower) ||
               messageText.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(message => {
          if (key === 'status') return message.status === value;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof ContactMessage] || '';
      const bValue = b[sortBy as keyof ContactMessage] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredMessages(filtered);
  }, [messages, searchTerm, filters, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Sorting functionality
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-white/50" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-white/80" /> : 
      <ChevronDown className="h-4 w-4 text-white/80" />;
  };

  // API handler functions
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    // TODO: Implement view modal
  };

  const handleReplyToMessage = async (messageId: string, replyData: { reply: string; status: string }) => {
    try {
      const response = await API.contactMessagesAPI.replyToMessage(messageId, replyData);
      if (response.success) {
        // Update the message in the list
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, ...response.data } : msg
        ));
        addToast({
          variant: 'success',
          title: 'Reply Sent',
          description: 'Your reply has been sent successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to reply to message:', error);
      addToast({
        variant: 'error',
        title: 'Reply Failed',
        description: 'Failed to send reply. Please try again.',
      });
    }
  };

  const handleUpdateStatus = async (status: 'pending' | 'accepted' | 'replied' | 'declined') => {
    if (!selectedMessage) return;
    
    try {
      const response = await API.contactMessagesAPI.updateStatus(selectedMessage.id, status);
      if (response.success) {
        // Update the message in the list
        setMessages(prev => prev.map(msg => 
          msg.id === selectedMessage.id ? { ...msg, status } : msg
        ));
        addToast({
          variant: 'success',
          title: 'Status Updated',
          description: `Contact message status updated to ${status}.`,
        });
      }
    } catch (error) {
      console.error('Failed to update message status:', error);
      addToast({
        variant: 'error',
        title: 'Update Failed',
        description: 'Failed to update contact message status. Please try again.',
      });
    }
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    
    try {
      const response = await API.contactMessagesAPI.deleteMessage(selectedMessage.id);
      if (response.success) {
        // Remove the message from the list
        setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
        addToast({
          variant: 'success',
          title: 'Message Deleted',
          description: 'Contact message has been deleted successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      addToast({
        variant: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete contact message. Please try again.',
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredMessages.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Service Statistics */}
        <ServiceStatistics serviceName="contact-messages" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
            <p className="text-white/70">Manage incoming contact inquiries and messages</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="glass-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 rounded-md"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 border-white/20 text-white hover:bg-white/10"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 glass-panel rounded-md">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="glass-select w-full px-3 py-2 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="replied">Replied</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="glass-select w-full px-3 py-2 rounded-md"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Messages Table */}
        <div className="glass-table overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow className="glass-table-header">
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Contact</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('subject')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Subject</span>
                      {getSortIcon('subject')}
                    </div>
                  </TableHead>
                  <TableHead className="glass-table-header-cell">Message</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32 glass-table-header-cell">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((message) => (
                  <TableRow key={message.id} className="glass-table-row">
                    <TableCell className="glass-table-cell">
                      <div>
                        <p className="text-sm font-medium text-white">{message.name}</p>
                        <p className="text-sm text-white/70">{message.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <p className="text-sm font-medium text-white line-clamp-1">{message.subject}</p>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <div className="max-w-xs">
                        <p className="text-sm text-white/70 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <span className="text-sm text-white/70">
                        {formatDate(message.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/contact-messages/${message.id}`, '_blank')}
                          className="text-palette-gold-600 hover:text-palette-gold-700 hover:bg-white/10"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsReplyModalOpen(true);
                          }}
                          className="text-palette-blue-600 hover:text-palette-blue-700 hover:bg-white/10"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsStatusModalOpen(true);
                          }}
                          className="text-palette-green-600 hover:text-palette-green-700 hover:bg-white/10"
                          title="Update Status"
                        >
                          <ToggleLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-destructive hover:text-destructive-600 hover:bg-white/10"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showInfo={true}
            totalItems={filteredMessages.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Reply Modal */}
      <ContactMessageReplyModal
        message={selectedMessage}
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setSelectedMessage(null);
        }}
        onReply={handleReplyToMessage}
      />
      
      <DeleteConfirmModal
        message={selectedMessage}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMessage(null);
        }}
        onConfirm={() => {
          handleDeleteMessage();
          setIsDeleteModalOpen(false);
          setSelectedMessage(null);
        }}
      />
      
      <StatusUpdateModal
        message={selectedMessage}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedMessage(null);
        }}
        onUpdate={handleUpdateStatus}
      />
    </DashboardLayout>
  );
}