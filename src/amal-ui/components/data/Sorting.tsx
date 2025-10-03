"use client";

import React from 'react';
import { Button, Select } from '@/amal-ui';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface SortOption {
  key: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export interface SortingProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortOptions: SortOption[];
  className?: string;
}

export function Sorting({
  sortBy,
  sortOrder,
  onSortChange,
  sortOptions,
  className = "",
}: SortingProps) {
  const currentSort = sortOptions.find(option => option.key === sortBy);

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Toggle direction if same field
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      onSortChange(newSortBy, 'asc');
    }
  };

  const getSortIcon = (optionKey: string) => {
    if (optionKey !== sortBy) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-primary" /> : 
      <ArrowDown className="h-4 w-4 text-primary" />;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600">Sort by:</span>
      
      <Select
        value={sortBy}
        onChange={handleSortChange}
        options={sortOptions.map(option => ({
          value: option.key,
          label: option.label,
        }))}
        className="min-w-[150px]"
      />

      <div className="flex items-center space-x-1">
        {sortOptions.map(option => (
          <Button
            key={option.key}
            variant="ghost"
            size="sm"
            onClick={() => handleSortChange(option.key)}
            className={`p-1 h-8 w-8 ${
              option.key === sortBy 
                ? 'text-primary bg-primary-50' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={`Sort by ${option.label} ${option.key === sortBy ? (sortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
          >
            {getSortIcon(option.key)}
          </Button>
        ))}
      </div>

      {currentSort && (
        <span className="text-xs text-gray-500">
          {currentSort.label} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </span>
      )}
    </div>
  );
}
