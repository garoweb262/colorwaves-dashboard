"use client";

import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useCRUD, CRUDTable, CRUDFormModal, CRUDViewModal, CRUDDeleteModal, StatusUpdateModal } from '../index';
import { CRUDConfig } from '../types';
import { createColumn, createTextFilter, createSelectFilter, createFormField, createStatusOptions } from '../utils';

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

// CRUD Configuration for Products
const productsConfig: CRUDConfig = {
  entityName: 'Product',
  entityNamePlural: 'Products',
  basePath: 'products',
  searchFields: ['name', 'description', 'sku', 'category'],
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
    { value: 'draft', label: 'Draft', color: 'yellow' },
  ]),
  columns: [
    createColumn('name', 'Product Name', {
      render: (product: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {product.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>
      )
    }),
    createColumn('category', 'Category'),
    createColumn('price', 'Price', {
      render: (product: any) => (
        <span className="font-medium text-gray-900">
          ${product.price.toFixed(2)}
        </span>
      )
    }),
    createColumn('stock', 'Stock', {
      render: (product: any) => (
        <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock}
        </span>
      )
    }),
    createColumn('status', 'Status', {
      render: (product: any) => {
        const statusConfig = productsConfig.statusOptions?.find(opt => opt.value === product.status);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusConfig?.color === 'green' ? 'bg-green-100 text-green-800' :
            statusConfig?.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {statusConfig?.label || product.status}
          </span>
        );
      }
    }),
    createColumn('createdAt', 'Created', {
      render: (product: any) => (
        <span className="text-sm text-gray-600">
          {new Date(product.createdAt).toLocaleDateString()}
        </span>
      )
    }),
  ],
  filters: [
    createTextFilter('name', 'Product Name', 'Search by name...'),
    createSelectFilter('category', 'Category', [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'home', label: 'Home & Garden' },
      { value: 'sports', label: 'Sports' },
    ]),
    createSelectFilter('status', 'Status', [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' },
    ]),
  ],
  formFields: [
    createFormField('name', 'Product Name', 'text', {
      required: true,
      placeholder: 'Enter product name',
    }),
    createFormField('description', 'Description', 'textarea', {
      required: true,
      placeholder: 'Enter product description',
    }),
    createFormField('price', 'Price', 'number', {
      required: true,
      placeholder: 'Enter price',
      validation: {
        min: 0,
        message: 'Price must be greater than 0',
      },
    }),
    createFormField('category', 'Category', 'select', {
      required: true,
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'sports', label: 'Sports' },
      ],
    }),
    createFormField('stock', 'Stock Quantity', 'number', {
      required: true,
      placeholder: 'Enter stock quantity',
      validation: {
        min: 0,
        message: 'Stock must be 0 or greater',
      },
    }),
    createFormField('sku', 'SKU', 'text', {
      required: true,
      placeholder: 'Enter product SKU',
    }),
    createFormField('status', 'Status', 'select', {
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'draft', label: 'Draft' },
      ],
    }),
  ],
};

export default function ProductsPage() {
  const { state, actions, config } = useCRUD(productsConfig);

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
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await actions.deleteItem(id);
      actions.closeModals();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await actions.updateStatus(id, status);
      actions.closeModals();
    } catch (error) {
      console.error('Error updating product status:', error);
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
