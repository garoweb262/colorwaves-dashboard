"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Star, Calendar, User, Image as ImageIcon, Heart, MessageCircle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ImageUpload } from "@/components/ImageUpload";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images: string[];
  tags: string[];
  categories: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockBlogs: Blog[] = [
      {
        id: "1",
        title: "The Future of Sustainable Paint Technology",
        slug: "future-of-sustainable-paint-technology",
        content: "As environmental consciousness continues to grow, the paint industry is undergoing a significant transformation...",
        excerpt: "Exploring innovative sustainable paint technologies that are revolutionizing the industry.",
        featuredImage: "/images/blog/sustainable-paint.jpg",
        images: ["/images/blog/sustainable-1.jpg", "/images/blog/sustainable-2.jpg"],
        tags: ["sustainability", "technology", "innovation", "environment"],
        categories: ["Technology", "Sustainability"],
        status: "published",
        isFeatured: true,
        viewCount: 3200,
        likeCount: 145,
        commentCount: 23,
        author: "Dr. Adebayo Johnson",
        publishedAt: "2024-01-20T10:00:00Z",
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-01-20T10:00:00Z"
      },
      {
        id: "2",
        title: "Choosing the Right Paint for Your Home",
        slug: "choosing-right-paint-for-your-home",
        content: "Selecting the perfect paint for your home can be overwhelming with so many options available...",
        excerpt: "A comprehensive guide to help homeowners choose the perfect paint for their living spaces.",
        featuredImage: "/images/blog/home-paint-guide.jpg",
        images: ["/images/blog/home-1.jpg", "/images/blog/home-2.jpg", "/images/blog/home-3.jpg"],
        tags: ["home", "paint", "guide", "interior-design"],
        categories: ["Home Improvement", "Guide"],
        status: "published",
        isFeatured: false,
        viewCount: 2800,
        likeCount: 98,
        commentCount: 15,
        author: "Sarah Okafor",
        publishedAt: "2024-01-18T14:30:00Z",
        createdAt: "2024-01-18T14:30:00Z",
        updatedAt: "2024-01-18T14:30:00Z"
      },
      {
        id: "3",
        title: "Color Psychology in Interior Design",
        slug: "color-psychology-in-interior-design",
        content: "Colors have a profound impact on our emotions and behavior, making them a powerful tool in interior design...",
        excerpt: "Understanding how colors affect mood and behavior in interior spaces.",
        featuredImage: "/images/blog/color-psychology.jpg",
        images: ["/images/blog/psychology-1.jpg", "/images/blog/psychology-2.jpg"],
        tags: ["color", "psychology", "interior-design", "mood"],
        categories: ["Design", "Psychology"],
        status: "published",
        isFeatured: true,
        viewCount: 4500,
        likeCount: 210,
        commentCount: 31,
        author: "Michael Chen",
        publishedAt: "2024-01-15T09:00:00Z",
        createdAt: "2024-01-15T09:00:00Z",
        updatedAt: "2024-01-15T09:00:00Z"
      },
      {
        id: "4",
        title: "Industrial Paint Applications and Best Practices",
        slug: "industrial-paint-applications-best-practices",
        content: "Industrial painting requires specialized knowledge and techniques to ensure durability and performance...",
        excerpt: "Essential guidelines for industrial paint applications and maintenance.",
        featuredImage: "/images/blog/industrial-paint.jpg",
        images: ["/images/blog/industrial-1.jpg"],
        tags: ["industrial", "paint", "applications", "best-practices"],
        categories: ["Industrial", "Best Practices"],
        status: "draft",
        isFeatured: false,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        author: "Fatima Ibrahim",
        createdAt: "2024-01-22T16:45:00Z",
        updatedAt: "2024-01-22T16:45:00Z"
      },
      {
        id: "5",
        title: "The Art of Color Mixing and Custom Shades",
        slug: "art-of-color-mixing-custom-shades",
        content: "Creating custom paint colors is both an art and a science, requiring understanding of color theory...",
        excerpt: "Master the art of color mixing to create unique and personalized paint shades.",
        featuredImage: "/images/blog/color-mixing.jpg",
        images: ["/images/blog/mixing-1.jpg", "/images/blog/mixing-2.jpg"],
        tags: ["color-mixing", "custom", "art", "color-theory"],
        categories: ["Art", "Color Theory"],
        status: "archived",
        isFeatured: false,
        viewCount: 1200,
        likeCount: 67,
        commentCount: 8,
        author: "David Johnson",
        publishedAt: "2024-01-10T11:20:00Z",
        createdAt: "2024-01-10T11:20:00Z",
        updatedAt: "2024-01-12T15:30:00Z"
      }
    ];
    
    setBlogs(mockBlogs);
    setFilteredBlogs(mockBlogs);
    setIsLoading(false);
  }, []);

  // Filter and sort blogs
  useEffect(() => {
    let filtered = blogs.filter(blog => blog != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(blog => {
        const title = (blog.title || '').toLowerCase();
        const excerpt = (blog.excerpt || '').toLowerCase();
        const tags = blog.tags.join(' ').toLowerCase();
        const categories = blog.categories.join(' ').toLowerCase();
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
          if (key === 'category') return blog.categories.includes(value);
          if (key === 'tag') return blog.tags.includes(value);
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Blog] || '';
      const bValue = b[sortBy as keyof Blog] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, filters, sortBy, sortOrder]);

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

  const handleBlogSaved = (savedBlog: Blog) => {
    if (!savedBlog) return;
    
    if (editingBlog) {
      setBlogs(prev => prev.map(blog => blog.id === savedBlog.id ? savedBlog : blog));
    } else {
      setBlogs(prev => [...prev, savedBlog]);
    }
    setIsFormModalOpen(false);
    setEditingBlog(null);
  };

  const handleBlogDeleted = (blogId: string) => {
    if (!blogId) return;
    
    setBlogs(prev => prev.filter(blog => blog.id !== blogId));
    setIsDeleteModalOpen(false);
    setSelectedBlog(null);
  };

  const handleUpdateStatus = (blog: Blog) => {
    if (!blog) return;
    
    setSelectedBlog(blog);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (blogId: string, status: string) => {
    setBlogs(prev => prev.map(b => 
      b.id === blogId ? { ...b, status: status as 'draft' | 'published' | 'archived' } : b
    ));
  };

  const handleToggleFeatured = (blogId: string) => {
    setBlogs(prev => prev.map(b => 
      b.id === blogId ? { ...b, isFeatured: !b.isFeatured } : b
    ));
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600">Manage blog posts and articles</p>
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="publishedAt">Published Date</option>
                  <option value="viewCount">Views</option>
                  <option value="likeCount">Likes</option>
                  <option value="title">Title</option>
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

        {/* Blogs Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Title</span>
                      {getSortIcon('title')}
                    </div>
                  </TableHead>
                  <TableHead>Excerpt</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('publishedAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Published</span>
                      {getSortIcon('publishedAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {blog.featuredImage ? (
                          <img 
                            src={blog.featuredImage} 
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-gray-500">/{blog.slug}</p>
                        {blog.isFeatured && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-yellow-600">Featured</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {blog.excerpt || "No excerpt available"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {blog.categories.slice(0, 2).map((category, index) => (
                          <Badge key={index} color="blue" size="sm">
                            {category}
                          </Badge>
                        ))}
                        {blog.categories.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{blog.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{blog.author || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{blog.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{blog.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{blog.commentCount}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {blog.publishedAt ? formatDate(blog.publishedAt) : "Not published"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewBlog(blog)}
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
            totalItems={filteredBlogs.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals will be implemented next */}
    </DashboardLayout>
  );
}
