"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, newsAPI } from "@/lib/api";

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

interface NewsFormModalProps {
  news?: News | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (news: News) => void;
}

export function NewsFormModal({ news, isOpen, onClose, onSave }: NewsFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    images: [] as string[],
    tags: [] as string[],
    isFeatured: false,
    author: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImagesFiles, setUploadedImagesFiles] = useState<File[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        excerpt: news.excerpt || "",
        images: news.images || [],
        tags: news.tags || [],
        isFeatured: news.isFeatured || false,
        author: news.author || ""
      });
    } else {
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        images: [],
        tags: [],
        isFeatured: false,
        author: ""
      });
    }
    setErrors({});
    setUploadedImagesFiles([]);
    setTagInput("");
  }, [news, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "News title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "News content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImages = formData.images;

      // Upload images if there are new ones
      if (uploadedImagesFiles.length > 0) {
        setIsUploadingImage(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImages(uploadedImagesFiles, "news");
          
          if (uploadResponse.success && uploadResponse.data.length > 0) {
            const newImageUrls = uploadResponse.data.map(img => img.fileUrl);
            finalImages = [...formData.images, ...newImageUrls];
          } else {
            throw new Error("Failed to upload images");
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          addToast({
            variant: "error",
            title: "Images Upload Failed",
            description: "Failed to upload images. Please try again.",
            duration: 5000
          });
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Filter out blob URLs and only keep proper uploaded URLs
      const validImages = finalImages.filter(img => 
        typeof img === 'string' && 
        (img.startsWith('http://') || img.startsWith('https://'))
      );

      // Only send required fields to API - exclude auto-generated fields
      const newsData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        images: validImages,
        tags: formData.tags,
        isFeatured: formData.isFeatured,
        author: formData.author
      };

      if (news) {
        // Update existing news
        const response = await newsAPI.updateNews(news.id, newsData);
        onSave(response.data);
      } else {
        // Create new news
        const response = await newsAPI.createNews(newsData);
        onSave(response.data);
      }
      
      // Show success toast
      addToast({
        variant: "success",
        title: news ? "News Updated" : "News Created",
        description: news 
          ? `News "${formData.title}" has been updated successfully.`
          : `News "${formData.title}" has been created successfully.`,
        duration: 4000
      });
    } catch (error) {
      console.error("Error saving news:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: news ? "Update Failed" : "Creation Failed",
        description: news 
          ? "Failed to update news. Please try again."
          : "Failed to create news. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagesSelect = (imageUrls: string[], files?: File[]) => {
    if (files) {
      setUploadedImagesFiles(files);
    }
    handleInputChange("images", imageUrls);
  };

  const handleImagesRemove = () => {
    setUploadedImagesFiles([]);
    handleInputChange("images", []);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange("tags", formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6 h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {news ? "Edit News Article" : "Create New News Article"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter news title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.excerpt ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter news excerpt"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.content ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter news content"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
              placeholder="Enter author name"
            />
          </div>

          {/* Images */}
          <div>
            <ImageUpload
              label="News Images"
              description="Upload images for this news article"
              currentImages={formData.images}
              onImageSelect={(imageUrl, file) => handleImagesSelect([imageUrl], file ? [file] : undefined)}
              onImageRemove={handleImagesRemove}
              multiple={true}
              maxImages={10}
              maxSize={5}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                placeholder="Enter tag and press Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>


          {/* Featured */}
          <div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
                className="h-4 w-4 text-palette-violet focus:ring-palette-violet border-gray-300 rounded"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">
                Featured (show as featured news article)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || isUploadingImage}
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? "Uploading Images..." : news ? "Update News" : "Create News"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
