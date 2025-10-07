"use client";

import React, { useState, useEffect } from "react";
import { Button, Checkbox, Badge, useToast } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EnhancedPagination } from "@/components/EnhancedPagination";
import { Plus, Edit, Trash2, Eye, UserPlus, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserViewModal } from "@/components/users/UserViewModal";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserStatusModal } from "@/components/users/UserStatusModal";
import { DeleteConfirmModal } from "@/components/users/DeleteConfirmModal";
import { useCRUD } from "@/hooks/useCRUD";
import { useAuth } from "@/hooks/useAuth";
import { ServiceStatistics } from "@/components/ServiceStatistics";

interface User {
  _id?: string; // Backend uses _id
  id: string; // Required for useCRUD
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  password?: string; // For form data
}

export default function UsersPage() {
  const { addToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    items: users,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage,
    hasPrevPage,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    queryParams,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    updateStatus,
    bulkDelete,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setFilters,
    setSortBy,
    setSortOrder,
    setQueryParams,
    setError,
    goToNextPage,
    goToPrevPage,
    goToPage
  } = useCRUD<User>({
    endpoint: '/users',
    pageSize: 10,
    initialFilters: { role: 'all', status: 'all' }
  });
  
  const { isAuthenticated } = useAuth();

  // Use server-side filtering, so no client-side filtering needed
  const filteredUsers = users;


  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleUserSaved = async (savedUser: User) => {
    if (!savedUser) return;
    
    try {
      if (editingUser) {
        // Update existing user
        const result = await updateItem(editingUser.id, savedUser);
        if (result) {
          setIsFormModalOpen(false);
          setEditingUser(null);
          addToast({
            variant: "success",
            title: "User Updated",
            description: `User ${savedUser.firstName} ${savedUser.lastName} has been updated successfully.`,
            duration: 4000
          });
        }
      } else {
        // Create new user - the form sends the correct payload format
        const result = await createItem(savedUser);
        if (result) {
          setIsFormModalOpen(false);
          setEditingUser(null);
          addToast({
            variant: "success",
            title: "User Created",
            description: `User ${savedUser.firstName} ${savedUser.lastName} has been created successfully.`,
            duration: 4000
          });
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      addToast({
        variant: "error",
        title: editingUser ? "Update Failed" : "Creation Failed",
        description: editingUser 
          ? "Failed to update user. Please try again."
          : "Failed to create user. Please try again.",
        duration: 5000
      });
    }
  };

  const handleUserDeleted = async (userId: string) => {
    if (!userId) return;
    
    try {
      const success = await deleteItem(userId);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        addToast({
          variant: "success",
          title: "User Deleted",
          description: "User has been deleted successfully.",
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      addToast({
        variant: "error",
        title: "Delete Failed",
        description: "Failed to delete user. Please try again.",
        duration: 5000
      });
    }
  };

  const handleUpdateStatus = (user: User) => {
    if (!user) return;
    
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      const success = await updateStatus(userId, status);
      if (success) {
        addToast({
          variant: "success",
          title: "Status Updated",
          description: `User status has been updated to ${status}.`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Status Update Failed",
        description: "Failed to update user status. Please try again.",
        duration: 5000
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "red";
      case "ADMIN": return "blue";
      case "SUPPORT": return "green";
      case "CONTENT_MANAGER": return "purple";
      default: return "gray";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "Super Admin";
      case "ADMIN": return "Admin";
      case "SUPPORT": return "Support";
      case "CONTENT_MANAGER": return "Content Manager";
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Helper functions for rendering table cells
  const renderUserCell = (user: User) => {
    if (!user) return null;
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    const fullName = `${firstName} ${lastName}`.trim();
    
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {initials || '??'}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {fullName || 'Unknown User'}
          </div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>
    );
  };

  const renderRoleCell = (user: User) => {
    if (!user) return null;
    
    const role = user.role || 'UNKNOWN';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' :
        role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
        role === 'SUPPORT' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {getRoleDisplayName(role)}
      </span>
    );
  };

  const renderStatusCell = (user: User) => {
    if (!user) return null;
    
    const isActive = user.status ?? 'active' ? 'inactive' : 'suspended';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const renderActionsCell = (user: User) => {
    if (!user) return null;
    
    return (
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewUser(user)}
          className="text-palette-gold-600 hover:text-palette-gold-700"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditUser(user)}
          className="text-palette-gold-600 hover:text-palette-gold-700"
          title="Edit User"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleUpdateStatus(user)}
          className="text-palette-blue-600 hover:text-palette-blue-700"
          title={user.status === 'active' ? "Deactivate" : "Activate"}
        >
          {user.status === 'active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteUser(user)}
          className="text-destructive hover:text-destructive-600"
          title="Delete User"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Sorting functionality
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  // Use server-side pagination, so no client-side slicing needed
  const paginatedData = filteredUsers;

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.filter(user => user && user.id).map(user => user.id!) as string[]);
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} users?`)) {
        try {
          const success = await bulkDelete(ids);
          if (success) {
            setSelectedItems([]);
            addToast({
              variant: "success",
              title: "Bulk Delete Successful",
              description: `${ids.length} users have been deleted successfully.`,
              duration: 4000
            });
          }
        } catch (error) {
          console.error("Error bulk deleting users:", error);
          addToast({
            variant: "error",
            title: "Bulk Delete Failed",
            description: "Failed to delete selected users. Please try again.",
            duration: 5000
          });
        }
      }
    }
  };

  const handleExport = () => {
    console.log('Exporting users...');
    alert('Export functionality would be implemented here');
  };

  const handleImport = () => {
    console.log('Importing users...');
    alert('Import functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Service Statistics */}
        <ServiceStatistics serviceName="users" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage system users and their permissions</p>
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
          </div>
          <Button
            onClick={handleAddUser}
            leftIcon={<UserPlus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add User
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when search changes
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={filters.role || 'all'}
                  onChange={(e) => {
                    const value = e.target.value === 'all' ? null : e.target.value;
                    setFilters((prev: Record<string, any>) => ({ ...prev, role: value }));
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPPORT">Support</option>
                  <option value="CONTENT_MANAGER">Content Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => {
                    const value = e.target.value === 'all' ? null : e.target.value;
                    setFilters((prev: Record<string, any>) => ({ ...prev, status: value }));
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when page size changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Custom Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    {getSortIcon('firstName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Role</span>
                    {getSortIcon('role')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('isActive')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Status</span>
                    {getSortIcon('isActive')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Last Login</span>
                    {getSortIcon('lastLogin')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Created</span>
                    {getSortIcon('createdAt')}
                  </div>
                </TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(user.id)}
                      onChange={() => handleSelectItem(user.id)}
                    />
                  </TableCell>
                  <TableCell>{renderUserCell(user)}</TableCell>
                  <TableCell>{renderRoleCell(user)}</TableCell>
                  <TableCell>{renderStatusCell(user)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>{renderActionsCell(user)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          <EnhancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={goToPage}
            onNextPage={goToNextPage}
            onPrevPage={goToPrevPage}
            showInfo={true}
            showPageNumbers={true}
            maxVisiblePages={5}
          />
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedItems.length} user(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete', selectedItems)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedUser && (
        <UserViewModal
          user={selectedUser}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      <UserFormModal
        user={editingUser}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleUserSaved}
      />

      {selectedUser && (
        <DeleteConfirmModal
          user={selectedUser}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleUserDeleted}
        />
      )}

      {selectedUser && (
        <UserStatusModal
          user={selectedUser}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}