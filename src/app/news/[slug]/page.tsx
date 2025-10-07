"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { ArrowLeft, Calendar, User, Eye, Tag, Edit, Trash2, Star } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import * as API from "@/lib/api";
import { NewsFormModal } from "@/components/news/NewsFormModal";

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

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingFeatured, setIsUpdatingFeatured] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const response = await API.newsAPI.getNewsBySlug(params.slug);
        if (response.success) {
          setNews(response.data);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [params.slug]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleNewsSaved = async (updatedNews: News) => {
    setNews(updatedNews);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!news) return;

    if (confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await API.newsAPI.deleteNews(news.id);
        if (response.success) {
          router.push('/news');
        }
      } catch (error) {
        console.error('Failed to delete news:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!news) return;

    try {
      setIsUpdatingStatus(true);
      const response = await API.newsAPI.updateStatus(news.id, status);
      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!news) return;

    try {
      setIsUpdatingFeatured(true);
      const response = await API.newsAPI.updateFeatured(news.id, !news.isFeatured);
      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
    } finally {
      setIsUpdatingFeatured(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-palette-violet"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!news) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">News Article Not Found</h2>
            <p className="text-gray-600 mb-4">The news article you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/news')}>
              Back to News Articles
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/news')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{news.title}</h1>
              <p className="text-gray-600">News article details and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              color={news.status === 'published' ? "green" : news.status === 'draft' ? "yellow" : "gray"}
              size="lg"
            >
              {news.status ? news.status.charAt(0).toUpperCase() + news.status.slice(1) : 'Draft'}
            </Badge>
            {news.isFeatured && (
              <Badge color="purple" size="lg">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* News Images */}
            {news.images && news.images.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="aspect-video">
                  <img
                    src={news.images[0]}
                    alt={news.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              </div>
            )}

            {/* News Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} color="blue" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* News Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">News Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Views
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{news.viewCount || 0}</span>
                </div>
              </div>
            </div>

            {/* News Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">News Information</h3>
              
              <div className="space-y-3">
                {news.author && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{news.author}</p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {news.publishedAt ? formatDate(news.publishedAt) : formatDate(news.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {news.publishedAt ? 'Published' : 'Created'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Actions</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={handleEdit}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit News Article
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleToggleFeatured}
                  loading={isUpdatingFeatured}
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {news.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                </Button>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('published')}
                    loading={isUpdatingStatus}
                    disabled={news.status === 'published'}
                  >
                    Publish
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('draft')}
                    loading={isUpdatingStatus}
                    disabled={news.status === 'draft'}
                  >
                    Save as Draft
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('archived')}
                    loading={isUpdatingStatus}
                    disabled={news.status === 'archived'}
                  >
                    Archive
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  loading={isDeleting}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete News Article
                </Button>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-xs text-gray-500">{formatDate(news.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-500">{formatDate(news.updatedAt)}</p>
                </div>
                
                {news.publishedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Published</p>
                    <p className="text-xs text-gray-500">{formatDate(news.publishedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <NewsFormModal
            news={news}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleNewsSaved}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
