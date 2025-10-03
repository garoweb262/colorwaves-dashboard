"use client";

import React, { useState } from "react";
import { Button } from "@/amal-ui";
import { X, Calendar, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
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

interface ProductViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductViewModal({ product, isOpen, onClose }: ProductViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
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
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={product.imageUrls[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
              
              {product.imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {currentImageIndex + 1} / {product.imageUrls.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.imageUrls.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Category and Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Category:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <div>
                  <span className="font-medium">Created:</span>
                  <p>{formatDate(product.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Edit3 className="h-4 w-4" />
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <p>{formatDate(product.updatedAt)}</p>
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
