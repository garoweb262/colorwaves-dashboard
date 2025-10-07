"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, useToast, Badge } from "@/amal-ui";
import { ArrowLeft, Calendar, User, Eye, Heart, Edit, Trash2, ToggleLeft, ToggleRight, Star, Tag } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { newsAPI } from "@/lib/api";

interface News {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  viewCount?: number;
  likeCount?: number;
  author?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const slug = params.slug as string;
        const response = await newsAPI.getNewsBySlug(slug);
        
        if (response.success) {
          setNews(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch news details",
            duration: 5000
          });
          router.push("/news");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "News article not found",
          duration: 5000
        });
        router.push("/news");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchNews();
    }
  }, [params.slug, addToast, router]);

  const handleEdit = () => {
    router.push(`/news?edit=${news?.id}`);
  };

  const handleDelete = async () => {
    if (!news) return;
    
    if (confirm("Are you sure you want to delete this news article?")) {
      try {
        await newsAPI.deleteNews(news.id);
        addToast({
          variant: "success",
          title: "Success",
          description: "News article deleted successfully",
          duration: 3000
        });
        router.push("/news");
      } catch (error) {
        console.error("Error deleting news:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to delete news article",
          duration: 5000
        });
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!news) return;
    
    try {
      const statusMap: Record<string, string> = {
        'draft': 'published',
        'published': 'archived',
        'archived': 'draft'
      };
      const newStatus = statusMap[news.status || 'draft'];
      const response = await newsAPI.updateStatus(news.id, newStatus);
      
      if (response.success) {
        setNews(prev => prev ? { ...prev, status: newStatus as 'draft' | 'published' | 'archived' } : null);
        addToast({
          variant: "success",
          title: "Success",
          description: "News status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update news status",
        duration: 5000
      });
    }
  };

  const handleToggleFeatured = async () => {
    if (!news) return;
    
    try {
      const response = await newsAPI.updateFeatured(news.id, !news.isFeatured);
      
      if (response.success) {
        setNews(prev => prev ? { ...prev, isFeatured: !prev.isFeatured } : null);
        addToast({
          variant: "success",
          title: "Success",
          description: `News ${!news.isFeatured ? 'added to' : 'removed from'} featured`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update featured status",
        duration: 5000
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'yellow';
      case 'published': return 'green';
      case 'archived': return 'gray';
      default: return 'gray';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!news) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">News article not found</h2>
          <Button onClick={() => router.push("/news")}>
            Back to News
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/news")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to News
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleToggleFeatured}
              leftIcon={<Star className={`h-4 w-4 ${news.isFeatured ? 'fill-current text-yellow-500' : ''}`} />}
            >
              {news.isFeatured ? "Unfeature" : "Feature"}
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              leftIcon={news.status === 'published' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            >
              Change Status
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-destructive hover:text-destructive-600"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          {news.imageUrl && (
            <div className="aspect-video bg-gray-100">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
            </div>
          )}

          {/* News Details */}
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Badge color={getStatusColor(news.status || 'draft')} size="md">
                  {news.status || 'draft'}
                </Badge>
                {news.isFeatured && (
                  <Badge color="purple" size="md">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{news.title}</h1>
              {news.excerpt && (
                <p className="text-lg text-gray-600 mb-4">{news.excerpt}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {news.author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{news.author}</span>
                  </div>
                )}
                {news.publishedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(news.publishedAt)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{news.viewCount || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{news.likeCount || 0} likes</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {news.content}
              </div>
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} color="blue" size="md">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {formatDate(news.createdAt || '')}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {formatDate(news.updatedAt || '')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
