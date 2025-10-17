"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { X } from "lucide-react";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContactMessageStatusModalProps {
  contactMessage: ContactMessage;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (contactMessageId: string, status: string) => void;
}

export function ContactMessageStatusModal({ 
  contactMessage, 
  isOpen, 
  onClose, 
  onUpdateStatus 
}: ContactMessageStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(contactMessage.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStatus === contactMessage.status) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdateStatus(contactMessage.id, selectedStatus);
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
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Update Contact Message Status">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Message Info */}
          <div className="glass-form-section p-4">
            <h3 className="text-sm font-medium text-white mb-2">Contact Message</h3>
            <p className="text-sm text-white/80">
              <span className="font-medium text-white">{contactMessage.fullName}</span> -{" "}
              <span className="font-medium text-white">{contactMessage.subject}</span>
            </p>
            <p className="text-sm text-white/70 mt-1">
              {contactMessage.email}
            </p>
          </div>

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Current Status
            </label>
            <div className="px-3 py-2 bg-white/10 rounded-md">
              <span className="text-sm text-white capitalize">
                {contactMessage.status}
              </span>
            </div>
          </div>

          {/* New Status */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              New Status *
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
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
          <div className="glass-form-section p-4">
            <h4 className="text-sm font-medium text-white mb-2">Status Descriptions</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p><span className="font-medium text-white">Pending:</span> Message received, awaiting review</p>
              <p><span className="font-medium text-white">Accepted:</span> Message acknowledged</p>
              <p><span className="font-medium text-white">Replied:</span> Response sent to sender</p>
              <p><span className="font-medium text-white">Declined:</span> Message not actionable</p>
            </div>
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
              disabled={isSubmitting || selectedStatus === contactMessage.status}
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
