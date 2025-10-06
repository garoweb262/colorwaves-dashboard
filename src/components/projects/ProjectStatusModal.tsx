"use client";

import React, { useState } from "react";
import { Button, useToast } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";
import { crudAPI } from "@/lib/api";

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

interface ProjectStatusModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (projectId: string, status: string) => void;
}

export function ProjectStatusModal({ project, isOpen, onClose, onUpdateStatus }: ProjectStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(project.isActive ? 'active' : 'inactive');
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // Call the actual API endpoint
      const response = await crudAPI.updateStatus('/projects', project.id, selectedStatus);
      
      if (response.success) {
        onUpdateStatus(project.id, selectedStatus);
        onClose();
        
        addToast({
          variant: "success",
          title: "Status Updated",
          description: `Project status has been updated to ${selectedStatus}.`,
          duration: 4000
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      
      addToast({
        variant: "error",
        title: "Status Update Failed",
        description: "Failed to update project status. Please try again.",
        duration: 5000
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Project Status</h2>
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
          {/* Project Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600">Client: {project.client}</p>
            <p className="text-sm text-gray-600">
              Current Status: 
              <span className={`ml-1 font-medium ${
                project.isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {project.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              New Status
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={selectedStatus === 'active'}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-4 w-4 text-palette-violet focus:ring-palette-violet border-gray-300"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-sm text-gray-500">Project will be visible to customers</p>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={selectedStatus === 'inactive'}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-4 w-4 text-palette-violet focus:ring-palette-violet border-gray-300"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Inactive</p>
                  <p className="text-sm text-gray-500">Project will be hidden from customers</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUpdating}
              disabled={isUpdating}
            >
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
