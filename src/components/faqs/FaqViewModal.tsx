"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { X, Calendar, Edit3, HelpCircle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Faq {
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FaqViewModalProps {
  faq: Faq;
  isOpen: boolean;
  onClose: () => void;
}

export function FaqViewModal({ faq, isOpen, onClose }: FaqViewModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="FAQ Details">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">

        <div className="space-y-6">
          {/* FAQ Content */}
          <div className="glass-form-section p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Question</h3>
                <p className="text-white/70 leading-relaxed">{faq.question}</p>
              </div>
            </div>

            <div className="border-l-4 border-green-500/50 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">Answer</h3>
              <p className="text-white/70 leading-relaxed">{faq.answer}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-white/80">Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              faq.status === 'active' 
                ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
            }`}>
              {faq.status === 'active' ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Calendar className="h-4 w-4" />
              <div>
                <span className="font-medium text-white">Created:</span>
                <p className="text-white/70">{formatDate(faq.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Edit3 className="h-4 w-4" />
              <div>
                <span className="font-medium text-white">Last Updated:</span>
                <p className="text-white/70">{formatDate(faq.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
