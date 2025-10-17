"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, useToast, Badge } from "@/amal-ui";
import { ArrowLeft, Calendar, User, Eye, Heart, MessageCircle, Edit, Trash2, ToggleLeft, ToggleRight, Star, Tag, Image as ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SocialShare } from "@/components/SocialShare";
import { blogsAPI } from "@/lib/api";

interface Blog {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
    videoUrl?: string;
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

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const slug = params.slug as string;
        const response = await blogsAPI.getBlogBySlug(slug);
        
        if (response.success) {
          setBlog(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch blog details",
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: (error as any)?.response?.data?.message || "Failed to fetch blog details",
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug, addToast, router]);

  const handleEdit = () => {
    router.push(`/blog?edit=${blog?.id}`);
  };

  const handleDelete = async () => {
    if (!blog) return;
    
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await blogsAPI.deleteBlog(blog.id);
        addToast({
          variant: "success",
          title: "Success",
          description: "Blog post deleted successfully",
          duration: 3000
        });
        router.push("/blog");
      } catch (error) {
        console.error("Error deleting blog:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to delete blog post",
          duration: 5000
        });
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!blog) return;
    
    try {
      const statusMap: Record<string, string> = {
        'draft': 'published',
        'published': 'archived',
        'archived': 'draft'
      };
      const newStatus = statusMap[blog.status || 'draft'];
      const response = await blogsAPI.updateStatus(blog.id, newStatus);
      
      if (response.success) {
        setBlog(prev => prev ? { ...prev, status: newStatus as 'draft' | 'published' | 'archived' } : null);
        addToast({
          variant: "success",
          title: "Success",
          description: "Blog status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update blog status",
        duration: 5000
      });
    }
  };

  const handleToggleFeatured = async () => {
    if (!blog) return;
    
    try {
      const response = await blogsAPI.updateFeatured(blog.id, !blog.isFeatured);
      
      if (response.success) {
        setBlog(prev => prev ? { ...prev, isFeatured: !prev.isFeatured } : null);
        addToast({
          variant: "success",
          title: "Success",
          description: `Blog ${!blog.isFeatured ? 'added to' : 'removed from'} featured`,
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

  if (!blog) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-2">Blog post not found</h2>
          <Button onClick={() => router.push("/blog")}>
            Back to Blog
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
            onClick={() => router.push("/blog")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Blog
          </Button>
          <div className="flex items-center space-x-2">
            <SocialShare
              url={`${window.location.origin}/blog/${blog.slug}`}
              title={blog.title}
              description={blog.excerpt}
              imageUrl={blog.imageUrl}
              hashtags={blog.tags || []}
            />
            <Button
              variant="outline"
              onClick={handleToggleFeatured}
              leftIcon={<Star className={`h-4 w-4 ${blog.isFeatured ? 'fill-current text-yellow-500' : ''}`} />}
            >
              {blog.isFeatured ? "Unfeature" : "Feature"}
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              leftIcon={blog.status === 'published' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
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
        <div className="glass-card overflow-hidden">
          {/* Featured Image */}
          {blog.imageUrl && (
            <div className="aspect-video bg-gray-100">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
            </div>
          )}

          {/* Video Embed */}
          {blog.videoUrl && (
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${(blog.videoUrl.split('v=')[1] || '').split('&')[0]}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {/* Blog Details */}
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Badge color={getStatusColor(blog.status || 'draft')} size="md">
                  {blog.status || 'draft'}
                </Badge>
                {blog.isFeatured && (
                  <Badge color="purple" size="md">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{blog.title}</h1>
              {blog.excerpt && (
                <p className="text-lg text-white/70 mb-4">{blog.excerpt}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-white/60">
                {blog.author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{blog.author}</span>
                  </div>
                )}
                {blog.publishedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{blog.viewCount || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{blog.likeCount || 0} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{blog.commentCount || 0} comments</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            {blog.categories && blog.categories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.categories.map((category, index) => (
                    <Badge key={index} color="blue" size="sm">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} color="purple" size="md">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60">
                <div>
                  <span className="font-medium text-white/80">Created:</span> {formatDate(blog.createdAt || '')}
                </div>
                <div>
                  <span className="font-medium text-white/80">Last Updated:</span> {formatDate(blog.updatedAt || '')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
