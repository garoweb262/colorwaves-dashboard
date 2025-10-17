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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Testimony Details">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        <div className="space-y-6">
          {/* Testimony Content */}
          <div className="glass-form-section p-6">
            <div className="text-lg text-white italic leading-relaxed mb-4">
              "{testimony.content}"
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{testimony.clientName}</div>
                <div className="text-sm text-white/70">{testimony.clientPosition} at {testimony.clientCompany}</div>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                testimony.isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                  : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
              }`}>
                {testimony.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Calendar className="h-4 w-4" />
              <div>
                <span className="font-medium text-white">Created:</span>
                <p className="text-white/70">{formatDate(testimony.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Edit3 className="h-4 w-4" />
              <div>
                <span className="font-medium text-white">Last Updated:</span>
                <p className="text-white/70">{formatDate(testimony.updatedAt)}</p>
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
