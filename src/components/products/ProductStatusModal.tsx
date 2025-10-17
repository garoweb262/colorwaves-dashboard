"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, AlertTriangle } from "lucide-react";
import { Modal } from "@/amal-ui";

interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductStatusModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (productId: string, status: string) => void;
}

export function ProductStatusModal({ product, isOpen, onClose, onUpdateStatus }: ProductStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const handleStatusUpdate = async () => {
    setIsSubmitting(true);

    try {
      const newStatus = product.isActive ? "inactive" : "active";
      onUpdateStatus(product.id, newStatus);
    } catch (error) {
      console.error("Error updating product status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Update Product Status">
      <div className="p-6 h-[60vh] overflow-y-auto scrollbar-hide">

        <div className="space-y-6">
          {/* Warning */}
          <div className="flex items-start space-x-3 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-300 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-200">
                {product.isActive ? "Deactivate Product" : "Activate Product"}
              </h3>
              <p className="text-sm text-yellow-300 mt-1">
                {product.isActive 
                  ? "This product will be hidden from customers and won't appear in public listings."
                  : "This product will be visible to customers and appear in public listings."
                }
              </p>
            </div>
          </div>

          {/* Product Info */}
          <div className="glass-form-section p-4">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 bg-white/20 rounded-lg overflow-hidden flex-shrink-0">
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
                <h3 className="font-medium text-white mb-1">{product.name}</h3>
                <p className="text-sm text-white/70 line-clamp-2 mb-2">{product.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    {product.category}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    product.isActive 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                  }`}>
                    Current Status: {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
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
