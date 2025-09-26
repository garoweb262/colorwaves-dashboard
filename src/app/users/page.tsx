"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { Button } from "@/components/ui/button";
import { DataTable, type Column, type TableAction } from "@/components/ui/DataTable";
import { Modal, ConfirmModal, FormModal } from "@/components/ui/Modal";
import { TableOptions, type ColumnOption } from "@/components/ui/TableOptions";
import { Input } from "@/amal-ui";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  MoreHorizontal,
} from "lucide-react";

// Mock user data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15",
    createdAt: "2023-06-01",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Content Manager",
    status: "active",
    lastLogin: "2024-01-14",
    createdAt: "2023-07-15",
    avatar: "JS",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Editor",
    status: "inactive",
    lastLogin: "2024-01-10",
    createdAt: "2023-08-20",
    avatar: "BJ",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "Viewer",
    status: "pending",
    lastLogin: "Never",
    createdAt: "2024-01-05",
    avatar: "AB",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-13",
    createdAt: "2023-05-10",
    avatar: "CW",
  },
  {
    id: "6",
    name: "Diana Davis",
    email: "diana.davis@example.com",
    role: "Content Manager",
    status: "active",
    lastLogin: "2024-01-12",
    createdAt: "2023-09-01",
    avatar: "DD",
  },
  {
    id: "7",
    name: "Eve Miller",
    email: "eve.miller@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "2024-01-11",
    createdAt: "2023-10-15",
    avatar: "EM",
  },
  {
    id: "8",
    name: "Frank Garcia",
    email: "frank.garcia@example.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: "2024-01-08",
    createdAt: "2023-11-20",
    avatar: "FG",
  },
];

export default function UsersPage() {
  const breadcrumbs = [
    { label: "Users & Security", href: "/users" },
    { label: "User Management" }
  ];

  // State management
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>([
    { key: "name", label: "Name", visible: true, sortable: true, filterable: true },
    { key: "email", label: "Email", visible: true, sortable: true, filterable: true },
    { key: "role", label: "Role", visible: true, sortable: true, filterable: true },
    { key: "status", label: "Status", visible: true, sortable: true, filterable: true },
    { key: "lastLogin", label: "Last Login", visible: true, sortable: true, filterable: false },
    { key: "createdAt", label: "Created", visible: false, sortable: true, filterable: false },
  ]);

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    const visible = columnOptions.filter(col => col.visible);
    return columns.filter(col => visible.some(opt => opt.key === col.key));
  }, [columnOptions]);

  // Table columns definition
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      accessor: (user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.avatar}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "email",
      header: "Email",
      accessor: (user) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900">{user.email}</span>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "role",
      header: "Role",
      accessor: (user) => (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-gray-400" />
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {user.role}
          </span>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (user) => {
        const statusConfig = {
          active: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-400" },
          inactive: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" },
          pending: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-400" },
        };
        const config = statusConfig[user.status];
        
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${config.dot}`} />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </div>
        );
      },
      sortable: true,
      filterable: true,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      accessor: (user) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900">{user.lastLogin}</span>
        </div>
      ),
      sortable: true,
      filterable: false,
    },
    {
      key: "createdAt",
      header: "Created",
      accessor: (user) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900">{user.createdAt}</span>
        </div>
      ),
      sortable: true,
      filterable: false,
    },
  ];

  // Table actions
  const actions: TableAction<User>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (user) => {
        setCurrentUser(user);
        setIsViewModalOpen(true);
      },
      variant: "ghost",
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (user) => {
        setCurrentUser(user);
        setIsEditModalOpen(true);
      },
      variant: "ghost",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
      },
      variant: "ghost",
      className: "text-red-600 hover:text-red-700",
    },
  ];

  // Bulk actions
  const bulkActions: TableAction<User[]>[] = [
    {
      label: "Delete Selected",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedUsers) => {
        setSelectedUsers(selectedUsers);
        setIsDeleteModalOpen(true);
      },
      variant: "destructive",
    },
    {
      label: "Export Selected",
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedUsers) => {
        console.log("Exporting users:", selectedUsers);
        // Handle export logic
      },
      variant: "outline",
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "pending" as const,
  });

  // Handlers
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      lastLogin: "Never",
      createdAt: new Date().toISOString().split('T')[0],
      avatar: formData.name.split(' ').map(n => n[0]).join(''),
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    setFormData({ name: "", email: "", role: "Viewer", status: "pending" });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const updatedUsers = users.map(user =>
      user.id === currentUser.id
        ? { ...user, ...formData, avatar: formData.name.split(' ').map(n => n[0]).join('') }
        : user
    );
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setCurrentUser(null);
    setFormData({ name: "", email: "", role: "Viewer", status: "pending" });
  };

  const handleDeleteUser = () => {
    if (currentUser) {
      setUsers(users.filter(user => user.id !== currentUser.id));
      setCurrentUser(null);
    } else if (selectedUsers.length > 0) {
      setUsers(users.filter(user => !selectedUsers.some(selected => selected.id === user.id)));
      setSelectedUsers([]);
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    console.log(`Exporting users as ${format}`);
    // Handle export logic
  };

  const handleReset = () => {
    setColumnOptions([
      { key: "name", label: "Name", visible: true, sortable: true, filterable: true },
      { key: "email", label: "Email", visible: true, sortable: true, filterable: true },
      { key: "role", label: "Role", visible: true, sortable: true, filterable: true },
      { key: "status", label: "Status", visible: true, sortable: true, filterable: true },
      { key: "lastLogin", label: "Last Login", visible: true, sortable: true, filterable: false },
      { key: "createdAt", label: "Created", visible: false, sortable: true, filterable: false },
    ]);
  };

  // Custom filters component
  const customFilters = (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role Filter</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Content Manager">Content Manager</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );

  return (
    <DashboardRouteGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">
                Manage user accounts, roles, and permissions across the system.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TableOptions
                columns={columnOptions}
                onColumnsChange={setColumnOptions}
                onExport={handleExport}
                onReset={handleReset}
                customFilters={customFilters}
              />
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            data={users}
            columns={visibleColumns}
            actions={actions}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={5}
            selectable={true}
            onSelectionChange={setSelectedUsers}
            bulkActions={bulkActions}
            caption="User management table with advanced features"
            onRowClick={(user) => {
              setCurrentUser(user);
              setIsViewModalOpen(true);
            }}
          />

          {/* Add User Modal */}
          <FormModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Add New User"
            onSubmit={handleAddUser}
            submitText="Add User"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Editor">Editor</option>
                  <option value="Content Manager">Content Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </FormModal>

          {/* Edit User Modal */}
          <FormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit User"
            onSubmit={handleEditUser}
            submitText="Update User"
          >
            {currentUser && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={formData.name || currentUser.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email || currentUser.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role || currentUser.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Content Manager">Content Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status || currentUser.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}
          </FormModal>

          {/* View User Modal */}
          <Modal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            title="User Details"
            size="md"
          >
            {currentUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{currentUser.name}</h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Role</label>
                    <p className="text-sm text-gray-900">{currentUser.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <p className="text-sm text-gray-900 capitalize">{currentUser.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Login</label>
                    <p className="text-sm text-gray-900">{currentUser.lastLogin}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm text-gray-900">{currentUser.createdAt}</p>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteUser}
            title="Delete User"
            message={
              currentUser
                ? `Are you sure you want to delete ${currentUser.name}? This action cannot be undone.`
                : `Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`
            }
            confirmText="Delete"
            variant="destructive"
          />
        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
