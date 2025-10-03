"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { X, Calendar, Edit3 } from "lucide-react";
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

interface TestimonyViewModalProps {
  testimony: Testimony;
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonyViewModal({ testimony, isOpen, onClose }: TestimonyViewModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Testimony Details</h2>
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
          {/* Testimony Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-lg text-gray-900 italic leading-relaxed mb-4">
              "{testimony.content}"
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{testimony.clientName}</div>
                <div className="text-sm text-gray-600">{testimony.clientPosition} at {testimony.clientCompany}</div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                testimony.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {testimony.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <div>
                <span className="font-medium">Created:</span>
                <p>{formatDate(testimony.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Edit3 className="h-4 w-4" />
              <div>
                <span className="font-medium">Last Updated:</span>
                <p>{formatDate(testimony.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
