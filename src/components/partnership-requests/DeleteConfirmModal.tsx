"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";

interface Partnership {
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

interface DeleteConfirmModalProps {
  partnership: Partnership;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (partnershipId: string) => void;
}

export function DeleteConfirmModal({ 
  partnership, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onConfirm(partnership.id);
    } catch (error) {
      console.error("Error deleting partnership:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Delete Partnership Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Warning</h3>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. The partnership request will be permanently deleted.
              </p>
            </div>
          </div>

          {/* Partnership Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Partnership Request Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Contact:</span>
                <span className="ml-2 text-gray-600">{partnership.fullName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Company:</span>
                <span className="ml-2 text-gray-600">{partnership.companyName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{partnership.email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600 capitalize">{partnership.partnershipType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 text-gray-600 capitalize">{partnership.status}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this partnership request? This action cannot be undone.
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
              onClick={handleDelete}
              disabled={isDeleting}
              loading={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Partnership Request"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
