"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TestimonyViewModal } from "@/components/testimonies/TestimonyViewModal";
import { TestimonyFormModal } from "@/components/testimonies/TestimonyFormModal";
import { TestimonyStatusModal } from "@/components/testimonies/TestimonyStatusModal";
import { DeleteConfirmModal } from "@/components/testimonies/DeleteConfirmModal";

interface Testimony {
  id: string;
  content: string;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  rating: number;
  clientImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [filteredTestimonies, setFilteredTestimonies] = useState<Testimony[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingTestimony, setEditingTestimony] = useState<Testimony | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTestimonies: Testimony[] = [
      {
        id: "1",
        content: "Colorwaves transformed our office space with their durable paint and excellent finishing.",
        clientName: "Adewale",
        clientPosition: "Business Owner",
        clientCompany: "Tech Solutions Ltd",
        rating: 5,
        clientImage: "https://example.com/adewale.jpg",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:22:00Z"
      },
      {
        id: "2",
        content: "Their housing project was not only affordable but beautifully executed.",
        clientName: "Fatima",
        clientPosition: "Homeowner",
        clientCompany: "Personal",
        rating: 5,
        clientImage: "https://example.com/fatima.jpg",
        isActive: true,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      }
    ];
    
    setTestimonies(mockTestimonies);
    setFilteredTestimonies(mockTestimonies);
    setIsLoading(false);
  }, []);

  // Filter and sort testimonies
  useEffect(() => {
    let filtered = testimonies.filter(testimony => testimony != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(testimony => {
        const content = (testimony.content || '').toLowerCase();
        const clientName = (testimony.clientName || '').toLowerCase();
        const clientPosition = (testimony.clientPosition || '').toLowerCase();
        const clientCompany = (testimony.clientCompany || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return content.includes(searchLower) ||
               clientName.includes(searchLower) ||
               clientPosition.includes(searchLower) ||
               clientCompany.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(testimony => {
          if (key === 'status') return value === 'active' ? testimony.isActive : !testimony.isActive;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Testimony] || '';
      const bValue = b[sortBy as keyof Testimony] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTestimonies(filtered);
  }, [testimonies, searchTerm, filters, sortBy, sortOrder]);

  const handleViewTestimony = (testimony: Testimony) => {
    setSelectedTestimony(testimony);
    setIsViewModalOpen(true);
  };

  const handleEditTestimony = (testimony: Testimony) => {
    setEditingTestimony(testimony);
    setIsFormModalOpen(true);
  };

  const handleDeleteTestimony = (testimony: Testimony) => {
    setSelectedTestimony(testimony);
    setIsDeleteModalOpen(true);
  };

  const handleAddTestimony = () => {
    setEditingTestimony(null);
    setIsFormModalOpen(true);
  };

  const handleTestimonySaved = (savedTestimony: Testimony) => {
    if (!savedTestimony) return;
    
    if (editingTestimony) {
      setTestimonies(prev => prev.map(testimony => testimony.id === savedTestimony.id ? savedTestimony : testimony));
    } else {
      setTestimonies(prev => [...prev, savedTestimony]);
    }
    setIsFormModalOpen(false);
    setEditingTestimony(null);
  };

  const handleTestimonyDeleted = (testimonyId: string) => {
    if (!testimonyId) return;
    
    setTestimonies(prev => prev.filter(testimony => testimony.id !== testimonyId));
    setIsDeleteModalOpen(false);
    setSelectedTestimony(null);
  };

  const handleUpdateStatus = (testimony: Testimony) => {
    if (!testimony) return;
    
    setSelectedTestimony(testimony);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (testimonyId: string, status: string) => {
    setTestimonies(prev => prev.map(t => 
      t.id === testimonyId ? { ...t, isActive: status === 'active' } : t
    ));
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
  const totalPages = Math.ceil(filteredTestimonies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredTestimonies.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Client Testimonials</h1>
            <p className="text-gray-600">Manage customer testimonials and reviews</p>
          </div>
          <Button
            onClick={handleAddTestimony}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Testimony
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search testimonies..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Testimonies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((testimony) => (
            <div key={testimony.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    testimony.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {testimony.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="text-4xl text-gray-300 mb-2">"</div>
                  <p className="text-sm text-gray-600 line-clamp-4 italic">
                    {testimony.content}
                  </p>
                  <div className="text-4xl text-gray-300 text-right mt-2">"</div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {testimony.clientImage ? (
                        <img 
                          src={testimony.clientImage} 
                          alt={testimony.clientName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {testimony.clientName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{testimony.clientName}</p>
                      <p className="text-xs text-gray-500">{testimony.clientPosition}</p>
                      <p className="text-xs text-gray-400">{testimony.clientCompany}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < testimony.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                  <span>Created: {formatDate(testimony.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewTestimony(testimony)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTestimony(testimony)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit Testimony"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(testimony)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title={testimony.isActive ? "Deactivate" : "Activate"}
                  >
                    {testimony.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTestimony(testimony)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete Testimony"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredTestimonies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonies found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first testimony"}
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <Button onClick={handleAddTestimony} leftIcon={<Plus className="h-4 w-4" />}>
                Add Testimony
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTestimony && (
        <TestimonyViewModal
          testimony={selectedTestimony}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      <TestimonyFormModal
        testimony={editingTestimony}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTestimony(null);
        }}
        onSave={handleTestimonySaved}
      />

      {selectedTestimony && (
        <DeleteConfirmModal
          testimony={selectedTestimony}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleTestimonyDeleted}
        />
      )}

      {selectedTestimony && (
        <TestimonyStatusModal
          testimony={selectedTestimony}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}
