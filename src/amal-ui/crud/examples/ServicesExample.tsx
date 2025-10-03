"use client";

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useCRUD, CRUDTable, CRUDFormModal, CRUDViewModal, CRUDDeleteModal, StatusUpdateModal } from '../index';
import { CRUDConfig } from '../types';
import { createColumn, createTextFilter, createSelectFilter, createFormField, createStatusOptions } from '../utils';

// Service interface
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  isPopular: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// CRUD Configuration for Services
const servicesConfig: CRUDConfig = {
  entityName: 'Service',
  entityNamePlural: 'Services',
  basePath: 'services',
  searchFields: ['name', 'description', 'category'],
  sortBy: 'createdAt',
  sortOrder: 'desc',
  pageSize: 10,
  showActions: true,
  showStatusUpdate: true,
  showBulkActions: true,
  statusField: 'status',
  statusOptions: createStatusOptions([
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'maintenance', label: 'Maintenance', color: 'yellow' },
  ]),
  columns: [
    createColumn('name', 'Service Name', {
      render: (service: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-palette-gold-500 to-palette-gold-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {service.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{service.name}</div>
            <div className="text-sm text-gray-500">{service.category}</div>
          </div>
        </div>
      )
    }),
    createColumn('price', 'Price', {
      render: (service: any) => (
        <span className="font-medium text-gray-900">
          ${service.price.toFixed(2)}
        </span>
      )
    }),
    createColumn('duration', 'Duration', {
      render: (service: any) => (
        <span className="text-sm text-gray-600">
          {service.duration} min
        </span>
      )
    }),
    createColumn('isPopular', 'Popular', {
      render: (service: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          service.isPopular ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {service.isPopular ? 'Popular' : 'Regular'}
        </span>
      )
    }),
    createColumn('status', 'Status', {
      render: (service: any) => {
        const statusConfig = servicesConfig.statusOptions?.find(opt => opt.value === service.status);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusConfig?.color === 'green' ? 'bg-green-100 text-green-800' :
            statusConfig?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {statusConfig?.label || service.status}
          </span>
        );
      }
    }),
    createColumn('createdAt', 'Created', {
      render: (service: any) => (
        <span className="text-sm text-gray-600">
          {new Date(service.createdAt).toLocaleDateString()}
        </span>
      )
    }),
  ],
  filters: [
    createTextFilter('name', 'Service Name', 'Search by name...'),
    createSelectFilter('category', 'Category', [
      { value: 'web-development', label: 'Web Development' },
      { value: 'mobile-development', label: 'Mobile Development' },
      { value: 'design', label: 'Design' },
      { value: 'consulting', label: 'Consulting' },
      { value: 'maintenance', label: 'Maintenance' },
    ]),
    createSelectFilter('status', 'Status', [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'maintenance', label: 'Maintenance' },
    ]),
  ],
  formFields: [
    createFormField('name', 'Service Name', 'text', {
      required: true,
      placeholder: 'Enter service name',
    }),
    createFormField('description', 'Description', 'textarea', {
      required: true,
      placeholder: 'Enter service description',
    }),
    createFormField('price', 'Price', 'number', {
      required: true,
      placeholder: 'Enter price',
      validation: {
        min: 0,
        message: 'Price must be greater than 0',
      },
    }),
    createFormField('duration', 'Duration (minutes)', 'number', {
      required: true,
      placeholder: 'Enter duration in minutes',
      validation: {
        min: 1,
        message: 'Duration must be at least 1 minute',
      },
    }),
    createFormField('category', 'Category', 'select', {
      required: true,
      options: [
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'design', label: 'Design' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'maintenance', label: 'Maintenance' },
      ],
    }),
    createFormField('isPopular', 'Popular Service', 'switch', {
      placeholder: 'Mark as popular service',
    }),
    createFormField('status', 'Status', 'select', {
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'maintenance', label: 'Maintenance' },
      ],
    }),
  ],
};

export default function ServicesPage() {
  const { state, actions, config } = useCRUD(servicesConfig);

  // Load data on component mount
  useEffect(() => {
    actions.fetchItems();
  }, [actions]);

  const handleSave = async (item: any) => {
    try {
      if (item.id && state.items.some(i => i.id === item.id)) {
        await actions.updateItem(item.id, item);
      } else {
        await actions.createItem(item);
      }
      actions.closeModals();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await actions.deleteItem(id);
      actions.closeModals();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await actions.updateStatus(id, status);
      actions.closeModals();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  return (
    <DashboardLayout>
      <CRUDTable
        config={config}
        state={state}
        actions={actions}
      />

      {/* Modals */}
      {state.selectedItem && (
        <CRUDViewModal
          config={config}
          item={state.selectedItem}
          isOpen={state.isViewModalOpen}
          onClose={actions.closeModals}
          onEdit={() => {
            actions.closeModals();
            actions.openFormModal(state.selectedItem!);
          }}
          onDelete={() => {
            actions.closeModals();
            actions.openDeleteModal(state.selectedItem!);
          }}
        />
      )}

      <CRUDFormModal
        config={config}
        item={state.editingItem}
        isOpen={state.isFormModalOpen}
        onClose={actions.closeModals}
        onSave={handleSave}
        isLoading={state.isCreating || state.isUpdating}
      />

      {state.selectedItem && (
        <CRUDDeleteModal
          config={config}
          item={state.selectedItem}
          isOpen={state.isDeleteModalOpen}
          onClose={actions.closeModals}
          onConfirm={handleDelete}
          isLoading={state.isDeleting}
        />
      )}

      {state.selectedItem && (
        <StatusUpdateModal
          config={config}
          item={state.selectedItem}
          isOpen={state.isStatusModalOpen}
          onClose={actions.closeModals}
          onUpdate={handleStatusUpdate}
          isLoading={state.isUpdating}
        />
      )}
    </DashboardLayout>
  );
}
