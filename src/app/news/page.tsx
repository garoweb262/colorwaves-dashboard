"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Star, Calendar, User, Image as ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ImageUpload } from "@/components/ImageUpload";

interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  images: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  viewCount: number;
  author?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockNews: News[] = [
      {
        id: "1",
        title: "Colorwaves Launches New Eco-Friendly Paint Line",
        slug: "colorwaves-launches-new-eco-friendly-paint-line",
        content: "Colorwaves is proud to announce the launch of our new eco-friendly paint line, designed to meet the growing demand for sustainable building materials...",
        excerpt: "Revolutionary eco-friendly paint line with zero VOC emissions and sustainable packaging.",
        featuredImage: "/images/news/eco-paint-launch.jpg",
        images: ["/images/news/eco-paint-1.jpg", "/images/news/eco-paint-2.jpg"],
        tags: ["eco-friendly", "sustainability", "innovation", "paint"],
        status: "published",
        isFeatured: true,
        viewCount: 1250,
        author: "Dr. Adebayo Johnson",
        publishedAt: "2024-01-20T10:00:00Z",
        createdAt: "2024-01-20T10:00:00Z",
        updatedAt: "2024-01-20T10:00:00Z"
      },
      {
        id: "2",
        title: "Major Partnership with Abuja Construction Company",
        slug: "major-partnership-with-abuja-construction-company",
        content: "Colorwaves has entered into a strategic partnership with Abuja Construction Company to supply premium paints for their upcoming residential projects...",
        excerpt: "Strategic partnership to supply premium paints for major residential development projects.",
        featuredImage: "/images/news/partnership-announcement.jpg",
        images: ["/images/news/partnership-1.jpg"],
        tags: ["partnership", "construction", "abuja", "residential"],
        status: "published",
        isFeatured: false,
        viewCount: 890,
        author: "Sarah Okafor",
        publishedAt: "2024-01-18T14:30:00Z",
        createdAt: "2024-01-18T14:30:00Z",
        updatedAt: "2024-01-18T14:30:00Z"
      },
      {
        id: "3",
        title: "New Manufacturing Facility Opens in Lagos",
        slug: "new-manufacturing-facility-opens-in-lagos",
        content: "Our new state-of-the-art manufacturing facility in Lagos is now operational, increasing our production capacity by 300%...",
        excerpt: "State-of-the-art facility increases production capacity by 300% and creates 200 new jobs.",
        featuredImage: "/images/news/lagos-facility.jpg",
        images: ["/images/news/facility-1.jpg", "/images/news/facility-2.jpg", "/images/news/facility-3.jpg"],
        tags: ["manufacturing", "lagos", "expansion", "jobs"],
        status: "published",
        isFeatured: true,
        viewCount: 2100,
        author: "Michael Chen",
        publishedAt: "2024-01-15T09:00:00Z",
        createdAt: "2024-01-15T09:00:00Z",
        updatedAt: "2024-01-15T09:00:00Z"
      },
      {
        id: "4",
        title: "Colorwaves Wins Industry Excellence Award",
        slug: "colorwaves-wins-industry-excellence-award",
        content: "We are honored to announce that Colorwaves has been awarded the Industry Excellence Award for Innovation in Paint Technology...",
        excerpt: "Recognition for innovation in paint technology and commitment to quality.",
        featuredImage: "/images/news/award-ceremony.jpg",
        images: ["/images/news/award-1.jpg"],
        tags: ["award", "excellence", "innovation", "recognition"],
        status: "draft",
        isFeatured: false,
        viewCount: 0,
        author: "Fatima Ibrahim",
        createdAt: "2024-01-22T16:45:00Z",
        updatedAt: "2024-01-22T16:45:00Z"
      },
      {
        id: "5",
        title: "Community Outreach Program Launched",
        slug: "community-outreach-program-launched",
        content: "Colorwaves is launching a new community outreach program to provide free paint and renovation services to underserved communities...",
        excerpt: "Initiative to provide free paint and renovation services to underserved communities.",
        featuredImage: "/images/news/community-outreach.jpg",
        images: ["/images/news/outreach-1.jpg", "/images/news/outreach-2.jpg"],
        tags: ["community", "outreach", "charity", "social-responsibility"],
        status: "archived",
        isFeatured: false,
        viewCount: 450,
        author: "David Johnson",
        publishedAt: "2024-01-10T11:20:00Z",
        createdAt: "2024-01-10T11:20:00Z",
        updatedAt: "2024-01-12T15:30:00Z"
      }
    ];
    
    setNews(mockNews);
    setFilteredNews(mockNews);
    setIsLoading(false);
  }, []);

  // Filter and sort news
  useEffect(() => {
    let filtered = news.filter(newsItem => newsItem != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(newsItem => {
        const title = (newsItem.title || '').toLowerCase();
        const excerpt = (newsItem.excerpt || '').toLowerCase();
        const tags = newsItem.tags.join(' ').toLowerCase();
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
          if (key === 'tag') return newsItem.tags.includes(value);
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof News] || '';
      const bValue = b[sortBy as keyof News] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredNews(filtered);
  }, [news, searchTerm, filters, sortBy, sortOrder]);

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

  const handleNewsSaved = (savedNews: News) => {
    if (!savedNews) return;
    
    if (editingNews) {
      setNews(prev => prev.map(newsItem => newsItem.id === savedNews.id ? savedNews : newsItem));
    } else {
      setNews(prev => [...prev, savedNews]);
    }
    setIsFormModalOpen(false);
    setEditingNews(null);
  };

  const handleNewsDeleted = (newsId: string) => {
    if (!newsId) return;
    
    setNews(prev => prev.filter(newsItem => newsItem.id !== newsId));
    setIsDeleteModalOpen(false);
    setSelectedNews(null);
  };

  const handleUpdateStatus = (newsItem: News) => {
    if (!newsItem) return;
    
    setSelectedNews(newsItem);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (newsId: string, status: string) => {
    setNews(prev => prev.map(n => 
      n.id === newsId ? { ...n, status: status as 'draft' | 'published' | 'archived' } : n
    ));
  };

  const handleToggleFeatured = (newsId: string) => {
    setNews(prev => prev.map(n => 
      n.id === newsId ? { ...n, isFeatured: !n.isFeatured } : n
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
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* News Table */}
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
                  <TableHead>Tags</TableHead>
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
                  <TableHead>Views</TableHead>
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
                {paginatedData.map((newsItem) => (
                  <TableRow key={newsItem.id}>
                    <TableCell>
                      <div className="w-16 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {newsItem.featuredImage ? (
                          <img 
                            src={newsItem.featuredImage} 
                            alt={newsItem.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{newsItem.title}</p>
                        <p className="text-xs text-gray-500">/{newsItem.slug}</p>
                        {newsItem.isFeatured && (
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
                          {newsItem.excerpt || "No excerpt available"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {newsItem.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {newsItem.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{newsItem.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{newsItem.author || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(newsItem.status)}`}>
                        {newsItem.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{newsItem.viewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {newsItem.publishedAt ? formatDate(newsItem.publishedAt) : "Not published"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewNews(newsItem)}
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
            totalItems={filteredNews.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals will be implemented next */}
    </DashboardLayout>
  );
}
