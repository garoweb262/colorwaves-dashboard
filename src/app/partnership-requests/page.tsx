"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Reply } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PartnershipRequestReplyModal } from "@/components/partnership-requests/PartnershipRequestReplyModal";
import { DeleteConfirmModal } from "@/components/partnership-requests/DeleteConfirmModal";
import { StatusUpdateModal } from "@/components/partnership-requests/StatusUpdateModal";
import { useToast } from "@/amal-ui/components/ToastProvider";
import * as API from "@/lib/api";
import { ServiceStatistics } from "@/components/ServiceStatistics";

interface PartnershipRequest {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  partnershipType: string;
  message?: string;
  description?: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PartnershipRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PartnershipRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load requests from API
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const response = await API.partnershipRequestsAPI.getRequests();
        if (response.success) {
          setRequests(response.data);
          setFilteredRequests(response.data);
        }
      } catch (error) {
        console.error('Failed to load partnership requests:', error);
        // Fallback to empty array on error
        setRequests([]);
        setFilteredRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  // Filter and sort requests
  useEffect(() => {
    let filtered = requests.filter(request => request != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(request => {
        const fullName = (request.fullName || '').toLowerCase();
        const companyName = (request.companyName || '').toLowerCase();
        const email = (request.email || '').toLowerCase();
        const partnershipType = (request.partnershipType || '').toLowerCase();
        const message = (request.message || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               companyName.includes(searchLower) || 
               email.includes(searchLower) ||
               partnershipType.includes(searchLower) ||
               message.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(request => {
          if (key === 'status') return request.status === value;
          if (key === 'partnershipType') return request.partnershipType === value;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof PartnershipRequest] || '';
      const bValue = b[sortBy as keyof PartnershipRequest] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, filters, sortBy, sortOrder]);

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
  const handleViewRequest = (request: PartnershipRequest) => {
    setSelectedRequest(request);
    // TODO: Implement view modal
  };

  const handleReplyToRequest = async (requestId: string, replyData: { reply: string; status: string }) => {
    try {
      const response = await API.partnershipRequestsAPI.replyToRequest(requestId, replyData);
      if (response.success) {
        // Update the request in the list
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, ...response.data } : req
        ));
        addToast({
          variant: 'success',
          title: 'Reply Sent',
          description: 'Your reply has been sent successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to reply to request:', error);
      addToast({
        variant: 'error',
        title: 'Reply Failed',
        description: 'Failed to send reply. Please try again.',
      });
    }
  };

  const handleUpdateStatus = async (status: 'pending' | 'accepted' | 'replied' | 'declined') => {
    if (!selectedRequest) return;
    
    try {
      const response = await API.partnershipRequestsAPI.updateStatus(selectedRequest.id, status);
      if (response.success) {
        // Update the request in the list
        setRequests(prev => prev.map(req => 
          req.id === selectedRequest.id ? { ...req, status } : req
        ));
        addToast({
          variant: 'success',
          title: 'Status Updated',
          description: `Partnership request status updated to ${status}.`,
        });
      }
    } catch (error) {
      console.error('Failed to update request status:', error);
      addToast({
        variant: 'error',
        title: 'Update Failed',
        description: 'Failed to update partnership request status. Please try again.',
      });
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return;
    
    try {
      const response = await API.partnershipRequestsAPI.deleteRequest(selectedRequest.id);
      if (response.success) {
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
        addToast({
          variant: 'success',
          title: 'Request Deleted',
          description: 'Partnership request has been deleted successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
      addToast({
        variant: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete partnership request. Please try again.',
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredRequests.slice(startIndex, endIndex);

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
        <ServiceStatistics serviceName="partnership-requests" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Partnership Requests</h1>
            <p className="text-white/70">Manage incoming partnership and collaboration requests</p>
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
                  placeholder="Search requests..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 glass-panel rounded-md">
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
                <label className="block text-sm font-medium text-white/80 mb-1">Partnership Type</label>
                <select
                  value={filters.partnershipType || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, partnershipType: e.target.value === 'all' ? null : e.target.value }))}
                  className="glass-select w-full px-3 py-2 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="supplier">Supplier</option>
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

        {/* Requests Table */}
        <div className="glass-table overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow className="glass-table-header">
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Contact</span>
                      {getSortIcon('fullName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('companyName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Company</span>
                      {getSortIcon('companyName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10 glass-table-header-cell"
                    onClick={() => handleSort('partnershipType')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Type</span>
                      {getSortIcon('partnershipType')}
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
                {paginatedData.map((request) => (
                  <TableRow key={request.id} className="glass-table-row">
                    <TableCell className="glass-table-cell">
                      <div>
                        <p className="text-sm font-medium text-white">{request.fullName}</p>
                        <p className="text-sm text-white/70">{request.email}</p>
                        <p className="text-xs text-white/60">{request.phoneNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <p className="text-sm font-medium text-white">{request.companyName}</p>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <Badge color="blue" size="sm">
                        {request.partnershipType}
                      </Badge>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <div className="max-w-xs">
                        <p className="text-sm text-white/70 line-clamp-2">
                          {request.message || "No message provided"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <span className="text-sm text-white/70">
                        {formatDate(request.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="glass-table-cell">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/partnership-requests/${request.id}`, '_blank')}
                          className="text-palette-gold-600 hover:text-palette-gold-700 hover:bg-white/10"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
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
                            setSelectedRequest(request);
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
                            setSelectedRequest(request);
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
            totalItems={filteredRequests.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Reply Modal */}
      <PartnershipRequestReplyModal
        request={selectedRequest}
        isOpen={isReplyModalOpen}
        onClose={() => {
          setIsReplyModalOpen(false);
          setSelectedRequest(null);
        }}
        onReply={handleReplyToRequest}
      />
    </DashboardLayout>
  );
}