"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
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

interface DeleteConfirmModalProps {
  request?: ProjectRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ request, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="Delete Project Request">
      <div className="p-6">
        

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this project request? This action cannot be undone.
          </p>
          
          {request && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p><strong>Client:</strong> {request.clientName}</p>
                <p><strong>Project:</strong> {request.projectTitle}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Budget:</strong> {request.budget}</p>
                <p><strong>Status:</strong> {request.status}</p>
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
            Delete Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}