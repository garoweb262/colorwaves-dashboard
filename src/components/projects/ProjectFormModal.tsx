"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { ImageUpload } from "@/components/ImageUpload";

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    technologies: [] as string[],
    imageUrls: [] as string[],
    startDate: "",
    endDate: "",
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technologyInput, setTechnologyInput] = useState("");

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
        isActive: project.isActive
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
        isActive: true
      });
    }
    setErrors({});
    setTechnologyInput("");
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

    if (formData.imageUrls.length === 0) {
      newErrors.imageUrls = "At least one image is required";
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

      const savedProject: Project = {
        id: project?.id || Date.now().toString(),
        title: formData.title,
        slug: project?.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        client: formData.client,
        technologies: formData.technologies,
        imageUrls: formData.imageUrls,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        isActive: formData.isActive,
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(savedProject);
    } catch (error) {
      console.error("Error saving project:", error);
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {project ? "Edit Project" : "Add New Project"}
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
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
              placeholder="Enter project description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client *
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => handleInputChange("client", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                errors.client ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter client name"
            />
            {errors.client && (
              <p className="mt-1 text-sm text-red-600">{errors.client}</p>
            )}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies *
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={technologyInput}
                onChange={(e) => setTechnologyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
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
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {errors.technologies && (
              <p className="mt-1 text-sm text-red-600">{errors.technologies}</p>
            )}
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Images *
            </label>
            <ImageUpload
              label="Upload Project Images"
              description="Upload images for this project"
              currentImages={formData.imageUrls}
              onImageSelect={() => {}}
              onImagesSelect={(urls) => handleInputChange("imageUrls", urls)}
              onImageRemove={() => {}}
              maxSize={10}
              multiple={true}
            />
            {errors.imageUrls && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrls}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
              />
            </div>
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
              {project ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
