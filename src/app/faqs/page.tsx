"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FaqViewModal } from "@/components/faqs/FaqViewModal";
import { FaqFormModal } from "@/components/faqs/FaqFormModal";
import { FaqStatusModal } from "@/components/faqs/FaqStatusModal";
import { DeleteConfirmModal } from "@/components/faqs/DeleteConfirmModal";

interface Faq {
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<Faq[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockFaqs: Faq[] = [
      {
        id: "1",
        question: "What types of paints do you produce?",
        answer: "We produce decorative, industrial, and textured paints, tailored for different needs.",
        status: "active",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:22:00Z"
      },
      {
        id: "2",
        question: "Do you take on real estate projects outside Abuja?",
        answer: "Yes, we operate nationwide with select projects.",
        status: "active",
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: "3",
        question: "Can I become a distributor?",
        answer: "Absolutely. Contact our team via the partnership page.",
        status: "active",
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-18T10:30:00Z"
      }
    ];
    
    setFaqs(mockFaqs);
    setFilteredFaqs(mockFaqs);
    setIsLoading(false);
  }, []);

  // Filter and sort FAQs
  useEffect(() => {
    let filtered = faqs.filter(faq => faq != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(faq => {
        const question = (faq.question || '').toLowerCase();
        const answer = (faq.answer || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return question.includes(searchLower) || answer.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(faq => {
          if (key === 'status') return faq.status === value;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Faq] || '';
      const bValue = b[sortBy as keyof Faq] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredFaqs(filtered);
  }, [faqs, searchTerm, filters, sortBy, sortOrder]);

  const handleViewFaq = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsViewModalOpen(true);
  };

  const handleEditFaq = (faq: Faq) => {
    setEditingFaq(faq);
    setIsFormModalOpen(true);
  };

  const handleDeleteFaq = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsDeleteModalOpen(true);
  };

  const handleAddFaq = () => {
    setEditingFaq(null);
    setIsFormModalOpen(true);
  };

  const handleFaqSaved = (savedFaq: Faq) => {
    if (!savedFaq) return;
    
    if (editingFaq) {
      setFaqs(prev => prev.map(faq => faq.id === savedFaq.id ? savedFaq : faq));
    } else {
      setFaqs(prev => [...prev, savedFaq]);
    }
    setIsFormModalOpen(false);
    setEditingFaq(null);
  };

  const handleFaqDeleted = (faqId: string) => {
    if (!faqId) return;
    
    setFaqs(prev => prev.filter(faq => faq.id !== faqId));
    setIsDeleteModalOpen(false);
    setSelectedFaq(null);
  };

  const handleUpdateStatus = (faq: Faq) => {
    if (!faq) return;
    
    setSelectedFaq(faq);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (faqId: string, status: string) => {
    setFaqs(prev => prev.map(f => 
      f.id === faqId ? { ...f, status } : f
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
  const totalPages = Math.ceil(filteredFaqs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredFaqs.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-gray-600">Manage FAQ content for your website</p>
          </div>
          <Button
            onClick={handleAddFaq}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add FAQ
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
                  placeholder="Search FAQs..."
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
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* FAQs Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('question')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Question</span>
                      {getSortIcon('question')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('answer')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Answer</span>
                      {getSortIcon('answer')}
                    </div>
                  </TableHead>
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
                      <span>Created</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {faq.question}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        faq.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {faq.status === 'active' ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(faq.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFaq(faq)}
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="Edit FAQ"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(faq)}
                          className="text-palette-blue-600 hover:text-palette-blue-700"
                          title={faq.status === 'active' ? "Deactivate" : "Activate"}
                        >
                          {faq.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFaq(faq)}
                          className="text-destructive hover:text-destructive-600"
                          title="Delete FAQ"
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
            totalItems={filteredFaqs.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedFaq && (
        <FaqViewModal
          faq={selectedFaq}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      <FaqFormModal
        faq={editingFaq}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingFaq(null);
        }}
        onSave={handleFaqSaved}
      />

      {selectedFaq && (
        <DeleteConfirmModal
          faq={selectedFaq}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleFaqDeleted}
        />
      )}

      {selectedFaq && (
        <FaqStatusModal
          faq={selectedFaq}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}
