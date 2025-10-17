"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, CheckCircle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface StatusUpdateModalProps {
  message?: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (status: 'pending' | 'accepted' | 'replied' | 'declined') => void;
}

export function StatusUpdateModal({ message, isOpen, onClose, onUpdate }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'accepted' | 'replied' | 'declined'>('pending');

  React.useEffect(() => {
    if (message) {
      setSelectedStatus(message.status);
    }
  }, [message]);

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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="Update Contact Message Status">
      <div className="p-6">
        

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Select the new status for this contact message.
          </p>
          
          {message && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2 text-sm">
                <p><strong>From:</strong> {message.name} ({message.email})</p>
                <p><strong>Subject:</strong> {message.subject}</p>
                <p><strong>Current Status:</strong> {message.status}</p>
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
            disabled={selectedStatus === message?.status}
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
