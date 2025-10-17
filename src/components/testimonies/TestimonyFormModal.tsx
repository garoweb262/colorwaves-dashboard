"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea, Select } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, testimoniesAPI } from "@/lib/api";

interface Testimony {
  _id?: string;
  id: string;
  content: string;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  rating: number;
  clientImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TestimonyFormModalProps {
  testimony?: Testimony | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimony: Testimony) => void;
}

export function TestimonyFormModal({ testimony, isOpen, onClose, onSave }: TestimonyFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    content: "",
    clientName: "",
    clientPosition: "",
    clientCompany: "",
    rating: 5,
    clientImage: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (testimony) {
      setFormData({
        content: testimony.content,
        clientName: testimony.clientName,
        clientPosition: testimony.clientPosition,
        clientCompany: testimony.clientCompany,
        rating: testimony.rating,
        clientImage: testimony.clientImage || ""
      });
    } else {
      setFormData({
        content: "",
        clientName: "",
        clientPosition: "",
        clientCompany: "",
        rating: 5,
        clientImage: ""
      });
    }
    setErrors({});
    setUploadedImageFile(null);
  }, [testimony, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = "Testimony content is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.clientPosition.trim()) {
      newErrors.clientPosition = "Client position is required";
    }

    if (!formData.clientCompany.trim()) {
      newErrors.clientCompany = "Client company is required";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
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
      let finalImageUrl = formData.clientImage;

      // If there's a new image file to upload, upload it first
      if (uploadedImageFile) {
        console.log("Starting image upload for testimony...", uploadedImageFile.name);
        setIsUploadingImage(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImage(uploadedImageFile, "testimonies");
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
      }

      const testimonyData = {
        content: formData.content,
        clientName: formData.clientName,
        clientPosition: formData.clientPosition,
        clientCompany: formData.clientCompany,
        rating: Number(formData.rating), // Convert to number
        clientImage: finalImageUrl
      };

      let savedTestimony: Testimony;

      if (testimony) {
        // Update existing testimony
        const response = await testimoniesAPI.updateTestimony(testimony.id, testimonyData);
        if (response.success) {
          savedTestimony = response.data;
          addToast({
            variant: "success",
            title: "Testimony Updated",
            description: "Testimony has been updated successfully.",
            duration: 4000
          });
        } else {
          throw new Error("Failed to update testimony");
        }
      } else {
        // Create new testimony
        const response = await testimoniesAPI.createTestimony(testimonyData);
        if (response.success) {
          savedTestimony = response.data;
          addToast({
            variant: "success",
            title: "Testimony Created",
            description: "Testimony has been created successfully.",
            duration: 4000
          });
        } else {
          throw new Error("Failed to create testimony");
        }
      }

      onSave(savedTestimony!);
      onClose();
    } catch (error: any) {
      console.error("Error saving testimony:", error);
      
      addToast({
        variant: "error",
        title: testimony ? "Update Failed" : "Creation Failed",
        description: error.response?.data?.message || (testimony 
          ? "Failed to update testimony. Please try again."
          : "Failed to create testimony. Please try again."),
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
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
    handleInputChange("clientImage", imageUrl);
  };

  const handleImageRemove = () => {
    setUploadedImageFile(null);
    handleInputChange("clientImage", "");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={testimony ? "Edit Testimony" : "Add New Testimony"}>
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Testimony Content */}
          <Textarea
            label="Testimony Content"
            placeholder="Enter the customer's testimony..."
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            error={errors.content}
            required
            rows={4}
            fullWidth
          />

          {/* Client Name */}
          <Input
            label="Client Name"
            placeholder="Enter client's name"
            value={formData.clientName}
            onChange={(e) => handleInputChange("clientName", e.target.value)}
            error={errors.clientName}
            required
            fullWidth
          />

          {/* Client Position */}
          <Input
            label="Client Position"
            placeholder="Enter client's position"
            value={formData.clientPosition}
            onChange={(e) => handleInputChange("clientPosition", e.target.value)}
            error={errors.clientPosition}
            required
            fullWidth
          />

          {/* Client Company */}
          <Input
            label="Client Company"
            placeholder="Enter client's company"
            value={formData.clientCompany}
            onChange={(e) => handleInputChange("clientCompany", e.target.value)}
            error={errors.clientCompany}
            required
            fullWidth
          />

          {/* Rating */}
          <Select
            label="Rating"
            value={formData.rating.toString()}
            onChange={(value) => handleInputChange("rating", Number(value))}
            error={errors.rating}
            fullWidth
            options={[
              { value: "1", label: "1 Star" },
              { value: "2", label: "2 Stars" },
              { value: "3", label: "3 Stars" },
              { value: "4", label: "4 Stars" },
              { value: "5", label: "5 Stars" }
            ]}
          />

          {/* Client Image */}
          <div>
            <ImageUpload
              label="Client Image"
              description="Upload client's profile image"
              currentImage={formData.clientImage}
              onImageSelect={(imageUrl, file) => {
                console.log("ImageUpload onImageSelect called with:", { imageUrl, file });
                handleImageSelect(imageUrl, file);
              }}
              onImageRemove={handleImageRemove}
              maxSize={5}
            />
            {errors.clientImage && (
              <p className="mt-1 text-sm text-red-600">{errors.clientImage}</p>
            )}
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
              {isUploadingImage ? "Uploading Image..." : testimony ? "Update Testimony" : "Create Testimony"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
