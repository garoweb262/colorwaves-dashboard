"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Testimony {
  id: string;
  content: string;
  clientName: string;
  clientPosition: string;
  clientCompany: string;
  rating: number;
  clientImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DeleteConfirmModalProps {
  testimony: Testimony;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (testimonyId: string) => void;
}

export function DeleteConfirmModal({ testimony, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onConfirm(testimony.id);
      onClose();
    } catch (error) {
      console.error("Error deleting testimony:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Delete Testimony</h2>
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
          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                This action cannot be undone
              </h3>
              <p className="text-sm text-red-700 mt-1">
                This will permanently delete the testimony and remove it from all listings.
              </p>
            </div>
          </div>

          {/* Testimony Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-900 italic mb-3 line-clamp-3">
              "{testimony.content}"
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 text-sm">{testimony.clientName}</div>
                <div className="text-xs text-gray-600">{testimony.clientPosition} at {testimony.clientCompany}</div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                testimony.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                Status: {testimony.isActive ? "Active" : "Inactive"}
              </span>
            </div>
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
              onClick={handleDelete}
              loading={isDeleting}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Testimony
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
