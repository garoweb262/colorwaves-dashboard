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
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Update FAQ Status">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-300 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-200">
                {faq.status === 'active' ? "Hide FAQ" : "Show FAQ"}
              </h3>
              <p className="text-sm text-yellow-300 mt-1">
                {faq.status === 'active' 
                  ? "This FAQ will be hidden from the website and won't appear in public listings."
                  : "This FAQ will be visible on the website and appear in public listings."
                }
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
                Current Status: {faq.status === 'active' ? "Active" : "Inactive"}
              </span>
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
