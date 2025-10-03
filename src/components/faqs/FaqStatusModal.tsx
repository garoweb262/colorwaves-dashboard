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

interface FaqStatusModalProps {
  faq: Faq;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (faqId: string, status: string) => void;
}

export function FaqStatusModal({ faq, isOpen, onClose, onUpdateStatus }: FaqStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newStatus = faq.status === 'active' ? 'inactive' : 'active';
      onUpdateStatus(faq.id, newStatus);
      onClose();
    } catch (error) {
      console.error("Error updating FAQ status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update FAQ Status</h2>
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
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {faq.status === 'active' ? "Hide FAQ" : "Show FAQ"}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {faq.status === 'active' 
                  ? "This FAQ will be hidden from the website and won't appear in public listings."
                  : "This FAQ will be visible on the website and appear in public listings."
                }
              </p>
            </div>
          </div>

          {/* FAQ Preview */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{faq.question}</h3>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">{faq.answer}</p>
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                faq.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                Current Status: {faq.status === 'active' ? "Active" : "Inactive"}
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
              onClick={handleStatusUpdate}
              loading={isSubmitting}
              disabled={isSubmitting}
              className={faq.status === 'active' 
                ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              {faq.status === 'active' ? "Hide" : "Show"} FAQ
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
