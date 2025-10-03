"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Table, Checkbox, Button, Badge } from '@/amal-ui';
import { SearchFilter, SearchFilterProps } from './SearchFilter';
import { Sorting, SortingProps } from './Sorting';
import { Pagination, PaginationProps } from './Pagination';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

export interface DataTableColumn {
  key: string;
  title: string;
  render?: (item: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: (item: any) => void;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  className?: string;
  show?: (item: any) => boolean;
}

export interface DataTableProps {
  // Data
  data: any[];
  columns: DataTableColumn[];
  
  // Search and Filter
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  filterOptions?: SearchFilterProps['filterOptions'];
  searchPlaceholder?: string;
  
  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortOptions: SortingProps['sortOptions'];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  
  // Actions
  actions?: DataTableAction[];
  showBulkActions?: boolean;
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
  onSelectAll?: () => void;
  onBulkAction?: (action: string, ids: string[]) => void;
  
  // UI
  emptyMessage?: string;
  isLoading?: boolean;
  showExport?: boolean;
  showImport?: boolean;
  onExport?: () => void;
  onImport?: () => void;
  entityName?: string;
  className?: string;
}

export function DataTable({
  data,
  columns,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions = [],
  searchPlaceholder = "Search...",
  sortBy,
  sortOrder,
  onSortChange,
  sortOptions,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  actions = [],
  showBulkActions = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  onBulkAction,
  emptyMessage = "No data found",
  isLoading = false,
  showExport = false,
  showImport = false,
  onExport,
  onImport,
  entityName = "items",
  className = "",
}: DataTableProps) {
  const allSelected = data.length > 0 && selectedItems.length === data.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < data.length;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll();
    }
  };

  const handleSelectItem = (id: string) => {
    if (onSelectItem) {
      onSelectItem(id);
    }
  };

  const getItemId = (item: any) => {
    if (!item) return 'undefined-item';
    return item.id || item._id || item.key || JSON.stringify(item);
  };

  const handleBulkDelete = () => {
    if (onBulkAction && selectedItems.length > 0) {
      onBulkAction('delete', selectedItems);
    }
  };

  // Add selection column if bulk actions are enabled
  const tableColumns = [
    ...(showBulkActions ? [{
      key: 'select',
      title: '',
      width: '50px',
      render: (item: any) => {
        if (!item) return null;
        const itemId = getItemId(item);
        return (
          <Checkbox
            checked={selectedItems.includes(itemId)}
            onChange={() => handleSelectItem(itemId)}
          />
        );
      }
    }] : []),
    ...columns,
    ...(actions.length > 0 ? [{
      key: 'actions',
      title: 'Actions',
      width: '120px',
      render: (item: any) => {
        if (!item) return null;
        return (
          <div className="flex items-center space-x-2">
            {actions.map(action => {
              if (action.show && !action.show(item)) return null;
              
              return (
                <Button
                  key={action.key}
                  variant={
                    action.variant === 'default' ? 'primary' : 
                    action.variant === 'danger' ? 'destructive' : 
                    (action.variant || 'ghost')
                  }
                  size="sm"
                  onClick={() => action.onClick(item)}
                  className={action.className}
                  title={action.label}
                >
                  {action.icon}
                </Button>
              );
            })}
          </div>
        );
      }
    }] : [])
  ];

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Safety check for data
  if (!data || !Array.isArray(data)) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Filter out any undefined/null items
  const validData = data.filter(item => item != null);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filters={filters}
        onFilterChange={onFilterChange}
        filterOptions={filterOptions}
        searchPlaceholder={searchPlaceholder}
        showExport={showExport}
        showImport={showImport}
        onExport={onExport}
        onImport={onImport}
        resultsCount={validData.length}
        totalCount={totalItems}
        entityName={entityName}
      />

        {/* Bulk Actions */}
        {showBulkActions && selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary-50 rounded-lg border border-primary-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary-700">
                {selectedItems.length} {entityName} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectAll?.()}
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  className="bg-destructive hover:bg-destructive-600 text-destructive-foreground"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </motion.div>
        )}

      {/* Sorting */}
      {sortOptions.length > 0 && (
        <div className="flex items-center justify-between">
          <Sorting
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            sortOptions={sortOptions}
          />
        </div>
      )}

      {/* Table */}
      <Card className="p-0">
        <Table
          data={validData}
          columns={tableColumns}
        />
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
            showPageSizeSelector={!!onPageSizeChange}
            showTotalItems={true}
          />
        </Card>
      )}
    </div>
  );
}
