"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, teamsAPI } from "@/lib/api";

interface Team {
  _id?: string;
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
  const { addToast } = useToast();
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
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
    setUploadedImageFile(null);
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
      let finalImageUrl = formData.image;

      // Upload image if there's a new file
      if (uploadedImageFile) {
        setIsUploadingImage(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImage(uploadedImageFile, "teams");
          
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

      const teamData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        position: formData.position,
        bio: formData.bio,
        email: formData.email || undefined,
        linkedin: formData.linkedin || undefined,
        twitter: formData.twitter || undefined,
        image: finalImageUrl || undefined
      };

      let savedTeam: Team;

      if (team) {
        // Update existing team member
        const response = await teamsAPI.updateTeam(team.id, teamData);
        if (response.success) {
          savedTeam = response.data;
          addToast({
            variant: "success",
            title: "Team Member Updated",
            description: `Team member "${formData.firstName} ${formData.lastName}" has been updated successfully.`,
            duration: 4000
          });
        } else {
          throw new Error("Failed to update team member");
        }
      } else {
        // Create new team member
        const response = await teamsAPI.createTeam(teamData);
        if (response.success) {
          savedTeam = response.data;
          addToast({
            variant: "success",
            title: "Team Member Created",
            description: `Team member "${formData.firstName} ${formData.lastName}" has been created successfully.`,
            duration: 4000
          });
        } else {
          throw new Error("Failed to create team member");
        }
      }

      onSave(savedTeam!);
      onClose();
    } catch (error: any) {
      console.error("Error saving team member:", error);
      
      addToast({
        variant: "error",
        title: team ? "Update Failed" : "Creation Failed",
        description: error.response?.data?.message || (team 
          ? "Failed to update team member. Please try again."
          : "Failed to create team member. Please try again."),
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
    if (file) {
      setUploadedImageFile(file);
    }
    handleInputChange("image", imageUrl);
  };

  const handleImageRemove = () => {
    setUploadedImageFile(null);
    handleInputChange("image", "");
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

          {/* Image Upload */}
          <div>
            <ImageUpload
              label="Team Member Image"
              description="Upload an image for this team member"
              currentImage={formData.image}
              onImageSelect={(imageUrl, file) => handleImageSelect(imageUrl, file)}
              onImageRemove={handleImageRemove}
              maxSize={5}
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
              loading={isSubmitting || isUploadingImage}
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage ? "Uploading Image..." : team ? "Update Team Member" : "Create Team Member"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
