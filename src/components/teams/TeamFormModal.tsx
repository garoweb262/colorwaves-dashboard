"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Team {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  image?: string;
  order?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamFormModalProps {
  team?: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: Team) => void;
}

export function TeamFormModal({ team, isOpen, onClose, onSave }: TeamFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    bio: "",
    email: "",
    linkedin: "",
    twitter: "",
    image: "",
    order: 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        firstName: team.firstName,
        lastName: team.lastName,
        position: team.position,
        bio: team.bio,
        email: team.email || "",
        linkedin: team.linkedin || "",
        twitter: team.twitter || "",
        image: team.image || "",
        order: team.order || 0
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        position: "",
        bio: "",
        email: "",
        linkedin: "",
        twitter: "",
        image: "",
        order: 0
      });
    }
    setErrors({});
  }, [team, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }

    if (formData.twitter && !formData.twitter.includes('twitter.com')) {
      newErrors.twitter = "Please enter a valid Twitter URL";
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

      const savedTeam: Team = {
        id: team?.id || Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        bio: formData.bio,
        email: formData.email || undefined,
        linkedin: formData.linkedin || undefined,
        twitter: formData.twitter || undefined,
        image: formData.image || undefined,
        order: formData.order,
        status: "ACTIVE", // Default status
        createdAt: team?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(savedTeam);
    } catch (error) {
      console.error("Error saving team member:", error);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {team ? "Edit Team Member" : "Add New Team Member"}
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
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.firstName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.lastName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position *
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.position ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter position"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.bio ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter team member's bio..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.linkedin ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
            )}
          </div>

          {/* Twitter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => handleInputChange("twitter", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.twitter ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="https://twitter.com/username"
            />
            {errors.twitter && (
              <p className="mt-1 text-sm text-red-600">{errors.twitter}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
              placeholder="Enter image URL"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
              placeholder="Enter display order"
              min="0"
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
              {team ? "Update Team Member" : "Create Team Member"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
