"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Button } from '@/amal-ui';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { CRUDDeleteModalProps } from '../types';

export function CRUDDeleteModal({ config, item, isOpen, onClose, onConfirm, isLoading = false }: CRUDDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      await onConfirm(item.id);
    } catch (error) {
      console.error(`Error deleting ${config.entityName}:`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPrimaryField = () => {
    // Try to find a primary field (name, title, etc.)
    const primaryFields = ['name', 'title', 'firstName', 'lastName', 'email'];
    for (const field of primaryFields) {
      if (item[field]) {
        return item[field];
      }
    }
    return `${config.entityName} #${item.id}`;
  };

  const getDisplayFields = () => {
    // Get fields that should be displayed in the delete confirmation
    const displayFields = config.formFields.filter(field => 
      field.key !== 'password' && 
      field.key !== 'confirmPassword' &&
      !field.key.toLowerCase().includes('secret') &&
      !field.key.toLowerCase().includes('token') &&
      item[field.key] !== null &&
      item[field.key] !== undefined &&
      item[field.key] !== ''
    );

    return displayFields.slice(0, 5); // Limit to 5 fields for display
  };

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Check if it's a date field
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key.toLowerCase().includes('created') || key.toLowerCase().includes('updated')) {
      try {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      } catch {
        return value.toString();
      }
    }
    
    // Check if it's a boolean field
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value.toString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title=""
    >
      <div className="text-center space-y-6">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete {config.entityName}
          </h3>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {getPrimaryField()}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Item Details */}
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <div className="space-y-2">
            {getDisplayFields().map(field => (
              <div key={field.key} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">{field.label}:</span>
                <span className="font-medium text-gray-900">
                  {formatValue(item[field.key], field.key)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting || isLoading}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isDeleting || isLoading}
            leftIcon={<Trash2 className="h-4 w-4" />}
            className="bg-destructive hover:bg-destructive-600 text-destructive-foreground"
          >
            Delete {config.entityName}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
