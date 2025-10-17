"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Faq {
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DeleteConfirmModalProps {
  faq: Faq;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (faqId: string) => void;
}

export function DeleteConfirmModal({ faq, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onConfirm(faq.id);
      onClose();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Delete FAQ">
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
                This will permanently delete the FAQ and remove it from all listings.
              </p>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="glass-form-section p-4">
            <h3 className="font-medium text-white mb-2 line-clamp-2">{faq.question}</h3>
            <p className="text-sm text-white/70 line-clamp-3 mb-3">{faq.answer}</p>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                faq.status === 'active' 
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                  : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
              }`}>
                Status: {faq.status === 'active' ? "Active" : "Inactive"}
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
              Delete FAQ
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
