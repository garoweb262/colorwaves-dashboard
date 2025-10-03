"use client";

import React, { useState } from "react";
import { Modal, Button } from "@/amal-ui";
import { X } from "lucide-react";

interface PartnershipRequest {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  partnershipType: string;
  message?: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface PartnershipRequestStatusModalProps {
  request: PartnershipRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (requestId: string, status: string) => void;
}

export function PartnershipRequestStatusModal({ request, isOpen, onClose, onUpdateStatus }: PartnershipRequestStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(request.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', color: 'green' },
    { value: 'replied', label: 'Replied', color: 'blue' },
    { value: 'declined', label: 'Declined', color: 'red' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStatus === request.status) {
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onUpdateStatus(request.id, selectedStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Request Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Partnership Request:</h3>
          <p className="text-sm text-gray-900">{request.fullName} - {request.companyName}</p>
          <p className="text-sm text-gray-500">{request.partnershipType}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
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
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStatus)}`}>
                {selectedStatus}
              </span>
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
              disabled={isSubmitting || selectedStatus === request.status}
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
