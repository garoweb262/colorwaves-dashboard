"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";

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

interface DeleteConfirmModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectId: string) => void;
}

export function DeleteConfirmModal({ project, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConfirm(project.id);
      onClose();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Delete Project</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Warning Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          {/* Warning Message */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete this project?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. The project will be permanently removed from the system.
            </p>
          </div>

          {/* Project Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
            <p className="text-sm text-gray-600">Client: {project.client}</p>
            <p className="text-sm text-gray-600">
              Technologies: {project.technologies.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              Status: 
              <span className={`ml-1 font-medium ${
                project.isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {project.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
