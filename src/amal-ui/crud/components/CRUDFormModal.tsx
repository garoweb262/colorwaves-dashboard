"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Modal, Input, Select, Button, Switch, Textarea, Checkbox } from '@/amal-ui';
import { Save, X, User, Mail, Lock, Calendar, FileText, Image, Settings } from 'lucide-react';
import { CRUDFormModalProps, CRUDEntity } from '../types';
import { FileUpload } from '@/components/FileUpload';

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="h-4 w-4" />;
    case 'password': return <Lock className="h-4 w-4" />;
    case 'text': return <User className="h-4 w-4" />;
    case 'date': return <Calendar className="h-4 w-4" />;
    case 'textarea': return <FileText className="h-4 w-4" />;
    case 'file': return <Image className="h-4 w-4" />;
    default: return <Settings className="h-4 w-4" />;
  }
};

export function CRUDFormModal({ config, item, isOpen, onClose, onSave, isLoading = false }: CRUDFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      const initialData: Record<string, any> = {};
      config.formFields.forEach(field => {
        initialData[field.key] = item[field.key] || '';
      });
      setFormData(initialData);
    } else {
      const initialData: Record<string, any> = {};
      config.formFields.forEach(field => {
        initialData[field.key] = field.type === 'checkbox' ? false : field.type === 'switch' ? true : '';
      });
      setFormData(initialData);
    }
    setErrors({});
  }, [item, isOpen, config.formFields]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    config.formFields.forEach(field => {
      const value = formData[field.key];
      
      // Required validation
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.key] = `${field.label} is required`;
        return;
      }

      // Type-specific validation
      if (value && field.validation) {
        if (field.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[field.key] = 'Invalid email format';
        } else if (field.type === 'number') {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            newErrors[field.key] = 'Must be a valid number';
          } else {
            if (field.validation.min !== undefined && numValue < field.validation.min) {
              newErrors[field.key] = `Minimum value is ${field.validation.min}`;
            }
            if (field.validation.max !== undefined && numValue > field.validation.max) {
              newErrors[field.key] = `Maximum value is ${field.validation.max}`;
            }
          }
        } else if (field.validation.pattern && !field.validation.pattern.test(value)) {
          newErrors[field.key] = field.validation.message || 'Invalid format';
        }
      }

      // Dependency validation
      if (field.dependsOn && field.showWhen) {
        const shouldShow = field.showWhen(formData);
        if (shouldShow && field.required && (!value || (typeof value === 'string' && !value.trim()))) {
          newErrors[field.key] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const savedItem: CRUDEntity = {
        id: item?.id || Date.now().toString(),
        ...formData,
      };

      onSave(savedItem);
    } catch (error) {
      console.error(`Error saving ${config.entityName}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: '' }));
    }
  };

  const renderField = (field: any) => {
    const shouldShow = field.showWhen ? field.showWhen(formData) : true;
    
    if (!shouldShow) return null;

    const commonProps = {
      key: field.key,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      error: errors[field.key],
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
        return (
          <Input
            {...commonProps}
            type={field.type}
            leftIcon={getFieldIcon(field.type)}
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            value={formData[field.key] || ''}
            onChange={(value) => handleInputChange(field.key, value)}
            options={field.options || []}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3 p-4 glass-form-section">
            <Checkbox
              checked={formData[field.key] || false}
              onChange={(checked) => handleInputChange(field.key, checked)}
            />
            <div>
              <label className="text-sm font-medium text-white/80">{field.label}</label>
              {field.placeholder && (
                <p className="text-sm text-white/60">{field.placeholder}</p>
              )}
            </div>
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.placeholder && (
                <p className="text-sm text-gray-500">{field.placeholder}</p>
              )}
            </div>
            <Switch
              checked={formData[field.key] || false}
              onChange={(checked) => handleInputChange(field.key, checked)}
            />
          </div>
        );

      case 'file':
        return (
          <FileUpload
            label={field.label}
            description={field.placeholder || "Click to upload or drag and drop"}
            accept={field.accept || "image/*"}
            maxSize={field.maxSize || 5}
            folder={field.folder || config.entityName.toLowerCase()}
            showPreview={field.showPreview !== false}
            currentFile={formData[field.key] ? (typeof formData[field.key] === 'string' ? formData[field.key] : formData[field.key].name) : null}
            onFileUpload={(fileUrl, fileName) => {
              handleInputChange(field.key, fileUrl);
            }}
            onFileRemove={() => {
              handleInputChange(field.key, '');
            }}
            disabled={isSubmitting || isLoading}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type="text"
            leftIcon={getFieldIcon(field.type)}
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEditing ? `Edit ${config.entityName}` : `Add New ${config.entityName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.formFields.map(field => (
            <div key={field.key} className={field.type === 'textarea' || field.type === 'switch' || field.type === 'checkbox' || field.type === 'file' ? 'md:col-span-2' : ''}>
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || isLoading}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting || isLoading}
            leftIcon={<Save className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            {isEditing ? `Update ${config.entityName}` : `Create ${config.entityName}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
