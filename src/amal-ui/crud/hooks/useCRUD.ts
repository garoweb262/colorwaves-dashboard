"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CRUDConfig, CRUDState, CRUDActions, CRUDHookReturn, CRUDEntity } from '../types';

export function useCRUD(config: CRUDConfig): CRUDHookReturn {
  const [state, setState] = useState<CRUDState>({
    items: [],
    filteredItems: [],
    selectedItems: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    searchTerm: '',
    filters: {},
    sortBy: config.sortBy || 'id',
    sortOrder: config.sortOrder || 'desc',
    selectedItem: null,
    isViewModalOpen: false,
    isFormModalOpen: false,
    isDeleteModalOpen: false,
    isStatusModalOpen: false,
    editingItem: null,
  });

  // Filter and sort items
  const filterAndSortItems = useCallback((items: CRUDEntity[], searchTerm: string, filters: Record<string, any>, sortBy: string, sortOrder: 'asc' | 'desc') => {
    let filtered = [...items];

    // Apply search
    if (searchTerm && config.searchFields) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        config.searchFields!.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          if (typeof value === 'boolean') {
            return itemValue === value;
          }
          return itemValue === value || itemValue?.toString().toLowerCase().includes(value.toString().toLowerCase());
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [config.searchFields]);

  // Update filtered items when dependencies change
  useEffect(() => {
    const filtered = filterAndSortItems(
      state.items,
      state.searchTerm,
      state.filters,
      state.sortBy,
      state.sortOrder
    );
    
    const pageSize = config.pageSize || 10;
    const totalPages = Math.ceil(filtered.length / pageSize);
    const startIndex = (state.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    setState(prev => ({
      ...prev,
      filteredItems: paginatedItems,
      totalPages,
      totalItems: filtered.length,
    }));
  }, [state.items, state.searchTerm, state.filters, state.sortBy, state.sortOrder, state.currentPage, filterAndSortItems, config.pageSize]);

  // Data operations
  const fetchItems = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/${config.basePath}`);
      const data = await response.json();
      setState(prev => ({ ...prev, items: data, isLoading: false }));
    } catch (error) {
      console.error(`Error fetching ${config.entityNamePlural}:`, error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [config.basePath, config.entityNamePlural]);

  const createItem = useCallback(async (data: Partial<CRUDEntity>): Promise<CRUDEntity> => {
    setState(prev => ({ ...prev, isCreating: true }));
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/${config.basePath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newItem = await response.json();
      setState(prev => ({
        ...prev,
        items: [newItem, ...prev.items],
        isCreating: false,
      }));
      return newItem;
    } catch (error) {
      console.error(`Error creating ${config.entityName}:`, error);
      setState(prev => ({ ...prev, isCreating: false }));
      throw error;
    }
  }, [config.basePath, config.entityName]);

  const updateItem = useCallback(async (id: string, data: Partial<CRUDEntity>): Promise<CRUDEntity> => {
    setState(prev => ({ ...prev, isUpdating: true }));
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/${config.basePath}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updatedItem = await response.json();
      setState(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === id ? updatedItem : item),
        isUpdating: false,
      }));
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${config.entityName}:`, error);
      setState(prev => ({ ...prev, isUpdating: false }));
      throw error;
    }
  }, [config.basePath, config.entityName]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setState(prev => ({ ...prev, isDeleting: true }));
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/${config.basePath}/${id}`, {
        method: 'DELETE',
      });
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
        selectedItems: prev.selectedItems.filter(itemId => itemId !== id),
        isDeleting: false,
      }));
    } catch (error) {
      console.error(`Error deleting ${config.entityName}:`, error);
      setState(prev => ({ ...prev, isDeleting: false }));
      throw error;
    }
  }, [config.basePath, config.entityName]);

  const updateStatus = useCallback(async (id: string, status: string): Promise<void> => {
    if (!config.statusField) return;
    
    setState(prev => ({ ...prev, isUpdating: true }));
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/${config.basePath}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [config.statusField]: status }),
      });
      const updatedItem = await response.json();
      setState(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === id ? updatedItem : item),
        isUpdating: false,
      }));
    } catch (error) {
      console.error(`Error updating ${config.entityName} status:`, error);
      setState(prev => ({ ...prev, isUpdating: false }));
      throw error;
    }
  }, [config.basePath, config.entityName, config.statusField]);

  // UI operations
  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({ ...prev, searchTerm: term, currentPage: 1 }));
  }, []);

  const setFilter = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      currentPage: 1,
    }));
  }, []);

  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortBy, sortOrder, currentPage: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const selectItem = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id)
        ? prev.selectedItems.filter(itemId => itemId !== id)
        : [...prev.selectedItems, id],
    }));
  }, []);

  const selectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedItems: prev.filteredItems.map(item => item.id),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedItems: [] }));
  }, []);

  // Modal operations
  const openViewModal = useCallback((item: CRUDEntity) => {
    setState(prev => ({
      ...prev,
      selectedItem: item,
      isViewModalOpen: true,
    }));
  }, []);

  const openFormModal = useCallback((item?: CRUDEntity) => {
    setState(prev => ({
      ...prev,
      editingItem: item || null,
      isFormModalOpen: true,
    }));
  }, []);

  const openDeleteModal = useCallback((item: CRUDEntity) => {
    setState(prev => ({
      ...prev,
      selectedItem: item,
      isDeleteModalOpen: true,
    }));
  }, []);

  const openStatusModal = useCallback((item: CRUDEntity) => {
    setState(prev => ({
      ...prev,
      selectedItem: item,
      isStatusModalOpen: true,
    }));
  }, []);

  const closeModals = useCallback(() => {
    setState(prev => ({
      ...prev,
      isViewModalOpen: false,
      isFormModalOpen: false,
      isDeleteModalOpen: false,
      isStatusModalOpen: false,
      selectedItem: null,
      editingItem: null,
    }));
  }, []);

  // Bulk operations
  const bulkDelete = useCallback(async (ids: string[]): Promise<void> => {
    setState(prev => ({ ...prev, isDeleting: true }));
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/${config.basePath}/bulk-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => !ids.includes(item.id)),
        selectedItems: [],
        isDeleting: false,
      }));
    } catch (error) {
      console.error(`Error bulk deleting ${config.entityNamePlural}:`, error);
      setState(prev => ({ ...prev, isDeleting: false }));
      throw error;
    }
  }, [config.basePath, config.entityNamePlural]);

  const bulkUpdateStatus = useCallback(async (ids: string[], status: string): Promise<void> => {
    if (!config.statusField) return;
    
    setState(prev => ({ ...prev, isUpdating: true }));
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/${config.basePath}/bulk-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, [config.statusField]: status }),
      });
      setState(prev => ({
        ...prev,
        items: prev.items.map(item =>
          ids.includes(item.id) ? { ...item, [config.statusField!]: status } : item
        ),
        selectedItems: [],
        isUpdating: false,
      }));
    } catch (error) {
      console.error(`Error bulk updating ${config.entityNamePlural} status:`, error);
      setState(prev => ({ ...prev, isUpdating: false }));
      throw error;
    }
  }, [config.basePath, config.entityNamePlural, config.statusField]);

  const actions: CRUDActions = useMemo(() => ({
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
  }), [
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
  ]);

  return { state, actions, config };
}
