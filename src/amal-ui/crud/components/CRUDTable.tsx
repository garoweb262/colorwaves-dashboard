"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Input, Select, Badge, Table, Checkbox, DataTable, DataTableColumn, DataTableAction } from '@/amal-ui';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, Filter, Download, Upload } from 'lucide-react';
import { CRUDTableProps } from '../types';
import { SkeletonTable, EmptyTableState } from '@/components/ui';

export function CRUDTable({ config, state, actions, className = '' }: CRUDTableProps) {
  const {
    items,
    filteredItems,
    selectedItems,
    isLoading,
    searchTerm,
    filters,
    totalItems,
    currentPage,
    totalPages,
    sortBy,
    sortOrder,
  } = state;

  const {
    setSearchTerm,
    setFilter,
    setPage,
    setSorting,
    selectItem,
    selectAll,
    clearSelection,
    openViewModal,
    openFormModal,
    openDeleteModal,
    openStatusModal,
    bulkDelete,
  } = actions;

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedItems.length} ${config.entityNamePlural}?`)) {
      await bulkDelete(selectedItems);
    }
  };

  // Convert CRUD columns to DataTable columns
  const columns: DataTableColumn[] = config.columns.map(col => ({
    key: col.key,
    title: col.title,
    render: col.render,
    sortable: col.sortable,
    width: col.width,
    align: col.align,
  }));

  // Create actions for DataTable
  const tableActions: DataTableAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: openViewModal,
      variant: 'ghost',
      className: 'text-palette-gold-600 hover:text-palette-gold-700',
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: openFormModal,
      variant: 'ghost',
      className: 'text-palette-gold-600 hover:text-palette-gold-700',
    },
    ...(config.showStatusUpdate ? [{
      key: 'status',
      label: 'Update Status',
      icon: <MoreVertical className="h-4 w-4" />,
      onClick: openStatusModal,
      variant: 'ghost' as const,
      className: 'text-palette-gold-600 hover:text-palette-gold-700',
    }] : []),
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: openDeleteModal,
      variant: 'ghost' as const,
      className: 'text-destructive hover:text-destructive-600',
    },
  ];

  // Create sort options from columns
  const sortOptions = config.columns
    .filter(col => col.sortable !== false)
    .map(col => ({
      key: col.key,
      label: col.title,
    }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {config.entityNamePlural}
          </h1>
          <p className="text-gray-600">
            Manage {config.entityNamePlural.toLowerCase()} and their settings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
          <Button
            variant="outline"
            leftIcon={<Upload className="h-4 w-4" />}
          >
            Import
          </Button>
          <Button
            onClick={() => openFormModal()}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add {config.entityName}
          </Button>
        </div>
      </div>

      {/* DataTable with integrated search, filter, sort, pagination */}
      {isLoading ? (
        <SkeletonTable rows={8} columns={columns.length} />
      ) : filteredItems.length === 0 ? (
        <EmptyTableState
          entityName={config.entityNamePlural.toLowerCase()}
          onAdd={() => openFormModal()}
          onRefresh={() => window.location.reload()}
        />
      ) : (
        <DataTable
          data={filteredItems}
          columns={columns}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={setFilter}
          filterOptions={config.filters}
          searchPlaceholder={`Search ${config.entityNamePlural.toLowerCase()}...`}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSorting}
          sortOptions={sortOptions}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={config.pageSize || 10}
          onPageChange={setPage}
          actions={config.showActions !== false ? tableActions : []}
          showBulkActions={config.showBulkActions}
          selectedItems={selectedItems}
          onSelectItem={selectItem}
          onSelectAll={selectAll}
          onBulkAction={(action, ids) => {
            if (action === 'delete') {
              handleBulkDelete();
            }
          }}
          emptyMessage={`No ${config.entityNamePlural.toLowerCase()} found`}
          isLoading={isLoading}
          showExport={true}
          showImport={true}
          entityName={config.entityNamePlural.toLowerCase()}
        />
      )}
    </div>
  );
}
