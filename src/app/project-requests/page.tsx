"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Reply, Image } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProjectRequestReplyModal } from "@/components/project-requests/ProjectRequestReplyModal";
import { useToast } from "@/amal-ui/components/ToastProvider";
import * as API from "@/lib/api";

interface ProjectRequest {
  id: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  projectTitle: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  images?: string[];
  services?: string[];
  website?: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProjectRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ProjectRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load requests from API
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const response = await API.projectRequestsAPI.getRequests();
        if (response.success) {
          setRequests(response.data);
          setFilteredRequests(response.data);
        }
      } catch (error) {
        console.error('Failed to load project requests:', error);
        addToast({
          variant: 'error',
          title: 'Error',
          description: 'Failed to load project requests. Please try again.',
        });
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
        const clientName = (request.clientName || '').toLowerCase();
        const email = (request.email || '').toLowerCase();
        const projectTitle = (request.projectTitle || '').toLowerCase();
        const companyName = (request.companyName || '').toLowerCase();
        const description = (request.projectDescription || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return clientName.includes(searchLower) || 
               email.includes(searchLower) ||
               projectTitle.includes(searchLower) ||
               companyName.includes(searchLower) ||
               description.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(request => {
          if (key === 'status') return request.status === value;
          if (key === 'projectType') return request.projectTitle.toLowerCase().includes(value.toLowerCase());
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof ProjectRequest] || '';
      const bValue = b[sortBy as keyof ProjectRequest] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, filters, sortBy, sortOrder]);

  // API handler functions
  const handleViewRequest = (request: ProjectRequest) => {
    setSelectedRequest(request);
    // TODO: Implement view modal
  };

  const handleReplyToRequest = async (requestId: string, replyData: { reply: string; status: string }) => {
    try {
      const response = await API.projectRequestsAPI.replyToRequest(requestId, replyData);
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

  const handleUpdateStatus = async (requestId: string, status: 'pending' | 'accepted' | 'replied' | 'declined') => {
    try {
      const response = await API.projectRequestsAPI.updateStatus(requestId, status);
      if (response.success) {
        // Update the request in the list
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status } : req
        ));
        addToast({
          variant: 'success',
          title: 'Status Updated',
          description: `Project request status updated to ${status}.`,
        });
      }
    } catch (error) {
      console.error('Failed to update request status:', error);
      addToast({
        variant: 'error',
        title: 'Update Failed',
        description: 'Failed to update project request status. Please try again.',
      });
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const response = await API.projectRequestsAPI.deleteRequest(requestId);
      if (response.success) {
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId));
        addToast({
          variant: 'success',
          title: 'Request Deleted',
          description: 'Project request has been deleted successfully.',
        });
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
      addToast({
        variant: 'error',
        title: 'Delete Failed',
        description: 'Failed to delete project request. Please try again.',
      });
    }
  };

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Requests</h1>
            <p className="text-gray-600">Manage incoming project inquiries and requests</p>
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
                  placeholder="Search requests..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select
                  value={filters.projectType || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Types</option>
                  <option value="real estate">Real Estate</option>
                  <option value="interior decoration">Interior Decoration</option>
                  <option value="paint sales">Paint Sales</option>
                  <option value="renovation">Renovation</option>
                  <option value="office setup">Office Setup</option>
                  <option value="estate management">Estate Management</option>
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

        {/* Requests Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('clientName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Contact</span>
                      {getSortIcon('clientName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('projectTitle')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Project Title</span>
                      {getSortIcon('projectTitle')}
                    </div>
                  </TableHead>
                  <TableHead>Budget & Timeline</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Images</TableHead>
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
                {paginatedData.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.clientName}</p>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-xs text-gray-500">{request.phoneNumber}</p>
                        {request.companyName && (
                          <p className="text-xs text-gray-500">{request.companyName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.projectTitle}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.budget}</p>
                        <p className="text-sm text-gray-600">{request.timeline}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {request.projectDescription}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Image className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {request.images?.length || 0} image{(request.images?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(request.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/project-requests/${request.id}`, '_blank')}
                          className="text-palette-gold-600 hover:text-palette-gold-700"
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
                          className="text-palette-blue-600 hover:text-palette-blue-700"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newStatus = request.status === 'accepted' ? 'pending' : 'accepted';
                            handleUpdateStatus(request.id, newStatus);
                          }}
                          className="text-palette-green-600 hover:text-palette-green-700"
                          title="Update Status"
                        >
                          {request.status === 'accepted' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this project request?')) {
                              handleDeleteRequest(request.id);
                            }
                          }}
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
            totalItems={filteredRequests.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Reply Modal */}
      <ProjectRequestReplyModal
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