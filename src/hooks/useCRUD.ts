"use client";

import { useState, useEffect, useCallback } from "react";
import { crudAPI } from "@/lib/api";
import { useAuth } from "./useAuth";

interface UseCRUDOptions<T> {
  endpoint: string;
  initialFilters?: Record<string, any>;
  pageSize?: number;
  autoFetch?: boolean;
  queryParams?: Record<string, any>; // Additional query parameters
}

interface UseCRUDReturn<T> {
  // Data
  items: T[];
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Filters and search
  searchTerm: string;
  filters: Record<string, any>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  queryParams: Record<string, any>;
  
  // Actions
  fetchItems: () => Promise<void>;
  createItem: (data: Partial<T>) => Promise<T | null>;
  updateItem: (id: string, data: Partial<T>) => Promise<T | null>;
  deleteItem: (id: string) => Promise<boolean>;
  updateStatus: (id: string, status: string) => Promise<boolean>;
  bulkDelete: (ids: string[]) => Promise<boolean>;
  
  // Setters
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setQueryParams: (params: Record<string, any>) => void;
  setError: (error: string | null) => void;
  
  // Pagination helpers
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
}

export function useCRUD<T extends { id: string }>({
  endpoint,
  initialFilters = {},
  pageSize: initialPageSize = 10,
  autoFetch = true,
  queryParams: initialQueryParams = {}
}: UseCRUDOptions<T>): UseCRUDReturn<T> {
  const { isAuthenticated } = useAuth();
  
  // State
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [queryParams, setQueryParams] = useState<Record<string, any>>(initialQueryParams);

  // Fetch items
  const fetchItems = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await crudAPI.getItems(endpoint, {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
        filters,
        ...queryParams
      });
      
      if (response.success) {
        setItems(response.data as T[]);
        setTotalItems(response.total);
        setTotalPages(response.totalPages);
        setHasNextPage(response.hasNextPage);
        setHasPrevPage(response.hasPrevPage);
      } else {
        setError('Failed to fetch items');
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setError('Failed to fetch items');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, isAuthenticated, currentPage, pageSize, searchTerm, sortBy, sortOrder, filters, queryParams]);

  // Create item
  const createItem = useCallback(async (data: Partial<T>): Promise<T | null> => {
    try {
      setError(null);
      const response = await crudAPI.createItem(endpoint, data);
      
      if (response.success) {
        // Refetch items to ensure data consistency
        await fetchItems();
        return response.data;
      } else {
        setError('Failed to create item');
        return null;
      }
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
      setError('Failed to create item');
      return null;
    }
  }, [endpoint, fetchItems]);

  // Update item
  const updateItem = useCallback(async (id: string, data: Partial<T>): Promise<T | null> => {
    try {
      setError(null);
      const response = await crudAPI.updateItem(endpoint, id, data);
      
      if (response.success) {
        // Refetch items to ensure data consistency
        await fetchItems();
        return response.data;
      } else {
        setError('Failed to update item');
        return null;
      }
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      setError('Failed to update item');
      return null;
    }
  }, [endpoint, fetchItems]);

  // Delete item
  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await crudAPI.deleteItem(endpoint, id);
      
      if (response.success) {
        // Refetch items to ensure data consistency
        await fetchItems();
        return true;
      } else {
        setError('Failed to delete item');
        return false;
      }
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      setError('Failed to delete item');
      return false;
    }
  }, [endpoint, fetchItems]);

  // Update status
  const updateStatus = useCallback(async (id: string, status: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await crudAPI.updateStatus(endpoint, id, status);
      
      if (response.success) {
        // Refetch items to ensure data consistency
        await fetchItems();
        return true;
      } else {
        setError('Failed to update status');
        return false;
      }
    } catch (error) {
      console.error(`Error updating status for ${endpoint}:`, error);
      setError('Failed to update status');
      return false;
    }
  }, [endpoint, fetchItems]);

  // Bulk delete
  const bulkDelete = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      setError(null);
      const response = await crudAPI.bulkDelete(endpoint, ids);
      
      if (response.success) {
        // Refetch items to ensure data consistency
        await fetchItems();
        return true;
      } else {
        setError('Failed to delete items');
        return false;
      }
    } catch (error) {
      console.error(`Error bulk deleting ${endpoint}:`, error);
      setError('Failed to delete items');
      return false;
    }
  }, [endpoint, fetchItems]);

  // Pagination helpers
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Auto-fetch on dependency changes
  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [fetchItems, autoFetch]);

  return {
    // Data
    items,
    isLoading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage,
    hasPrevPage,
    
    // Filters and search
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    queryParams,
    
    // Actions
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    updateStatus,
    bulkDelete,
    
    // Setters
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    setQueryParams,
    setError,
    
    // Pagination helpers
    goToNextPage,
    goToPrevPage,
    goToPage
  };
}
