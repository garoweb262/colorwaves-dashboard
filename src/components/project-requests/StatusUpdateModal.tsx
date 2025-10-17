"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, CheckCircle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface ProjectRequest {
  id: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  projectTitle: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  images: string[];
  services: string[];
  website: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface StatusUpdateModalProps {
  request?: ProjectRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (status: 'pending' | 'accepted' | 'replied' | 'declined') => void;
}

export function StatusUpdateModal({ request, isOpen, onClose, onUpdate }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'accepted' | 'replied' | 'declined'>('pending');

  React.useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
    }
  }, [request]);

  const handleUpdate = () => {
    onUpdate(selectedStatus);
    onClose();
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'accepted', label: 'Accepted', color: 'green' },
    { value: 'replied', label: 'Replied', color: 'blue' },
    { value: 'declined', label: 'Declined', color: 'gray' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="Update Project Request Status">
      <div className="p-6">
       

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Select the new status for this project request.
          </p>
          
          {request && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <p><strong>Client:</strong> {request.clientName}</p>
                <p><strong>Project:</strong> {request.projectTitle}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Current Status:</strong> {request.status}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value as any)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedStatus === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={selectedStatus === request?.status}
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
