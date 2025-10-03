"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Testimony {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const savedTestimony: Testimony = {
        id: testimony?.id || Date.now().toString(),
        content: formData.content,
        clientName: formData.clientName,
        clientPosition: formData.clientPosition,
        clientCompany: formData.clientCompany,
        rating: formData.rating,
        clientImage: formData.clientImage,
        isActive: true, // Default to active
        createdAt: testimony?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(savedTestimony);
    } catch (error) {
      console.error("Error saving testimony:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
            {testimony ? "Edit Testimony" : "Add New Testimony"}
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
          {/* Testimony Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimony Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.content ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter the customer's testimony..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.clientName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter client's name"
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
            )}
          </div>

          {/* Client Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Position *
            </label>
            <input
              type="text"
              value={formData.clientPosition}
              onChange={(e) => handleInputChange("clientPosition", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.clientPosition ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter client's position"
            />
            {errors.clientPosition && (
              <p className="mt-1 text-sm text-red-600">{errors.clientPosition}</p>
            )}
          </div>

          {/* Client Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Company *
            </label>
            <input
              type="text"
              value={formData.clientCompany}
              onChange={(e) => handleInputChange("clientCompany", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.clientCompany ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter client's company"
            />
            {errors.clientCompany && (
              <p className="mt-1 text-sm text-red-600">{errors.clientCompany}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <select
              value={formData.rating}
              onChange={(e) => handleInputChange("rating", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.rating ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Client Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Image URL
            </label>
            <input
              type="url"
              value={formData.clientImage}
              onChange={(e) => handleInputChange("clientImage", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
              placeholder="Enter client's image URL"
            />
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
              {testimony ? "Update Testimony" : "Create Testimony"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
