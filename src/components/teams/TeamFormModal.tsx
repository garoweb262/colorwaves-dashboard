"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea, Select } from "@/amal-ui";
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={team ? "Edit Team Member" : "Add New Team Member"}>
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="glass-form-section p-4">
            <h3 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
                required
                fullWidth
              />

              <Input
                label="Last Name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
                required
                fullWidth
              />
            </div>

            <Input
              label="Position"
              placeholder="Enter position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              error={errors.position}
              required
              fullWidth
            />

            <Textarea
              label="Bio"
              placeholder="Enter team member bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              error={errors.bio}
              required
              fullWidth
              rows={4}
            />
          </div>

          {/* Contact Information */}
          <div className="glass-form-section p-4">
            <h3 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Contact Information</h3>
            
            <Input
              label="Email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              type="email"
              fullWidth
            />

            <Input
              label="LinkedIn"
              placeholder="Enter LinkedIn profile URL"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              type="url"
              fullWidth
            />

            <Input
              label="Twitter"
              placeholder="Enter Twitter profile URL"
              value={formData.twitter}
              onChange={(e) => handleInputChange("twitter", e.target.value)}
              type="url"
              fullWidth
            />
          </div>

          {/* Image Upload */}
          <div className="glass-form-section p-4">
            <h3 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Profile Image</h3>
            <ImageUpload
              label="Upload Profile Image"
              description="Upload a profile image for this team member"
              currentImage={formData.image}
              onImageSelect={(imageUrl, file) => handleImageSelect(imageUrl, file)}
              onImageRemove={handleImageRemove}
              maxSize={5}
            />
          </div>

          {/* Order */}
          <div className="glass-form-section p-4">
            <h3 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Display Settings</h3>
            <Input
              label="Display Order"
              placeholder="Enter display order (0 = first)"
              value={formData.order.toString()}
              onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
              type="number"
              fullWidth
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
              {isUploadingImage ? "Uploading Image..." : team ? "Update Team Member" : "Create Team Member"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
