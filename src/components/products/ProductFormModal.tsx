"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { FileUpload } from "@/components/FileUpload";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  imageUrl?: string; // Single image URL for new API integration
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const CATEGORIES = [
  "Paints Line",
  "Other Solutions"
];

export function ProductFormModal({ product, isOpen, onClose, onSave }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrls: [] as string[],
    imageUrl: "", // Single image URL
    category: "",
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        imageUrls: product.imageUrls,
        imageUrl: product.imageUrl || "",
        category: product.category,
        isActive: product.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        imageUrls: [],
        imageUrl: "",
        category: "",
        isActive: true
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate either imageUrls or imageUrl
    if (formData.imageUrls.length === 0 && !formData.imageUrl) {
      newErrors.imageUrls = "At least one image is required";
    }

    if (formData.imageUrls.length > 5) {
      newErrors.imageUrls = "Maximum 5 images allowed";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const savedProduct: Product = {
        id: product?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        imageUrls: formData.imageUrls,
        imageUrl: formData.imageUrl,
        category: formData.category,
        isActive: formData.isActive,
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(savedProduct);
    } catch (error) {
      console.error("Error saving product:", error);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
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
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.category ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Image Upload - Multiple Images (Legacy) */}
          <div>
            <ImageUpload
              label="Product Images (Multiple)"
              description="Upload up to 5 images for this product"
              multiple={true}
              maxImages={5}
              currentImages={formData.imageUrls}
              onImageSelect={() => {}}
              onImagesSelect={(imageUrls) => handleInputChange("imageUrls", imageUrls)}
              maxSize={5}
            />
            {errors.imageUrls && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrls}</p>
            )}
          </div>

          {/* Single Image Upload (New API Integration) */}
          <div>
            <FileUpload
              label="Product Image (Single) *"
              description="Upload a single image for this product"
              accept="image/*"
              maxSize={5}
              folder="products"
              showPreview={true}
              currentFile={formData.imageUrl}
              onFileUpload={(fileUrl, fileName) => {
                handleInputChange("imageUrl", fileUrl);
              }}
              onFileRemove={() => {
                handleInputChange("imageUrl", "");
              }}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="h-4 w-4 text-palette-violet focus:ring-palette-violet border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active (visible to customers)
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
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
