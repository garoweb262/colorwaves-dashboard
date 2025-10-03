"use client";

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DataTable, DataTableColumn, DataTableAction, FilterOption } from '../index';
import { Eye, Edit, Trash2, Download, Upload } from 'lucide-react';

// Example data interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
}

export default function DataTableExample() {
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockData: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro',
        category: 'Electronics',
        price: 999,
        stock: 50,
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'MacBook Pro',
        category: 'Electronics',
        price: 1999,
        stock: 25,
        status: 'active',
        createdAt: '2024-01-16T09:15:00Z',
      },
      {
        id: '3',
        name: 'AirPods Pro',
        category: 'Electronics',
        price: 249,
        stock: 0,
        status: 'inactive',
        createdAt: '2024-01-17T11:20:00Z',
      },
      {
        id: '4',
        name: 'iPad Air',
        category: 'Electronics',
        price: 599,
        stock: 30,
        status: 'draft',
        createdAt: '2024-01-18T14:45:00Z',
      },
      {
        id: '5',
        name: 'Apple Watch',
        category: 'Electronics',
        price: 399,
        stock: 40,
        status: 'active',
        createdAt: '2024-01-19T16:30:00Z',
      },
    ];

    setData(mockData);
    setFilteredData(mockData);
  }, []);

  // Filter and sort data
  useEffect(() => {
    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = item[key as keyof Product];
          if (typeof value === 'boolean') {
            return Boolean(itemValue) === value;
          }
          return itemValue === value || itemValue?.toString().toLowerCase().includes(value.toString().toLowerCase());
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Product];
      const bValue = b[sortBy as keyof Product];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(filtered);
  }, [data, searchTerm, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Table columns
  const columns: DataTableColumn[] = [
    {
      key: 'name',
      title: 'Product Name',
      render: (item: Product) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {item.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-sm text-gray-500">{item.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (item: Product) => (
        <span className="font-medium text-gray-900">
          ${item.price.toFixed(2)}
        </span>
      )
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (item: Product) => (
        <span className={`font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {item.stock}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (item: Product) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
          draft: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      title: 'Created',
      render: (item: Product) => (
        <span className="text-sm text-gray-600">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      )
    },
  ];

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Books', label: 'Books' },
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'draft', label: 'Draft' },
      ]
    },
    {
      key: 'stock',
      label: 'In Stock',
      type: 'boolean'
    }
  ];

  // Sort options
  const sortOptions = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created Date' },
  ];

  // Actions
  const actions: DataTableAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (item: Product) => {
        console.log('View item:', item);
        alert(`Viewing ${item.name}`);
      },
      variant: 'ghost',
      className: 'text-palette-gold-600 hover:text-palette-gold-700',
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (item: Product) => {
        console.log('Edit item:', item);
        alert(`Editing ${item.name}`);
      },
      variant: 'ghost',
      className: 'text-palette-gold-600 hover:text-palette-gold-700',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: Product) => {
        console.log('Delete item:', item);
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
          setData(prev => prev.filter(i => i.id !== item.id));
        }
      },
      variant: 'ghost',
      className: 'text-destructive hover:text-destructive-600',
    },
  ];

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(item => item.id));
    }
  };

  const handleBulkAction = (action: string, ids: string[]) => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} items?`)) {
        setData(prev => prev.filter(item => !ids.includes(item.id)));
        setSelectedItems([]);
      }
    }
  };

  const handleExport = () => {
    console.log('Exporting data...');
    alert('Export functionality would be implemented here');
  };

  const handleImport = () => {
    console.log('Importing data...');
    alert('Import functionality would be implemented here');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Table Example</h1>
          <p className="text-gray-600">Demonstration of the reusable DataTable component with search, filtering, sorting, and pagination</p>
        </div>

        <DataTable
          data={paginatedData}
          columns={columns}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
          filterOptions={filterOptions}
          searchPlaceholder="Search products..."
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(newSortBy, newSortOrder) => {
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}
          sortOptions={sortOptions}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 25, 50]}
          actions={actions}
          showBulkActions={true}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onBulkAction={handleBulkAction}
          emptyMessage="No products found"
          isLoading={isLoading}
          showExport={true}
          showImport={true}
          onExport={handleExport}
          onImport={handleImport}
          entityName="products"
        />
      </div>
    </DashboardLayout>
  );
}
