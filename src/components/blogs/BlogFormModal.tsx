"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea, Select, Checkbox } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, blogsAPI } from "@/lib/api";


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

interface BlogFormModalProps {
  blog?: Blog | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: Blog) => void;
}

export function BlogFormModal({ blog, isOpen, onClose, onSave }: BlogFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    images: [] as string[],
    tags: [] as string[],
    categories: [] as string[],
    isFeatured: false,
    author: "",
    videoUrl: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || "",
        images: blog.images || [],
        tags: blog.tags || [],
        categories: blog.categories || [],
        isFeatured: blog.isFeatured || false,
        author: blog.author || "",
        videoUrl: (blog as any).videoUrl || ""
      });
    } else {
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        images: [],
        tags: [],
        categories: [],
        isFeatured: false,
        author: "",
        videoUrl: ""
      });
    }
    setErrors({});
    setUploadedImageFile(null);
    setTagInput("");
    setCategoryInput("");
  }, [blog, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Blog title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Blog content is required";
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
      let finalImageUrl = formData.images[0] || "";

      // If there's a new image file to upload, upload it first
      if (uploadedImageFile) {
        console.log("Starting image upload for blog...", uploadedImageFile.name);
        setIsUploadingImage(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImage(uploadedImageFile, "blogs");
          console.log("Upload response:", uploadResponse);
          
          if (uploadResponse.success && uploadResponse.data.fileUrl) {
            finalImageUrl = uploadResponse.data.fileUrl;
            console.log("Successfully uploaded image:", finalImageUrl);
          } else {
            console.error("Upload failed - invalid response:", uploadResponse);
            throw new Error("Failed to upload image - invalid response");
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          addToast({
            variant: "error",
            title: "Image Upload Failed",
            description: "Failed to upload image. Please try again.",
            duration: 5000
          });
          return;
        } finally {
          setIsUploadingImage(false);
        }
      } else {
        console.log("No new image to upload for blog");
      }

      // Only send required fields to API - exclude auto-generated fields
      const blogData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        imageUrl: finalImageUrl,
        tags: formData.tags,
        categories: formData.categories,
        isFeatured: formData.isFeatured,
        author: formData.author,
        videoUrl: formData.videoUrl || ''
      };

      console.log("Submitting blog data:", blogData);

      if (blog) {
        // Update existing blog
        console.log("Updating existing blog with ID:", blog.id);
        const response = await blogsAPI.updateBlog(blog.id, blogData as any);
        console.log("Update response:", response);
        if (response.success) {
          onSave(response.data);
        } else {
          throw new Error("Failed to update blog");
        }
      } else {
        // Create new blog
        console.log("Creating new blog");
        const response = await blogsAPI.createBlog(blogData as any);
        console.log("Create response:", response);
        if (response.success) {
          onSave(response.data);
        } else {
          throw new Error("Failed to create blog");
        }
      }
      
      // Show success toast
      addToast({
        variant: "success",
        title: blog ? "Blog Updated" : "Blog Created",
        description: blog 
          ? `Blog "${formData.title}" has been updated successfully.`
          : `Blog "${formData.title}" has been created successfully.`,
        duration: 4000
      });
    } catch (error) {
      console.error("Error saving blog:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: blog ? "Update Failed" : "Creation Failed",
        description: blog 
          ? "Failed to update blog. Please try again."
          : "Failed to create blog. Please try again.",
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

  const handleImageSelect = (imageUrl: string, file?: File) => {
    console.log("handleImageSelect called with:", { imageUrl, file });
    if (file) {
      console.log("Setting uploaded file:", file);
      setUploadedImageFile(file);
    }
    handleInputChange("images", [imageUrl]);
  };

  const handleImageRemove = () => {
    setUploadedImageFile(null);
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

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      handleInputChange("categories", [...formData.categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    handleInputChange("categories", formData.categories.filter(category => category !== categoryToRemove));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={blog ? "Edit Blog Post" : "Create New Blog Post"}>
      <div className="p-6 h-[90vh] overflow-y-auto scrollbar-hide">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            required
            fullWidth
          />

          {/* Video URL */}
          <Input
            label="YouTube Video Link"
            placeholder="https://www.youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => handleInputChange("videoUrl", e.target.value)}
            type="url"
            fullWidth
          />

          {/* Excerpt */}
          <Textarea
            label="Excerpt"
            placeholder="Enter blog excerpt"
            value={formData.excerpt}
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
            rows={3}
            fullWidth
          />

          {/* Content */}
          <Textarea
            label="Content"
            placeholder="Enter blog content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            error={errors.content}
            required
            rows={8}
            fullWidth
          />

          {/* Author */}
          <Input
            label="Author"
            placeholder="Enter author name"
            value={formData.author}
            onChange={(e) => handleInputChange("author", e.target.value)}
            fullWidth
          />

          {/* Images */}
          <div>
            <ImageUpload
              label="Blog Image"
              description="Upload an image for this blog post"
              currentImage={formData.images[0] || ""}
              onImageSelect={(imageUrl, file) => {
                console.log("ImageUpload onImageSelect called with:", { imageUrl, file });
                handleImageSelect(imageUrl, file);
              }}
              onImageRemove={handleImageRemove}
              maxSize={5}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 glass-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
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
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-300 hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Categories
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                className="flex-1 glass-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Enter category and press Enter"
              />
              <Button type="button" variant="outline" onClick={addCategory}>
                Add
              </Button>
            </div>
            {formData.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-400/30"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-green-300 hover:text-green-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>


          {/* Featured */}
          <div className="glass-form-section p-4">
            <Checkbox
              label="Featured (show as featured blog post)"
              checked={formData.isFeatured}
              onChange={(checked) => handleInputChange("isFeatured", checked)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
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
              {isUploadingImage ? "Uploading Images..." : blog ? "Update Blog" : "Create Blog"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
