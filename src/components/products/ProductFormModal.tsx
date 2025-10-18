"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea, Select, Checkbox } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, productsAPI } from "@/lib/api";

interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  category: string;
  isActive: boolean;
  benefits: string[];
  features: string[];
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
  "Premium Line",
  "Standard Line"
];

export function ProductFormModal({ product, isOpen, onClose, onSave }: ProductFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrls: [] as string[],
    category: "",
    isActive: true,
    benefits: [] as string[],
    features: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        imageUrls: product.imageUrls || [],
        category: product.category,
        isActive: product.isActive,
        benefits: product.benefits || [],
        features: product.features || []
      });
    } else {
      setFormData({
        name: "",
        description: "",
        imageUrls: [],
        category: "",
        isActive: true,
        benefits: [],
        features: []
      });
    }
    setErrors({});
    setUploadedImageFiles([]);
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate images
    if (formData.imageUrls.filter(url => url.startsWith('http://') || url.startsWith('https://')).length === 0 && uploadedImageFiles.length === 0) {
      newErrors.imageUrls = "At least one image is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting || isUploadingImages) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out blob URLs from existing imageUrls (keep only real URLs)
      const existingRealUrls = formData.imageUrls.filter(url => 
        url.startsWith('http://') || url.startsWith('https://')
      );
      
      let finalImageUrls = [...existingRealUrls];

      // If there are new image files to upload, upload them first
      if (uploadedImageFiles.length > 0) {
        console.log("Starting image upload for products...", uploadedImageFiles.length, "files");
        setIsUploadingImages(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImages(uploadedImageFiles, "products");
          console.log("Upload response:", uploadResponse);
          
          if (uploadResponse.success && uploadResponse.data) {
            const newImageUrls = uploadResponse.data.map(item => item.fileUrl);
            finalImageUrls = [...finalImageUrls, ...newImageUrls];
            console.log("Successfully uploaded images:", newImageUrls);
          } else {
            console.error("Upload failed - invalid response:", uploadResponse);
            throw new Error("Failed to upload images - invalid response");
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          addToast({
            variant: "error",
            title: "Image Upload Failed",
            description: "Failed to upload images. Please try again.",
            duration: 5000
          });
          return;
        } finally {
          setIsUploadingImages(false);
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        imageUrls: finalImageUrls,
        category: formData.category,
        isActive: formData.isActive,
        benefits: formData.benefits,
        features: formData.features
      };

      let savedProduct: Product;

      if (product) {
        // Update existing product
        const response = await productsAPI.updateProduct(product.id, productData);
        if (response.success) {
          savedProduct = response.data;
          addToast({
            variant: "success",
            title: "Product Updated",
            description: `Product "${formData.name}" has been updated successfully.`,
            duration: 4000
          });
        } else {
          throw new Error("Failed to update product");
        }
      } else {
        // Create new product
        const response = await productsAPI.createProduct(productData);
        if (response.success) {
          savedProduct = response.data;
          addToast({
            variant: "success",
            title: "Product Created",
            description: `Product "${formData.name}" has been created successfully.`,
            duration: 4000
          });
        } else {
          throw new Error("Failed to create product");
        }
      }

      onSave(savedProduct!);
      onClose();
    } catch (error: any) {
      console.error("Error saving product:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: product ? "Update Failed" : "Creation Failed",
        description: error.response?.data?.message || (product 
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again."),
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
    console.log("handleImagesSelect called with:", { imageUrls, files });
    if (files) {
      console.log("Setting uploaded files:", files);
      setUploadedImageFiles(files);
    }
    // Don't update formData.imageUrls yet, as these are still local preview URLs
    // The actual URLs will be set after upload
    if (errors.imageUrls) {
      setErrors(prev => ({ ...prev, imageUrls: "" }));
    }
  };

  const handleImagesRemove = () => {
    setUploadedImageFiles([]);
    handleInputChange("imageUrls", []);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={product ? "Edit Product" : "Add New Product"}>
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <Input
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
            fullWidth
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            required
            rows={4}
            fullWidth
          />

          {/* Category */}
          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
            error={errors.category}
            fullWidth
            options={[
              { value: "", label: "Select a category" },
              ...CATEGORIES.map(category => ({
                value: category,
                label: category
              }))
            ]}
          />

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Benefits
            </label>
            <Textarea
              placeholder="Enter benefits (one per line)"
              value={formData.benefits.join('\n')}
              onChange={(e) => handleInputChange("benefits", e.target.value.split('\n').filter(item => item.trim()))}
              rows={3}
              fullWidth
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter each benefit on a new line
            </p>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Features
            </label>
            <Textarea
              placeholder="Enter features (one per line)"
              value={formData.features.join('\n')}
              onChange={(e) => handleInputChange("features", e.target.value.split('\n').filter(item => item.trim()))}
              rows={3}
              fullWidth
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter each feature on a new line
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <ImageUpload
              label="Product Images *"
              description="Upload images for this product (up to 5 images)"
              currentImages={formData.imageUrls}
              onImageSelect={() => {}} // Required prop for component, but using onImagesSelect for multiple
              onImagesSelect={handleImagesSelect}
              onImageRemove={handleImagesRemove}
              maxSize={5}
              multiple={true}
              maxImages={5}
            />
            {errors.imageUrls && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrls}</p>
            )}
          </div>

          {/* Status */}
          <div className="glass-form-section p-4">
            <Checkbox
              label="Active (visible to customers)"
              checked={formData.isActive}
              onChange={(checked) => handleInputChange("isActive", checked)}
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
              loading={isSubmitting || isUploadingImages}
              disabled={isSubmitting || isUploadingImages}
            >
              {isUploadingImages ? "Uploading Images..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
