"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight, Star, User, Image as ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { NewsFormModal } from "@/components/news/NewsFormModal";
import { DeleteConfirmModal } from "@/components/news/DeleteConfirmModal";
import { newsAPI } from "@/lib/api";

interface News {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  images?: string[];
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  viewCount?: number;
  author?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function NewsPage() {
  const { addToast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await newsAPI.getNews();
        if (response.success) {
          setNews(response.data);
          setFilteredNews(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch news",
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to fetch news",
          duration: 5000
        });
        // Fallback to empty array
        setNews([]);
        setFilteredNews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [addToast]);

  // Filter and sort news
  useEffect(() => {
    let filtered = news.filter(newsItem => newsItem != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(newsItem => {
        const title = (newsItem.title || '').toLowerCase();
        const excerpt = (newsItem.excerpt || '').toLowerCase();
        const tags = (newsItem.tags || []).join(' ').toLowerCase();
        const author = (newsItem.author || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return title.includes(searchLower) || 
               excerpt.includes(searchLower) ||
               tags.includes(searchLower) ||
               author.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(newsItem => {
          if (key === 'status') return newsItem.status === value;
          if (key === 'featured') return newsItem.isFeatured === (value === 'featured');
          if (key === 'tag') return (newsItem.tags || []).includes(value);
          return true;
        });
      }
    });

    setFilteredNews(filtered);
  }, [news, searchTerm, filters]);

  const handleViewNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsViewModalOpen(true);
  };

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsFormModalOpen(true);
  };

  const handleDeleteNews = (newsItem: News) => {
    setSelectedNews(newsItem);
    setIsDeleteModalOpen(true);
  };

  const handleAddNews = () => {
    setEditingNews(null);
    setIsFormModalOpen(true);
  };

  const handleNewsSaved = async (savedNews: News) => {
    if (!savedNews) return;
    
    try {
      if (editingNews) {
        // Update existing news in local state
        setNews(prev => prev.map(newsItem => newsItem.id === savedNews.id ? savedNews : newsItem));
      } else {
        // Add new news to local state
        setNews(prev => [...prev, savedNews]);
      }
    } catch (error) {
      console.error("Error updating news list:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update news list",
        duration: 5000
      });
    } finally {
      setIsFormModalOpen(false);
      setEditingNews(null);
    }
  };

  const handleNewsDeleted = async (newsId: string) => {
    if (!newsId) return;
    
    try {
      await newsAPI.deleteNews(newsId);
      setNews(prev => prev.filter(newsItem => newsItem.id !== newsId));
      addToast({
        variant: "success",
        title: "Success",
        description: "News deleted successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to delete news",
        duration: 5000
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedNews(null);
    }
  };

  const handleUpdateStatus = (newsItem: News) => {
    if (!newsItem) return;
    
    setSelectedNews(newsItem);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (newsId: string, status: string) => {
    try {
      const response = await newsAPI.updateStatus(newsId, status);
      if (response.success) {
        setNews(prev => prev.map(n => 
          n.id === newsId ? { ...n, status: status as 'draft' | 'published' | 'archived' } : n
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: "News status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating news status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update news status",
        duration: 5000
      });
    } finally {
      setIsStatusModalOpen(false);
      setSelectedNews(null);
    }
  };

  const handleToggleFeatured = async (newsId: string) => {
    const newsItem = news.find(n => n.id === newsId);
    if (!newsItem) return;
    
    try {
      const response = await newsAPI.updateFeatured(newsId, !newsItem.isFeatured);
      if (response.success) {
        setNews(prev => prev.map(n => 
          n.id === newsId ? { ...n, isFeatured: !n.isFeatured } : n
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: `News ${!newsItem.isFeatured ? 'added to' : 'removed from'} featured`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error toggling news featured status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update featured status",
        duration: 5000
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
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

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredNews.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
            <p className="text-gray-600">Manage company news and announcements</p>
          </div>
          <Button
            onClick={handleAddNews}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add News
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
                  placeholder="Search news..."
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                <select
                  value={filters.featured || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All</option>
                  <option value="featured">Featured</option>
                  <option value="not-featured">Not Featured</option>
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((newsItem) => (
            <div key={newsItem.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                {newsItem.images && newsItem.images.length > 0 ? (
                  <img
                    src={newsItem.images[0]}
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    color={newsItem.status === 'published' ? "green" : newsItem.status === 'draft' ? "yellow" : "gray"}
                    size="sm"
                  >
                    {newsItem.status || 'draft'}
                  </Badge>
                </div>
                {newsItem.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <Badge color="purple" size="sm">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {newsItem.title}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {newsItem.excerpt || "No excerpt available"}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {(newsItem.tags || []).slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {(newsItem.tags || []).length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{(newsItem.tags || []).length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{newsItem.author || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{newsItem.viewCount || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>
                    {newsItem.publishedAt ? formatDate(newsItem.publishedAt) : "Not published"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/news/${newsItem.slug}`, '_blank')}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditNews(newsItem)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit News"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(newsItem.id)}
                    className={newsItem.isFeatured ? "text-yellow-600 hover:text-yellow-700" : "text-gray-600 hover:text-gray-700"}
                    title={newsItem.isFeatured ? "Remove from Featured" : "Add to Featured"}
                  >
                    <Star className={`h-4 w-4 ${newsItem.isFeatured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(newsItem)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title="Update Status"
                  >
                    {newsItem.status === 'published' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNews(newsItem)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete News"
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
      </div>

      {/* News Form Modal */}
      <NewsFormModal
        news={editingNews}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingNews(null);
        }}
        onSave={handleNewsSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        news={selectedNews}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedNews(null);
        }}
        onConfirm={handleNewsDeleted}
      />
    </DashboardLayout>
  );
}
