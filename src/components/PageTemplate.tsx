"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { Search, Filter, RefreshCw } from "lucide-react";
import { EnhancedPagination } from "./EnhancedPagination";

interface PageTemplateProps {
  // Header
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
  
  // Search and filters
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
  filtersContent?: React.ReactNode;
  
  // Data
  children: React.ReactNode;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  
  // Actions
  onRefresh?: () => void;
  showRefresh?: boolean;
}

export function PageTemplate({
  title,
  description,
  actionButton,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showFilters = false,
  onToggleFilters,
  filtersContent,
  children,
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No data available",
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onNextPage,
  onPrevPage,
  onRefresh,
  showRefresh = true
}: PageTemplateProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {showRefresh && onRefresh && (
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          )}
          {actionButton}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
              />
            </div>
            {onToggleFilters && (
              <Button
                variant="outline"
                onClick={onToggleFilters}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && filtersContent && (
          <div className="p-4 bg-gray-50 rounded-md">
            {filtersContent}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 text-lg">{emptyMessage}</p>
            </div>
          </div>
        ) : (
          <>
            {children}
            
            {/* Enhanced Pagination */}
            <EnhancedPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={onPageChange}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
              showInfo={true}
              showPageNumbers={true}
              maxVisiblePages={5}
            />
          </>
        )}
      </div>
    </div>
  );
}
