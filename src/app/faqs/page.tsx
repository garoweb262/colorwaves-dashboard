"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge, useToast } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FaqViewModal } from "@/components/faqs/FaqViewModal";
import { FaqFormModal } from "@/components/faqs/FaqFormModal";
import { FaqStatusModal } from "@/components/faqs/FaqStatusModal";
import { DeleteConfirmModal } from "@/components/faqs/DeleteConfirmModal";
import { faqsAPI } from "@/lib/api";

interface Faq {
  _id?: string;
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function FaqsPage() {
  const { addToast } = useToast();
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

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const response = await faqsAPI.getFaqs();
        if (response.success) {
          setFaqs(response.data);
          setFilteredFaqs(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch FAQs",
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to fetch FAQs",
          duration: 5000
        });
        // Fallback to empty array
        setFaqs([]);
        setFilteredFaqs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, [addToast]);

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

  const handleFaqSaved = async (savedFaq: Faq) => {
    if (!savedFaq) return;
    
    try {
      if (editingFaq) {
        // Update existing FAQ in local state
        setFaqs(prev => prev.map(faq => faq.id === savedFaq.id ? savedFaq : faq));
      } else {
        // Add new FAQ to local state
        setFaqs(prev => [...prev, savedFaq]);
      }
    } catch (error) {
      console.error("Error updating FAQ list:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update FAQ list",
        duration: 5000
      });
    } finally {
      setIsFormModalOpen(false);
      setEditingFaq(null);
    }
  };

  const handleFaqDeleted = async (faqId: string) => {
    if (!faqId) return;
    
    try {
      await faqsAPI.deleteFaq(faqId);
      setFaqs(prev => prev.filter(faq => faq.id !== faqId));
      addToast({
        variant: "success",
        title: "Success",
        description: "FAQ deleted successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to delete FAQ",
        duration: 5000
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedFaq(null);
    }
  };

  const handleUpdateStatus = (faq: Faq) => {
    if (!faq) return;
    
    setSelectedFaq(faq);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (faqId: string, status: string) => {
    try {
      const response = await faqsAPI.updateStatus(faqId, status);
      if (response.success) {
        setFaqs(prev => prev.map(f => 
          f.id === faqId ? { ...f, status } : f
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: "FAQ status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating FAQ status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update FAQ status",
        duration: 5000
      });
    } finally {
      setIsStatusModalOpen(false);
      setSelectedFaq(null);
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
      return <ChevronsUpDown className="h-4 w-4 text-white/40" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-white/60" /> : 
      <ChevronDown className="h-4 w-4 text-white/60" />;
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
            <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
            <p className="text-white/70">Manage FAQ content for your website</p>
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
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 glass-form-section rounded-md">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
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
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10"
                    onClick={() => handleSort('question')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-white">Question</span>
                      {getSortIcon('question')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10"
                    onClick={() => handleSort('answer')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-white">Answer</span>
                      {getSortIcon('answer')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-white">Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-white/10"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-white">Created</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32 text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-white line-clamp-2">
                          {faq.question}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-white/70 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        faq.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                      }`}>
                        {faq.status === 'active' ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-white/80">
                        {formatDate(faq.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFaq(faq)}
                          className="text-white/60 hover:text-white"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditFaq(faq)}
                          className="text-white/60 hover:text-white"
                          title="Edit FAQ"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(faq)}
                          className="text-white/60 hover:text-white"
                          title={faq.status === 'active' ? "Deactivate" : "Activate"}
                        >
                          {faq.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFaq(faq)}
                          className="text-red-400 hover:text-red-300"
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
