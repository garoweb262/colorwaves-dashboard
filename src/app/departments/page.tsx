"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface Department {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockDepartments: Department[] = [
      {
        id: "1",
        name: "Production",
        description: "Paint formulation, quality control, and manufacturing operations",
        icon: "🏭",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        name: "Marketing",
        description: "Brand growth, partnerships, and market expansion strategies",
        icon: "📈",
        isActive: true,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-16T09:15:00Z"
      },
      {
        id: "3",
        name: "Project Management",
        description: "Project execution, client coordination, and delivery management",
        icon: "📋",
        isActive: true,
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-17T11:20:00Z"
      },
      {
        id: "4",
        name: "Sales & Distribution",
        description: "Sales operations, distribution networks, and customer relationships",
        icon: "💼",
        isActive: true,
        createdAt: "2024-01-18T08:45:00Z",
        updatedAt: "2024-01-18T08:45:00Z"
      },
      {
        id: "5",
        name: "Human Resources",
        description: "Talent acquisition, employee development, and organizational culture",
        icon: "👥",
        isActive: false,
        createdAt: "2024-01-19T14:30:00Z",
        updatedAt: "2024-01-20T10:15:00Z"
      }
    ];
    
    setDepartments(mockDepartments);
    setFilteredDepartments(mockDepartments);
    setIsLoading(false);
  }, []);

  // Filter and sort departments
  useEffect(() => {
    let filtered = departments.filter(department => department != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(department => {
        const name = (department.name || '').toLowerCase();
        const description = (department.description || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return name.includes(searchLower) || 
               description.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(department => {
          if (key === 'status') return value === 'active' ? department.isActive : !department.isActive;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Department] || '';
      const bValue = b[sortBy as keyof Department] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredDepartments(filtered);
  }, [departments, searchTerm, filters, sortBy, sortOrder]);

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setIsFormModalOpen(true);
  };

  const handleDeleteDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsFormModalOpen(true);
  };

  const handleDepartmentSaved = (savedDepartment: Department) => {
    if (!savedDepartment) return;
    
    if (editingDepartment) {
      setDepartments(prev => prev.map(department => department.id === savedDepartment.id ? savedDepartment : department));
    } else {
      setDepartments(prev => [...prev, savedDepartment]);
    }
    setIsFormModalOpen(false);
    setEditingDepartment(null);
  };

  const handleDepartmentDeleted = (departmentId: string) => {
    if (!departmentId) return;
    
    setDepartments(prev => prev.filter(department => department.id !== departmentId));
    setIsDeleteModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleUpdateStatus = (department: Department) => {
    if (!department) return;
    
    setSelectedDepartment(department);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (departmentId: string, isActive: boolean) => {
    setDepartments(prev => prev.map(d => 
      d.id === departmentId ? { ...d, isActive } : d
    ));
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
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
  const totalPages = Math.ceil(filteredDepartments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredDepartments.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600">Manage company departments and organizational structure</p>
          </div>
          <Button
            onClick={handleAddDepartment}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Department
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
                  placeholder="Search departments..."
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

        {/* Departments Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
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
                {paginatedData.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div className="text-2xl">
                        {department.icon || "🏢"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-gray-900">{department.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {department.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(department.isActive)}`}>
                        {department.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(department.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDepartment(department)}
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="Edit Department"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(department)}
                          className="text-palette-blue-600 hover:text-palette-blue-700"
                          title={department.isActive ? "Deactivate" : "Activate"}
                        >
                          {department.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDepartment(department)}
                          className="text-destructive hover:text-destructive-600"
                          title="Delete Department"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
            totalItems={filteredDepartments.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals will be implemented next */}
    </DashboardLayout>
  );
}
