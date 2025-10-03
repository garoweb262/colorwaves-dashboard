"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";

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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [service, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.imageUrl.trim()) {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const savedService: Service = {
        id: service?.id || Date.now().toString(),
        name: formData.name,
        slug: service?.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
        createdAt: service?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(savedService);
    } catch (error) {
      console.error("Error saving service:", error);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {service ? "Edit Service" : "Add New Service"}
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
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter service name"
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
              placeholder="Enter service description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <ImageUpload
              label="Service Image *"
              description="Upload an image for this service"
              currentImage={formData.imageUrl}
              onImageSelect={(imageUrl) => handleInputChange("imageUrl", imageUrl)}
              onImageRemove={() => handleInputChange("imageUrl", "")}
              maxSize={5}
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
              {service ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
