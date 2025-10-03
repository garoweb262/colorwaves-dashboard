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
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Testimony Status</h2>
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
                {testimony.isActive ? "Hide Testimony" : "Show Testimony"}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {testimony.isActive 
                  ? "This testimony will be hidden from the website and won't appear in public listings."
                  : "This testimony will be visible on the website and appear in public listings."
                }
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
                Current: {testimony.isActive ? "Active" : "Inactive"}
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
