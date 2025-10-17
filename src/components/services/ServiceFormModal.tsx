"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea, Checkbox } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceFormModalProps {
  service?: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
}

export function ServiceFormModal({ service, isOpen, onClose, onSave }: ServiceFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        imageUrl: service.imageUrl,
        isActive: service.isActive
      });
    } else {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isActive: true
      });
    }
    setErrors({});
    setUploadedImageFile(null);
  }, [service, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.imageUrl.trim() && !uploadedImageFile) {
      newErrors.imageUrl = "Image is required";
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
      let finalImageUrl = formData.imageUrl;

      // If there's a new image file to upload, upload it first
      if (uploadedImageFile) {
        setIsUploadingImage(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImage(uploadedImageFile, "images");
          
          if (uploadResponse.success && uploadResponse.data.fileUrl) {
            finalImageUrl = uploadResponse.data.fileUrl;
          } else {
            throw new Error("Failed to upload image");
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
      }

      if (service) {
        // For edit, only send the editable fields
        const updateData = {
          name: formData.name,
          description: formData.description,
          imageUrl: finalImageUrl,
          isActive: formData.isActive
        };
        onSave(updateData as Service);
      } else {
        // For create, send all fields
        const savedService: Service = {
          id: Date.now().toString(),
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          imageUrl: finalImageUrl,
          isActive: formData.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onSave(savedService);
      }
      
      // Show success toast
      addToast({
        variant: "success",
        title: service ? "Service Updated" : "Service Created",
        description: service 
          ? `Service "${formData.name}" has been updated successfully.`
          : `Service "${formData.name}" has been created successfully.`,
        duration: 4000
      });
    } catch (error) {
      console.error("Error saving service:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: service ? "Update Failed" : "Creation Failed",
        description: service 
          ? "Failed to update service. Please try again."
          : "Failed to create service. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageSelect = (imageUrl: string, file?: File) => {
    if (file) {
      setUploadedImageFile(file);
    }
    handleInputChange("imageUrl", imageUrl);
  };

  const handleImageRemove = () => {
    setUploadedImageFile(null);
    handleInputChange("imageUrl", "");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={service ? "Edit Service" : "Add New Service"}>
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <Input
            label="Service Name"
            placeholder="Enter service name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
            fullWidth
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter service description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            required
            fullWidth
            rows={4}
          />

          {/* Image Upload */}
          <div>
            <ImageUpload
              label="Service Image *"
              description="Upload an image for this service"
              currentImage={formData.imageUrl}
              onImageSelect={(imageUrl, file) => handleImageSelect(imageUrl, file)}
              onImageRemove={handleImageRemove}
              maxSize={5}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
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
              loading={isSubmitting || isUploadingImage}
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? "Uploading Image..." : service ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
