"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Modal, Badge, Button } from '@/amal-ui';
import { X, Edit, Trash2, Calendar, User, Mail, Shield, Clock, Eye } from 'lucide-react';
import { CRUDViewModalProps } from '../types';

export function CRUDViewModal({ config, item, isOpen, onClose, onEdit, onDelete }: CRUDViewModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatValue = (value: any, key: string) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Check if it's a date field
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key.toLowerCase().includes('created') || key.toLowerCase().includes('updated')) {
      try {
        return formatDate(value);
      } catch {
        return value.toString();
      }
    }
    
    // Check if it's a boolean field
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Check if it's a status field
    if (key.toLowerCase().includes('status') && config.statusOptions) {
      const statusOption = config.statusOptions.find(option => option.value === value);
      if (statusOption) {
        return <Badge color={statusOption.color}>{statusOption.label}</Badge>;
      }
    }
    
    return value.toString();
  };

  const getFieldIcon = (key: string) => {
    if (key.toLowerCase().includes('email')) return <Mail className="h-5 w-5 text-gray-500" />;
    if (key.toLowerCase().includes('name') || key.toLowerCase().includes('title')) return <User className="h-5 w-5 text-gray-500" />;
    if (key.toLowerCase().includes('role') || key.toLowerCase().includes('permission')) return <Shield className="h-5 w-5 text-gray-500" />;
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) return <Calendar className="h-5 w-5 text-gray-500" />;
    if (key.toLowerCase().includes('status')) return <Clock className="h-5 w-5 text-gray-500" />;
    return <Eye className="h-5 w-5 text-gray-500" />;
  };

  const getDisplayFields = () => {
    // Get fields that should be displayed in the view modal
    const displayFields = config.formFields.filter(field => 
      field.key !== 'password' && 
      field.key !== 'confirmPassword' &&
      !field.key.toLowerCase().includes('secret') &&
      !field.key.toLowerCase().includes('token')
    );

    return displayFields;
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

  const getSecondaryField = () => {
    // Try to find a secondary field
    const secondaryFields = ['email', 'description', 'type', 'category'];
    for (const field of secondaryFields) {
      if (item[field] && field !== getPrimaryField()) {
        return item[field];
      }
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={`${config.entityName} Details`}
    >
      <div className="space-y-6">
        {/* Header with primary info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {getPrimaryField().toString().substring(0, 2).toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {getPrimaryField()}
          </h3>
          {getSecondaryField() && (
            <p className="text-gray-600">{getSecondaryField()}</p>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {getDisplayFields().map(field => (
            <div key={field.key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getFieldIcon(field.key)}
              <div className="flex-1">
                <p className="text-sm text-gray-600 capitalize">
                  {field.label}
                </p>
                <div className="font-medium text-gray-900">
                  {formatValue(item[field.key], field.key)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            leftIcon={<X className="h-4 w-4" />}
          >
            Close
          </Button>
          {onEdit && (
            <Button
              onClick={onEdit}
              leftIcon={<Edit className="h-4 w-4" />}
              className="bg-palette-gold-500 hover:bg-palette-gold-600 text-white"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="bg-destructive hover:bg-destructive-600 text-destructive-foreground"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
