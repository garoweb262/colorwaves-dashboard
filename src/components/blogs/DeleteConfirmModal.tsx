"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Blog {
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
  createdAt?: string;
  updatedAt?: string;
}

interface DeleteConfirmModalProps {
  blog?: Blog | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (blogId: string) => void;
}

export function DeleteConfirmModal({ blog, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!blog) return;
    
    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onConfirm(blog.id);
      onClose();
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Delete Blog Post">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">

        <div className="space-y-6">
          
          <div className="flex items-start space-x-3 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-300 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-200">
                This action cannot be undone
              </h3>
              <p className="text-sm text-red-300 mt-1">
                This will permanently delete the blog post and remove it from all listings.
              </p>
            </div>
          </div>

          {/* Blog Info */}
          {blog && (
            <div className="glass-form-section p-4">
              <h3 className="font-medium text-white mb-2">{blog.title}</h3>
              <p className="text-sm text-white/70 line-clamp-2">{blog.excerpt || blog.content.substring(0, 150)}...</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  blog.status === 'published'
                    ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                    : blog.status === 'draft'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                }`}>
                  Status: {blog.status || 'draft'}
                </span>
                {blog.isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Featured
                  </span>
                )}
                {blog.author && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    Author: {blog.author}
                  </span>
                )}
                {blog.categories && blog.categories.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                    Categories: {blog.categories.length}
                  </span>
                )}
                {blog.tags && blog.tags.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-400/30">
                    Tags: {blog.tags.length}
                  </span>
                )}
              </div>
            </div>
          )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting || !blog}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Blog Post
          </Button>
        </div>
        </div>
      </div>
    </Modal>
  );
}
