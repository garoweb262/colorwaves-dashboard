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
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Delete Testimony">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-300 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-200">
                This action cannot be undone
              </h3>
              <p className="text-sm text-red-300 mt-1">
                This will permanently delete the testimony and remove it from all listings.
              </p>
            </div>
          </div>

          {/* Testimony Preview */}
          <div className="glass-form-section p-4">
            <div className="text-sm text-white italic mb-3 line-clamp-3">
              "{testimony.content}"
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white text-sm">{testimony.clientName}</div>
                <div className="text-xs text-white/70">{testimony.clientPosition} at {testimony.clientCompany}</div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                testimony.isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                  : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
              }`}>
                Status: {testimony.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
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
