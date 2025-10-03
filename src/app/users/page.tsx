"use client";

import React, { useState, useEffect } from "react";
import { Button, Checkbox, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, UserPlus, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UserViewModal } from "@/components/users/UserViewModal";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserStatusModal } from "@/components/users/UserStatusModal";
import { DeleteConfirmModal } from "@/components/users/DeleteConfirmModal";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@colorwaves.com",
        firstName: "John",
        lastName: "Doe",
        phone: "+1 (555) 123-4567",
        role: "SUPER_ADMIN",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        lastLogin: "2024-01-20T14:22:00Z"
      },
      {
        id: "2",
        email: "manager@colorwaves.com",
        firstName: "Jane",
        lastName: "Smith",
        phone: "+1 (555) 234-5678",
        role: "ADMIN",
        isActive: true,
        createdAt: "2024-01-16T09:15:00Z",
        lastLogin: "2024-01-19T16:45:00Z"
      },
      {
        id: "3",
        email: "support@colorwaves.com",
        firstName: "Mike",
        lastName: "Johnson",
        phone: "+1 (555) 345-6789",
        role: "SUPPORT",
        isActive: false,
        createdAt: "2024-01-17T11:20:00Z"
      }
    ];
    
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setIsLoading(false);
  }, []);

  // Filter and sort users
  useEffect(() => {
    // Filter out any undefined/null users first
    let filtered = users.filter(user => user != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(user => {
        if (!user) return false;
        const firstName = (user.firstName || '').toLowerCase();
        const lastName = (user.lastName || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return firstName.includes(searchLower) ||
               lastName.includes(searchLower) ||
               email.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(user => {
          if (!user) return false;
          if (key === 'role') return (user.role || '') === value;
          if (key === 'status') return value === 'active' ? (user.isActive ?? false) : !(user.isActive ?? false);
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof User] || '';
      const bValue = b[sortBy as keyof User] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, filters, sortBy, sortOrder]);

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

  const handleUserSaved = (savedUser: User) => {
    if (!savedUser) return;
    
    if (editingUser) {
      setUsers(prev => prev.map(user => user && user.id === savedUser.id ? savedUser : user));
    } else {
      setUsers(prev => [...prev, savedUser]);
    }
    setIsFormModalOpen(false);
    setEditingUser(null);
  };

  const handleUserDeleted = (userId: string) => {
    if (!userId) return;
    
    setUsers(prev => prev.filter(user => user && user.id !== userId));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateStatus = (user: User) => {
    if (!user) return;
    
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (userId: string, status: string) => {
    setUsers(prev => prev.map(u => 
      u && u.id === userId ? { ...u, isActive: status === 'active' } : u
    ));
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
    
    const isActive = user.isActive ?? false;
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
          title={user.isActive ? "Deactivate" : "Activate"}
        >
          {user.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
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
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredUsers.slice(startIndex, endIndex);

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.filter(user => user && user.id).map(user => user.id));
    }
  };

  const handleBulkAction = (action: string, ids: string[]) => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} users?`)) {
        setUsers(prev => prev.filter(user => user && !ids.includes(user.id)));
        setSelectedItems([]);
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage system users and their permissions</p>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value === 'all' ? null : e.target.value }))}
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
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
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
                  onChange={(e) => setPageSize(Number(e.target.value))}
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showInfo={true}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
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