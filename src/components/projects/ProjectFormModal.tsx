"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Input, Textarea, Checkbox } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, projectsAPI } from "@/lib/api";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string;
  technologies: string[];
  imageUrls: string[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormModalProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export function ProjectFormModal({ project, isOpen, onClose, onSave }: ProjectFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    technologies: [] as string[],
    imageUrls: [] as string[],
    startDate: "",
    endDate: "",
    isActive: true,
    videoUrl: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technologyInput, setTechnologyInput] = useState("");
  const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        client: project.client,
        technologies: project.technologies,
        imageUrls: project.imageUrls,
        startDate: project.startDate || "",
        endDate: project.endDate || "",
        isActive: project.isActive,
        videoUrl: (project as any).videoUrl || ""
      });
    } else {
      setFormData({
        title: "",
        description: "",
        client: "",
        technologies: [],
        imageUrls: [],
        startDate: "",
        endDate: "",
        isActive: true,
        videoUrl: ""
      });
    }
    setErrors({});
    setTechnologyInput("");
    setUploadedImageFiles([]);
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.client.trim()) {
      newErrors.client = "Client name is required";
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = "At least one technology is required";
    }

    if (formData.imageUrls.filter(url => url.startsWith('http://') || url.startsWith('https://')).length === 0 && uploadedImageFiles.length === 0) {
      newErrors.imageUrls = "At least one image is required";
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

      // Upload multiple images if there are new files
      if (uploadedImageFiles.length > 0) {
        setIsUploadingImages(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImages(uploadedImageFiles, "projects");
          
          if (uploadResponse.success && uploadResponse.data) {
            const newImageUrls = uploadResponse.data.map(item => item.fileUrl);
            finalImageUrls = [...finalImageUrls, ...newImageUrls];
          } else {
            throw new Error("Failed to upload images");
          }
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError);
          addToast({
            variant: "error",
            title: "Images Upload Failed",
            description: "Failed to upload images. Please try again.",
            duration: 5000
          });
          return;
        } finally {
          setIsUploadingImages(false);
        }
      }

      if (project) {
        // Update via API so backend persists videoUrl too
        const updateData = {
          title: formData.title,
          description: formData.description,
          client: formData.client,
          technologies: formData.technologies,
          imageUrls: finalImageUrls,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          isActive: formData.isActive,
          videoUrl: formData.videoUrl || undefined
        };
        const response = await projectsAPI.updateProject(project.id, updateData);
        if (response.success) {
          onSave(response.data as Project);
        } else {
          throw new Error("Failed to update project");
        }
      } else {
        // Create project data and pass to parent component
        const createData = {
          title: formData.title,
          description: formData.description,
          client: formData.client,
          technologies: formData.technologies,
          imageUrls: finalImageUrls,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          isActive: formData.isActive,
          videoUrl: formData.videoUrl || undefined
        } as any;
        
        // Pass the data to parent component to handle API call
        onSave(createData as Project);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: project ? "Update Failed" : "Creation Failed",
        description: project 
          ? "Failed to update project. Please try again."
          : "Failed to create project. Please try again.",
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
    if (files) {
      setUploadedImageFiles(files);
    }
    handleInputChange("imageUrls", imageUrls);
  };

  const addTechnology = () => {
    if (technologyInput.trim() && !formData.technologies.includes(technologyInput.trim())) {
      handleInputChange("technologies", [...formData.technologies, technologyInput.trim()]);
      setTechnologyInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    handleInputChange("technologies", formData.technologies.filter(t => t !== tech));
  };

  const addImageUrl = (url: string) => {
    if (url && !formData.imageUrls.includes(url)) {
      handleInputChange("imageUrls", [...formData.imageUrls, url]);
    }
  };

  const removeImageUrl = (url: string) => {
    handleInputChange("imageUrls", formData.imageUrls.filter(u => u !== url));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={project ? "Edit Project" : "Add New Project"}>
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <Input
            label="Project Title"
            placeholder="Enter project title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            required
            fullWidth
          />

          {/* Video URL */}
          <Input
            label="YouTube Video Link"
            placeholder="https://www.youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => handleInputChange("videoUrl", e.target.value)}
            type="url"
            fullWidth
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
            required
            fullWidth
            rows={4}
          />

          {/* Client */}
          <Input
            label="Client"
            placeholder="Enter client name"
            value={formData.client}
            onChange={(e) => handleInputChange("client", e.target.value)}
            error={errors.client}
            required
            fullWidth
          />

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Technologies *
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={technologyInput}
                onChange={(e) => setTechnologyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 glass-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Enter technology and press Enter"
              />
              <Button type="button" onClick={addTechnology} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-1 text-blue-300 hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.technologies && (
              <p className="mt-1 text-sm text-red-300">{errors.technologies}</p>
            )}
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Project Images *
            </label>
            <ImageUpload
              label="Upload Project Images"
              description="Upload images for this project"
              currentImages={formData.imageUrls}
              onImageSelect={() => {}}
              onImagesSelect={(urls, files) => handleImagesSelect(urls, files)}
              onImageRemove={() => {}}
              maxSize={10}
              multiple={true}
            />
            {errors.imageUrls && (
              <p className="mt-1 text-sm text-red-300">{errors.imageUrls}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
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
              {isUploadingImages ? "Uploading Images..." : project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
