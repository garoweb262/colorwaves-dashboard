"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Button, Select, Badge } from '@/amal-ui';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { StatusUpdateModalProps } from '../types';

export function StatusUpdateModal({ config, item, isOpen, onClose, onUpdate, isLoading = false }: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(item[config.statusField || 'status'] || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!selectedStatus) return;

    setIsUpdating(true);

    try {
      await onUpdate(item.id, selectedStatus);
    } catch (error) {
      console.error(`Error updating ${config.entityName} status:`, error);
    } finally {
      setIsUpdating(false);
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

  const getCurrentStatus = () => {
    const currentStatus = item[config.statusField || 'status'];
    if (!currentStatus || !config.statusOptions) return null;
    
    const statusOption = config.statusOptions.find(option => option.value === currentStatus);
    return statusOption;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'published':
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'inactive':
      case 'draft':
      case 'pending':
      case 'in_progress':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
      case 'cancelled':
      case 'failed':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={`Update ${config.entityName} Status`}
    >
      <div className="space-y-6">
        {/* Item Info */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">
              {getPrimaryField().toString().substring(0, 2).toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {getPrimaryField()}
          </h3>
        </div>

        {/* Current Status */}
        {getCurrentStatus() && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Status:</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(getCurrentStatus()!.value)}
                <Badge color={getCurrentStatus()!.color}>
                  {getCurrentStatus()!.label}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Status Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            New Status
          </label>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={config.statusOptions || []}
            placeholder="Select new status"
          />
        </div>

        {/* Status Preview */}
        {selectedStatus && config.statusOptions && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">New Status:</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedStatus)}
                <Badge color={config.statusOptions.find(opt => opt.value === selectedStatus)?.color || 'gray'}>
                  {config.statusOptions.find(opt => opt.value === selectedStatus)?.label}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating || isLoading}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            loading={isUpdating || isLoading}
            disabled={!selectedStatus}
            leftIcon={<CheckCircle className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
