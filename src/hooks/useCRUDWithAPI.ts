"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crudAPI } from '@/lib/api';
import { queryKeys } from '@/lib/react-query';

interface UseCRUDWithAPIOptions {
  endpoint: string;
  entityName: string;
  entityNamePlural: string;
  initialFilters?: Record<string, any>;
  pageSize?: number;
}

interface CRUDState {
  items: any[];
  filteredItems: any[];
  selectedItems: string[];
  isLoading: boolean;
  searchTerm: string;
  filters: Record<string, any>;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  selectedItem: any | null;
  isViewModalOpen: boolean;
  isFormModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isStatusModalOpen: boolean;
  editingItem: any | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface CRUDActions {
  fetchItems: () => Promise<void>;
  createItem: (data: any) => Promise<any>;
  updateItem: (id: string, data: any) => Promise<any>;
  deleteItem: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setFilter: (key: string, value: any) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  selectItem: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  openViewModal: (item: any) => void;
  openFormModal: (item?: any) => void;
  openDeleteModal: (item: any) => void;
  openStatusModal: (item: any) => void;
  closeModals: () => void;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: string) => Promise<void>;
}

export function useCRUDWithAPI({
  endpoint,
  entityName,
  entityNamePlural,
  initialFilters = {},
  pageSize = 10,
}: UseCRUDWithAPIOptions): { state: CRUDState; actions: CRUDActions } {
  const queryClient = useQueryClient();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Query key for this entity
  const queryKey = queryKeys.all(entityName);

  // Fetch items query
  const {
    data: itemsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [...queryKey, 'list', { 
      search: searchTerm, 
      filters, 
      page: currentPage, 
      sortBy, 
      sortOrder 
    }],
    queryFn: async () => {
      const response = await crudAPI.getItems(endpoint, {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
        filters,
      });
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => crudAPI.createItem(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      closeModals();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      crudAPI.updateItem(endpoint, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      closeModals();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => crudAPI.deleteItem(endpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      closeModals();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      crudAPI.updateStatus(endpoint, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      closeModals();
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => crudAPI.bulkDelete(endpoint, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setSelectedItems([]);
    },
  });

  // Computed values
  const items = itemsData?.data || [];
  const totalItems = itemsData?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Filter items based on search term
  const filteredItems = items.filter((item: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some((value: any) => 
      String(value).toLowerCase().includes(searchLower)
    );
  });

  // Actions
  const fetchItems = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const createItem = useCallback(async (data: any) => {
    return await createMutation.mutateAsync(data);
  }, [createMutation]);

  const updateItem = useCallback(async (id: string, data: any) => {
    return await updateMutation.mutateAsync({ id, data });
  }, [updateMutation]);

  const deleteItem = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id);
  }, [deleteMutation]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    await statusMutation.mutateAsync({ id, status });
  }, [statusMutation]);

  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const setSorting = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const selectItem = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedItems(filteredItems.map((item: any) => item.id));
  }, [filteredItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const openViewModal = useCallback((item: any) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  }, []);

  const openFormModal = useCallback((item?: any) => {
    setEditingItem(item || null);
    setIsFormModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((item: any) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  }, []);

  const openStatusModal = useCallback((item: any) => {
    setSelectedItem(item);
    setIsStatusModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsViewModalOpen(false);
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsStatusModalOpen(false);
    setSelectedItem(null);
    setEditingItem(null);
  }, []);

  const bulkDelete = useCallback(async (ids: string[]) => {
    await bulkDeleteMutation.mutateAsync(ids);
  }, [bulkDeleteMutation]);

  const bulkUpdateStatus = useCallback(async (ids: string[], status: string) => {
    // This would need to be implemented in the API
    for (const id of ids) {
      await updateStatus(id, status);
    }
  }, [updateStatus]);

  // State object
  const state: CRUDState = {
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
    selectedItem,
    isViewModalOpen,
    isFormModalOpen,
    isDeleteModalOpen,
    isStatusModalOpen,
    editingItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };

  // Actions object
  const actions: CRUDActions = {
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    updateStatus,
    setSearchTerm,
    setFilter,
    setSorting,
    setPage,
    selectItem,
    selectAll,
    clearSelection,
    openViewModal,
    openFormModal,
    openDeleteModal,
    openStatusModal,
    closeModals,
    bulkDelete,
    bulkUpdateStatus,
  };

  return { state, actions };
}
