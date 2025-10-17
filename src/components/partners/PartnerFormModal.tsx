"use client";

import React, { useEffect, useState } from "react";
import { Button, useToast, Input } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { X } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { partnersAPI, uploadAPI } from "@/lib/api";

interface Partner {
  _id?: string;
  id: string;
  name: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PartnerFormModalProps {
  partner?: Partner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partner) => void;
}

export function PartnerFormModal({ partner, isOpen, onClose, onSave }: PartnerFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        imageUrl: partner.imageUrl || "",
      });
    } else {
      setFormData({ name: "", imageUrl: "" });
    }
    setErrors({});
    setUploadedImageFile(null);
  }, [partner, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleImageSelect = (imageUrl: string, file?: File) => {
    if (file) setUploadedImageFile(file);
    handleInputChange("imageUrl", imageUrl);
  };

  const handleImageRemove = () => {
    setUploadedImageFile(null);
    handleInputChange("imageUrl", "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (uploadedImageFile) {
        setIsUploadingImage(true);
        try {
          const uploadResponse = await uploadAPI.uploadImage(uploadedImageFile, "partners");
          if (uploadResponse.success && uploadResponse.data.fileUrl) {
            finalImageUrl = uploadResponse.data.fileUrl;
          } else {
            throw new Error("Failed to upload image");
          }
        } finally {
          setIsUploadingImage(false);
        }
      }

      const payload = { name: formData.name, imageUrl: finalImageUrl };
      let saved: Partner;
      if (partner) {
        const response = await partnersAPI.updatePartner(partner.id, payload);
        saved = response.data;
        addToast({ variant: "success", title: "Partner Updated", description: `"${formData.name}" updated successfully.` });
      } else {
        const response = await partnersAPI.createPartner(payload);
        saved = response.data;
        addToast({ variant: "success", title: "Partner Created", description: `"${formData.name}" created successfully.` });
      }
      onSave(saved);
      onClose();
    } catch (error: any) {
      addToast({ variant: "error", title: partner ? "Update Failed" : "Creation Failed", description: error.response?.data?.message || 'Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title={partner ? "Edit Partner" : "Add Partner"}>
      <div className="p-6 h-[80vh] flex flex-col">

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            <Input
              label="Name"
              placeholder="Enter partner name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              fullWidth
            />

            <div>
            <ImageUpload
              label="Partner Logo"
              description="Upload the partner's logo"
              currentImage={formData.imageUrl}
              onImageSelect={(imageUrl, file) => handleImageSelect(imageUrl, file)}
              onImageRemove={handleImageRemove}
              maxSize={5}
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting || isUploadingImage} disabled={isSubmitting || isUploadingImage}>
              {isUploadingImage ? "Uploading Image..." : partner ? "Update Partner" : "Create Partner"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}


