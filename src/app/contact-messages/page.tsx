"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Reply } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export default function ContactMessagesPage() {
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
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockMessages: ContactMessage[] = [
      {
        id: "1",
        fullName: "Emmanuel Okafor",
        email: "emmanuel@example.com",
        phoneNumber: "+234 802 123 4567",
        subject: "Paint Quality Inquiry",
        message: "I would like to inquire about the quality and durability of your emulsion paints. I'm planning a large residential project and need reliable suppliers.",
        status: "pending",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        fullName: "Aisha Mohammed",
        email: "aisha@company.com",
        phoneNumber: "+234 803 456 7890",
        subject: "Partnership Opportunity",
        message: "We are a construction company based in Kaduna and would like to explore partnership opportunities for upcoming projects in the northern region.",
        status: "replied",
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-18T14:22:00Z"
      },
      {
        id: "3",
        fullName: "David Adebayo",
        email: "david@business.com",
        phoneNumber: "+234 804 789 0123",
        subject: "Bulk Paint Order",
        message: "I need to place a bulk order for industrial paints for our manufacturing facility. Please provide pricing and availability information.",
        status: "accepted",
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: "4",
        fullName: "Grace Nwankwo",
        email: "grace@home.com",
        phoneNumber: "+234 805 234 5678",
        subject: "Interior Design Consultation",
        message: "I'm renovating my home and would like to schedule a consultation for interior design and paint selection. Please let me know your availability.",
        status: "pending",
        createdAt: "2024-01-18T08:45:00Z",
        updatedAt: "2024-01-18T08:45:00Z"
      },
      {
        id: "5",
        fullName: "Samuel Ikenna",
        email: "samuel@office.com",
        phoneNumber: "+234 806 345 6789",
        subject: "Office Renovation Quote",
        message: "We need a comprehensive quote for office renovation including painting, flooring, and interior design for our new Lagos office space.",
        status: "declined",
        createdAt: "2024-01-19T14:30:00Z",
        updatedAt: "2024-01-20T10:15:00Z"
      }
    ];
    
    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
    setIsLoading(false);
  }, []);

  // Filter and sort messages
  useEffect(() => {
    let filtered = messages.filter(message => message != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(message => {
        const fullName = (message.fullName || '').toLowerCase();
        const email = (message.email || '').toLowerCase();
        const subject = (message.subject || '').toLowerCase();
        const messageText = (message.message || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
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
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">Manage incoming contact inquiries and messages</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="replied">Replied</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Contact</span>
                      {getSortIcon('fullName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('subject')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Subject</span>
                      {getSortIcon('subject')}
                    </div>
                  </TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{message.fullName}</p>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        <p className="text-xs text-gray-500">{message.phoneNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{message.subject}</p>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(message.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-palette-blue-600 hover:text-palette-blue-700"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-palette-green-600 hover:text-palette-green-700"
                          title="Update Status"
                        >
                          {message.status === 'accepted' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive-600"
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
    </DashboardLayout>
  );
}