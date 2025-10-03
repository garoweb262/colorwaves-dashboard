"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { X } from "lucide-react";

interface ProjectRequest {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  projectType: string;
  budgetRange: string;
  location: string;
  description: string;
  images: string[];
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectRequestStatusModalProps {
  projectRequest: ProjectRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (projectRequestId: string, status: string) => void;
}

export function ProjectRequestStatusModal({ 
  projectRequest, 
  isOpen, 
  onClose, 
  onUpdateStatus 
}: ProjectRequestStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(projectRequest.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStatus === projectRequest.status) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdateStatus(projectRequest.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', color: 'green' },
    { value: 'replied', label: 'Replied', color: 'blue' },
    { value: 'declined', label: 'Declined', color: 'red' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Project Request Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Request Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Project Request</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{projectRequest.fullName}</span> -{" "}
              <span className="font-medium capitalize">{projectRequest.projectType}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Budget: {projectRequest.budgetRange} | Location: {projectRequest.location}
            </p>
          </div>

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              <span className="text-sm text-gray-600 capitalize">
                {projectRequest.status}
              </span>
            </div>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
              disabled={isSubmitting}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Description */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Status Descriptions</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p><span className="font-medium">Pending:</span> Request received, awaiting review</p>
              <p><span className="font-medium">Accepted:</span> Project request approved</p>
              <p><span className="font-medium">Replied:</span> Response sent to requester</p>
              <p><span className="font-medium">Declined:</span> Project request rejected</p>
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
              disabled={isSubmitting || selectedStatus === projectRequest.status}
              loading={isSubmitting}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
