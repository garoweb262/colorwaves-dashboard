"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { ArrowLeft, Calendar, User, Eye, Heart, MessageCircle, Tag, Edit, Trash2, Star } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import * as API from "@/lib/api";
import { BlogFormModal } from "@/components/blogs/BlogFormModal";

interface Blog {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  images?: string[];
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

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingFeatured, setIsUpdatingFeatured] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        const response = await API.blogsAPI.getBlogBySlug(params.slug);
        if (response.success) {
          setBlog(response.data);
        }
      } catch (error) {
        console.error('Failed to load blog:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [params.slug]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlogSaved = async (updatedBlog: Blog) => {
    setBlog(updatedBlog);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!blog) return;

    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        const response = await API.blogsAPI.deleteBlog(blog.id);
        if (response.success) {
          router.push('/blog');
        }
      } catch (error) {
        console.error('Failed to delete blog:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!blog) return;

    try {
      setIsUpdatingStatus(true);
      const response = await API.blogsAPI.updateStatus(blog.id, status);
      if (response.success) {
        setBlog(response.data);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!blog) return;

    try {
      setIsUpdatingFeatured(true);
      const response = await API.blogsAPI.updateFeatured(blog.id, !blog.isFeatured);
      if (response.success) {
        setBlog(response.data);
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

  if (!blog) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Blog Post Not Found</h2>
            <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/blog')}>
              Back to Blog Posts
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
              onClick={() => router.push('/blog')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>
              <p className="text-gray-600">Blog post details and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              color={blog.status === 'published' ? "green" : blog.status === 'draft' ? "yellow" : "gray"}
              size="lg"
            >
              {blog.status ? blog.status.charAt(0).toUpperCase() + blog.status.slice(1) : 'Draft'}
            </Badge>
            {blog.isFeatured && (
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
            {/* Blog Images */}
            {blog.images && blog.images.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="aspect-video">
                  <img
                    src={blog.images[0]}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Blog Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </div>

            {/* Tags and Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blog.tags && blog.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <Badge key={index} color="blue" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {blog.categories && blog.categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.categories.map((category, index) => (
                        <Badge key={index} color="green" size="sm">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blog Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Views
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{blog.viewCount || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Likes
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{blog.likeCount || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comments
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{blog.commentCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Blog Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Information</h3>
              
              <div className="space-y-3">
                {blog.author && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{blog.author}</p>
                      <p className="text-xs text-gray-500">Author</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {blog.publishedAt ? formatDate(blog.publishedAt) : formatDate(blog.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {blog.publishedAt ? 'Published' : 'Created'}
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
                  Edit Blog Post
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleToggleFeatured}
                  loading={isUpdatingFeatured}
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {blog.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                </Button>
                
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('published')}
                    loading={isUpdatingStatus}
                    disabled={blog.status === 'published'}
                  >
                    Publish
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('draft')}
                    loading={isUpdatingStatus}
                    disabled={blog.status === 'draft'}
                  >
                    Save as Draft
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate('archived')}
                    loading={isUpdatingStatus}
                    disabled={blog.status === 'archived'}
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
                  Delete Blog Post
                </Button>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-500">{formatDate(blog.updatedAt)}</p>
                </div>
                
                {blog.publishedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Published</p>
                    <p className="text-xs text-gray-500">{formatDate(blog.publishedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <BlogFormModal
            blog={blog}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSave={handleBlogSaved}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
