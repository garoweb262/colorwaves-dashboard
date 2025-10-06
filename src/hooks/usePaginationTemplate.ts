"use client";

import { useCRUD } from "./useCRUD";

interface UsePaginationTemplateOptions<T> {
  endpoint: string;
  pageSize?: number;
  initialFilters?: Record<string, any>;
  queryParams?: Record<string, any>;
}

/**
 * Template hook for implementing pagination and query parameters on any page
 * This provides a consistent pattern for all dashboard pages
 */
export function usePaginationTemplate<T extends { id: string }>({
  endpoint,
  pageSize = 10,
  initialFilters = {},
  queryParams = {}
}: UsePaginationTemplateOptions<T>) {
  const crud = useCRUD<T>({
    endpoint,
    pageSize,
    initialFilters,
    queryParams
  });

  // Helper functions for common pagination operations
  const handleSearch = (searchTerm: string) => {
    crud.setSearchTerm(searchTerm);
    crud.setCurrentPage(1); // Reset to first page
  };

  const handleFilter = (key: string, value: any) => {
    crud.setFilters((prev: Record<string, any>) => ({ ...prev, [key]: value }));
    crud.setCurrentPage(1); // Reset to first page
  };

  const handleSort = (field: string) => {
    if (crud.sortBy === field) {
      crud.setSortOrder(crud.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      crud.setSortBy(field);
      crud.setSortOrder('asc');
    }
    crud.setCurrentPage(1); // Reset to first page
  };

  const handlePageSizeChange = (newPageSize: number) => {
    crud.setPageSize(newPageSize);
    crud.setCurrentPage(1); // Reset to first page
  };

  const handleQueryParamChange = (key: string, value: any) => {
    crud.setQueryParams((prev: Record<string, any>) => ({ ...prev, [key]: value }));
    crud.setCurrentPage(1); // Reset to first page
  };

  return {
    ...crud,
    // Enhanced handlers
    handleSearch,
    handleFilter,
    handleSort,
    handlePageSizeChange,
    handleQueryParamChange,
    
    // Pagination helpers
    canGoNext: crud.hasNextPage,
    canGoPrev: crud.hasPrevPage,
    isFirstPage: crud.currentPage === 1,
    isLastPage: crud.currentPage === crud.totalPages,
    
    // Data helpers
    startItem: (crud.currentPage - 1) * crud.pageSize + 1,
    endItem: Math.min(crud.currentPage * crud.pageSize, crud.totalItems),
    hasData: crud.items.length > 0,
    isEmpty: crud.items.length === 0 && !crud.isLoading
  };
}
