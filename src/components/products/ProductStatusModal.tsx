"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductStatusModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (productId: string, status: string) => void;
}

export function ProductStatusModal({ product, isOpen, onClose, onUpdateStatus }: ProductStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newStatus = product.isActive ? "inactive" : "active";
      onUpdateStatus(product.id, newStatus);
      onClose();
    } catch (error) {
      console.error("Error updating product status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Update Product Status</h2>
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
                {product.isActive ? "Deactivate Product" : "Activate Product"}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {product.isActive 
                  ? "This product will be hidden from customers and won't appear in public listings."
                  : "This product will be visible to customers and appear in public listings."
                }
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {product.category}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Current Status: {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
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
              className={product.isActive 
                ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              {product.isActive ? "Deactivate" : "Activate"} Product
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
