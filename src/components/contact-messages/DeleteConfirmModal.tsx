"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
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

interface DeleteConfirmModalProps {
  message?: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ message, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Contact Message</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this contact message? This action cannot be undone.
          </p>
          
          {message && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p><strong>From:</strong> {message.name} ({message.email})</p>
                <p><strong>Subject:</strong> {message.subject}</p>
                <p><strong>Status:</strong> {message.status}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={onConfirm}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete Message
          </Button>
        </div>
      </div>
    </Modal>
  );
}
