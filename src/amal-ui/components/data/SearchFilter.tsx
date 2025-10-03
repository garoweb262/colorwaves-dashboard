"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Input, Select, Button } from '@/amal-ui';
import { Search, Filter, X, Download, Upload } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  filterOptions?: FilterOption[];
  searchPlaceholder?: string;
  showExport?: boolean;
  showImport?: boolean;
  onExport?: () => void;
  onImport?: () => void;
  resultsCount?: number;
  totalCount?: number;
  entityName?: string;
  className?: string;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions = [],
  searchPlaceholder = "Search...",
  showExport = false,
  showImport = false,
  onExport,
  onImport,
  resultsCount,
  totalCount,
  entityName = "items",
  className = "",
}: SearchFilterProps) {
  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== 'all' && value !== ''
  );

  const clearAllFilters = () => {
    filterOptions.forEach(filter => {
      onFilterChange(filter.key, '');
    });
  };

  const renderFilter = (filter: FilterOption) => {
    const value = filters[filter.key] || '';

    switch (filter.type) {
      case 'select':
        return (
          <Select
            key={filter.key}
            value={value || 'all'}
            onChange={(newValue) => onFilterChange(filter.key, newValue === 'all' ? '' : newValue)}
            options={[
              { value: 'all', label: `All ${filter.label}` },
              ...(filter.options || [])
            ]}
            placeholder={filter.placeholder}
          />
        );

      case 'boolean':
        return (
          <Select
            key={filter.key}
            value={value || 'all'}
            onChange={(newValue) => {
              if (newValue === 'all') {
                onFilterChange(filter.key, '');
              } else {
                onFilterChange(filter.key, newValue === 'true');
              }
            }}
            options={[
              { value: 'all', label: `All ${filter.label}` },
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' }
            ]}
          />
        );

      case 'date':
        return (
          <Input
            key={filter.key}
            type="date"
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          />
        );

      default: // text
        return (
          <Input
            key={filter.key}
            type="text"
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
          />
        );
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Search and Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <Input
                placeholder={searchPlaceholder}
                leftIcon={<Search className="h-4 w-4" />}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {showExport && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="h-4 w-4" />}
                  onClick={onExport}
                >
                  Export
                </Button>
              )}
              {showImport && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Upload className="h-4 w-4" />}
                  onClick={onImport}
                >
                  Import
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {(resultsCount !== undefined || totalCount !== undefined) && (
            <div className="text-sm text-gray-600">
              {resultsCount !== undefined && totalCount !== undefined ? (
                `${resultsCount} of ${totalCount} ${entityName}`
              ) : (
                `${resultsCount || totalCount || 0} ${entityName}`
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        {filterOptions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  leftIcon={<X className="h-4 w-4" />}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filterOptions.map(renderFilter)}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 pt-2 border-t"
              >
                <span className="text-sm text-gray-600">Active filters:</span>
                {filterOptions.map(filter => {
                  const value = filters[filter.key];
                  if (!value || value === 'all' || value === '') return null;

                  let displayValue = value;
                  if (filter.type === 'select' && filter.options) {
                    const option = filter.options.find(opt => opt.value === value);
                    displayValue = option?.label || value;
                  } else if (filter.type === 'boolean') {
                    displayValue = value ? 'Yes' : 'No';
                  }

                  return (
                    <span
                      key={filter.key}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {filter.label}: {displayValue}
                      <button
                        onClick={() => onFilterChange(filter.key, '')}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
