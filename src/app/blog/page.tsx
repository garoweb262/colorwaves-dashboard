"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Badge, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight, Star, User, Image as ImageIcon, Heart, MessageCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BlogFormModal } from "@/components/blogs/BlogFormModal";
import { DeleteConfirmModal } from "@/components/blogs/DeleteConfirmModal";
import { StatusUpdateModal } from "@/amal-ui/crud/components/StatusUpdateModal";
import { blogsAPI } from "@/lib/api";
import { ServiceStatistics } from "@/components/ServiceStatistics";

interface Blog {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  categories?: string[];
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  author?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BlogPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Status update configuration
  const statusConfig = {
    entityName: "Blog",
    entityNamePlural: "Blogs",
    basePath: "/blogs",
    columns: [],
    formFields: [],
    statusField: "status",
    statusOptions: [
      { value: "draft", label: "Draft", color: "yellow" },
      { value: "published", label: "Published", color: "green" },
      { value: "archived", label: "Archived", color: "gray" }
    ]
  };

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await blogsAPI.getBlogs();
        if (response.success) {
          setBlogs(response.data);
          setFilteredBlogs(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch blogs",
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to fetch blogs",
          duration: 5000
        });
        // Fallback to empty array
        setBlogs([]);
        setFilteredBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [addToast]);

  // Filter and sort blogs
  useEffect(() => {
    let filtered = blogs.filter(blog => blog != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(blog => {
        const title = (blog.title || '').toLowerCase();
        const excerpt = (blog.excerpt || '').toLowerCase();
        const tags = (blog.tags || []).join(' ').toLowerCase();
        const categories = (blog.categories || []).join(' ').toLowerCase();
        const author = (blog.author || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return title.includes(searchLower) || 
               excerpt.includes(searchLower) ||
               tags.includes(searchLower) ||
               categories.includes(searchLower) ||
               author.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(blog => {
          if (key === 'status') return blog.status === value;
          if (key === 'featured') return blog.isFeatured === (value === 'featured');
          if (key === 'category') return (blog.categories || []).includes(value);
          if (key === 'tag') return (blog.tags || []).includes(value);
          return true;
        });
      }
    });

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, filters]);

  const handleViewBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setIsFormModalOpen(true);
  };

  const handleDeleteBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleAddBlog = () => {
    setEditingBlog(null);
    setIsFormModalOpen(true);
  };

  const handleBlogSaved = async (savedBlog: Blog) => {
    if (!savedBlog) return;
    
    try {
      if (editingBlog) {
        // Update existing blog in local state
        setBlogs(prev => prev.map(blog => blog.id === savedBlog.id ? savedBlog : blog));
      } else {
        // Add new blog to local state
        setBlogs(prev => [...prev, savedBlog]);
      }
    } catch (error) {
      console.error("Error updating blog list:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update blog list",
        duration: 5000
      });
    } finally {
      setIsFormModalOpen(false);
      setEditingBlog(null);
    }
  };

  const handleBlogDeleted = async (blogId: string) => {
    if (!blogId) return;
    
    try {
      await blogsAPI.deleteBlog(blogId);
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      addToast({
        variant: "success",
        title: "Success",
        description: "Blog deleted successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to delete blog",
        duration: 5000
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    }
  };

  const handleUpdateStatus = (blog: Blog) => {
    if (!blog) return;
    
    setSelectedBlog(blog);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (blogId: string, status: string) => {
    try {
      const response = await blogsAPI.updateStatus(blogId, status);
      if (response.success) {
        setBlogs(prev => prev.map(b => 
          b.id === blogId ? { ...b, status: status as 'draft' | 'published' | 'archived' } : b
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: "Blog status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating blog status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update blog status",
        duration: 5000
      });
    } finally {
      setIsStatusModalOpen(false);
      setSelectedBlog(null);
    }
  };

  const handleToggleFeatured = async (blogId: string) => {
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return;
    
    try {
      const response = await blogsAPI.updateFeatured(blogId, !blog.isFeatured);
      if (response.success) {
        setBlogs(prev => prev.map(b => 
          b.id === blogId ? { ...b, isFeatured: !b.isFeatured } : b
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: `Blog ${!blog.isFeatured ? 'added to' : 'removed from'} featured`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error toggling blog featured status:", error);
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
  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredBlogs.slice(startIndex, endIndex);

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
        <ServiceStatistics serviceName="blogs" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog Management</h1>
            <p className="text-white/70">Manage blog posts and articles</p>
          </div>
          <Button
            onClick={handleAddBlog}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Blog Post
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
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 glass-form-section rounded-md">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Featured</label>
                <select
                  value={filters.featured || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All</option>
                  <option value="featured">Featured</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
                <select
                  value={filters.category || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Sustainability">Sustainability</option>
                  <option value="Home Improvement">Home Improvement</option>
                  <option value="Design">Design</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Art">Art</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((blog) => (
            <div key={blog.id} className="glass-card hover:glass-card-hover transition-all duration-200 overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {blog.imageUrl ? (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
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
                    color={blog.status === 'published' ? "green" : blog.status === 'draft' ? "yellow" : "gray"}
                    size="sm"
                  >
                    {blog.status || 'draft'}
                  </Badge>
                </div>
                {blog.isFeatured && (
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
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {blog.title}
                  </h3>
                </div>
                
                <p className="text-sm text-white/70 mb-3 line-clamp-3">
                  {blog.excerpt || "No excerpt available"}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {(blog.categories || []).slice(0, 2).map((category, index) => (
                    <Badge key={index} color="blue" size="sm">
                      {category}
                    </Badge>
                  ))}
                  {(blog.categories || []).length > 2 && (
                    <span className="text-xs text-white/60">
                      +{(blog.categories || []).length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{blog.author || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{blog.viewCount || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{blog.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{blog.commentCount || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <span>
                    {blog.publishedAt ? formatDate(blog.publishedAt) : "Not published"}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/blog/${blog.slug}`)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBlog(blog)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit Blog"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(blog.id)}
                    className={blog.isFeatured ? "text-yellow-600 hover:text-yellow-700" : "text-gray-600 hover:text-gray-700"}
                    title={blog.isFeatured ? "Remove from Featured" : "Add to Featured"}
                  >
                    <Star className={`h-4 w-4 ${blog.isFeatured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(blog)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title="Update Status"
                  >
                    {blog.status === 'published' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBlog(blog)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete Blog"
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
            <span className="text-sm text-white/70">
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

      {/* Blog Form Modal */}
      <BlogFormModal
        blog={editingBlog}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingBlog(null);
        }}
        onSave={handleBlogSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        blog={selectedBlog}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        onConfirm={handleBlogDeleted}
      />

      {/* Status Update Modal */}
      {selectedBlog && (
        <StatusUpdateModal
          config={statusConfig}
          item={selectedBlog}
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedBlog(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}
