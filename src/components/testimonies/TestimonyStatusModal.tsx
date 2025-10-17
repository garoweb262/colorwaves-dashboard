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

interface TestimonyStatusModalProps {
  testimony: Testimony;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (testimonyId: string, status: string) => void;
}

export function TestimonyStatusModal({ testimony, isOpen, onClose, onUpdateStatus }: TestimonyStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newStatus = testimony.isActive ? "inactive" : "active";
      onUpdateStatus(testimony.id, newStatus);
      onClose();
    } catch (error) {
      console.error("Error updating testimony status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Update Testimony Status">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-300 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-200">
                {testimony.isActive ? "Hide Testimony" : "Show Testimony"}
              </h3>
              <p className="text-sm text-yellow-300 mt-1">
                {testimony.isActive 
                  ? "This testimony will be hidden from the website and won't appear in public listings."
                  : "This testimony will be visible on the website and appear in public listings."
                }
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
                Current: {testimony.isActive ? "Active" : "Inactive"}
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
              className={testimony.isActive 
                ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              {testimony.isActive ? "Hide" : "Show"} Testimony
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
