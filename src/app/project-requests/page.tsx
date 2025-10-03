"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Reply, Image } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface ProjectRequest {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  projectType: string;
  budgetRange: string;
  location: string;
  description: string;
  images: string[];
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export default function ProjectRequestsPage() {
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
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockRequests: ProjectRequest[] = [
      {
        id: "1",
        fullName: "Adewale Johnson",
        email: "adewale@example.com",
        phoneNumber: "+234 802 123 4567",
        projectType: "real estate",
        budgetRange: "₦10M - ₦20M",
        location: "Abuja, FCT",
        description: "Looking to develop a residential estate with modern housing units. We need comprehensive design and construction services including paint supply and interior decoration.",
        images: ["/images/projects/request-1.jpg", "/images/projects/request-2.jpg"],
        status: "pending",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        fullName: "Fatima Ibrahim",
        email: "fatima@company.com",
        phoneNumber: "+234 803 456 7890",
        projectType: "office setup",
        budgetRange: "₦5M - ₦10M",
        location: "Lagos, Nigeria",
        description: "Complete office renovation and setup for our new corporate headquarters. Need modern design, quality paint work, and professional finishing.",
        images: ["/images/projects/office-1.jpg"],
        status: "replied",
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-18T14:22:00Z"
      },
      {
        id: "3",
        fullName: "Michael Chen",
        email: "m.chen@business.com",
        phoneNumber: "+234 804 789 0123",
        projectType: "renovation",
        budgetRange: "₦2M - ₦5M",
        location: "Port Harcourt, Rivers",
        description: "Renovation of existing commercial building. Focus on modern paint schemes and interior updates.",
        images: [],
        status: "accepted",
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: "4",
        fullName: "Sarah Okafor",
        email: "sarah@residence.com",
        phoneNumber: "+234 805 234 5678",
        projectType: "interior decoration",
        budgetRange: "₦1M - ₦2M",
        location: "Kaduna, Nigeria",
        description: "Interior decoration project for luxury residential apartment. Need premium paint and finishing services.",
        images: ["/images/projects/interior-1.jpg", "/images/projects/interior-2.jpg", "/images/projects/interior-3.jpg"],
        status: "declined",
        createdAt: "2024-01-18T08:45:00Z",
        updatedAt: "2024-01-20T12:30:00Z"
      }
    ];
    
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
    setIsLoading(false);
  }, []);

  // Filter and sort requests
  useEffect(() => {
    let filtered = requests.filter(request => request != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(request => {
        const fullName = (request.fullName || '').toLowerCase();
        const email = (request.email || '').toLowerCase();
        const projectType = (request.projectType || '').toLowerCase();
        const location = (request.location || '').toLowerCase();
        const description = (request.description || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) ||
               projectType.includes(searchLower) ||
               location.includes(searchLower) ||
               description.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(request => {
          if (key === 'status') return request.status === value;
          if (key === 'projectType') return request.projectType === value;
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
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Contact</span>
                      {getSortIcon('fullName')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('projectType')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Project Type</span>
                      {getSortIcon('projectType')}
                    </div>
                  </TableHead>
                  <TableHead>Budget & Location</TableHead>
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
                        <p className="text-sm font-medium text-gray-900">{request.fullName}</p>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-xs text-gray-500">{request.phoneNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color="blue" size="sm">
                        {request.projectType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.budgetRange}</p>
                        <p className="text-sm text-gray-600">{request.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {request.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Image className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {request.images.length} image{request.images.length !== 1 ? 's' : ''}
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
                          {request.status === 'accepted' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
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
            totalItems={filteredRequests.length}
            pageSize={pageSize}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}