"use client";

import React, { useState } from "react";
import { Button, useToast } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";
import { crudAPI } from "@/lib/api";

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceStatusModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (serviceId: string, status: string) => void;
}

export function ServiceStatusModal({ service, isOpen, onClose, onUpdateStatus }: ServiceStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleStatusUpdate = async () => {
    if (!service) return;
    
    setIsSubmitting(true);

    try {
      const newStatus = service.isActive ? "inactive" : "active";
      
      // Call the actual API endpoint
      const response = await crudAPI.updateStatus('/services', service.id, newStatus);
      
      if (response.success) {
        onUpdateStatus(service.id, newStatus);
        onClose();
        
        addToast({
          variant: "success",
          title: "Status Updated",
          description: `Service status has been updated to ${newStatus}.`,
          duration: 4000
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating service status:", error);
      
      addToast({
        variant: "error",
        title: "Status Update Failed",
        description: "Failed to update service status. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Service Status</h2>
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
          {service && (
            <>
              {/* Warning */}
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    {service.isActive ? "Deactivate Service" : "Activate Service"}
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {service.isActive 
                      ? "This service will be hidden from customers and won't appear in public listings."
                      : "This service will be visible to customers and appear in public listings."
                    }
                  </p>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Current Status: {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </>
          )}

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
              disabled={isSubmitting || !service}
              className={service?.isActive 
                ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              {service?.isActive ? "Deactivate" : "Activate"} Service
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
