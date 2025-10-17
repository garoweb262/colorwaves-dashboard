"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { X, Calendar, Edit3 } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceViewModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceViewModal({ service, isOpen, onClose }: ServiceViewModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Service Details">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        <div className="space-y-6">
          {/* Service Image */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                service.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <span className="font-medium">Created:</span>
                  <p>{formatDate(service.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Edit3 className="h-4 w-4" />
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <p>{formatDate(service.updatedAt)}</p>
                </div>
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
