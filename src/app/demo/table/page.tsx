"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { Button } from "@/components/ui/button";
import { DataTable, type Column, type TableAction } from "@/components/ui/DataTable";
import { Modal, ConfirmModal, FormModal } from "@/components/ui/Modal";
import { TableOptions, type ColumnOption } from "@/components/ui/TableOptions";
import { Input } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Download, Star, Heart } from "lucide-react";

// Demo data
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  status: "in-stock" | "out-of-stock" | "discontinued";
  createdAt: string;
}

const demoProducts: Product[] = [
  {
    id: "1",
    name: "Premium Widget",
    category: "Electronics",
    price: 299.99,
    rating: 4.8,
    status: "in-stock",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Super Gadget",
    category: "Electronics",
    price: 199.99,
    rating: 4.5,
    status: "in-stock",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Amazing Tool",
    category: "Tools",
    price: 89.99,
    rating: 4.2,
    status: "out-of-stock",
    createdAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Cool Device",
    category: "Electronics",
    price: 149.99,
    rating: 4.7,
    status: "in-stock",
    createdAt: "2024-01-04",
  },
  {
    id: "5",
    name: "Old Product",
    category: "Tools",
    price: 29.99,
    rating: 3.8,
    status: "discontinued",
    createdAt: "2023-12-01",
  },
];

export default function TableDemoPage() {
  const breadcrumbs = [
    { label: "Demo", href: "/demo" },
    { label: "Table Features" }
  ];

  // State
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>([
    { key: "name", label: "Name", visible: true, sortable: true, filterable: true },
    { key: "category", label: "Category", visible: true, sortable: true, filterable: true },
    { key: "price", label: "Price", visible: true, sortable: true, filterable: true },
    { key: "rating", label: "Rating", visible: true, sortable: true, filterable: true },
    { key: "status", label: "Status", visible: true, sortable: true, filterable: true },
    { key: "createdAt", label: "Created", visible: false, sortable: true, filterable: false },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    status: "in-stock" as const,
  });

  // Columns definition
  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product Name",
      accessor: (product) => (
        <div className="font-medium text-gray-900">{product.name}</div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "category",
      header: "Category",
      accessor: (product) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {product.category}
        </span>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "price",
      header: "Price",
      accessor: (product) => (
        <div className="text-gray-900 font-medium">
          ${product.price.toFixed(2)}
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "rating",
      header: "Rating",
      accessor: (product) => (
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-gray-900">{product.rating}</span>
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (product) => {
        const statusConfig = {
          "in-stock": { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-400" },
          "out-of-stock": { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" },
          "discontinued": { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-400" },
        };
        const config = statusConfig[product.status];
        
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${config.dot}`} />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
              {product.status.replace("-", " ")}
            </span>
          </div>
        );
      },
      sortable: true,
      filterable: true,
    },
    {
      key: "createdAt",
      header: "Created",
      accessor: (product) => (
        <span className="text-gray-500 text-sm">{product.createdAt}</span>
      ),
      sortable: true,
      filterable: false,
    },
  ];

  // Actions
  const actions: TableAction<Product>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (product) => {
        setCurrentProduct(product);
        // You could open a view modal here
        console.log("Viewing product:", product);
      },
      variant: "ghost",
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (product) => {
        setCurrentProduct(product);
        setFormData({
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          rating: product.rating.toString(),
          status: product.status,
        });
        setIsEditModalOpen(true);
      },
      variant: "ghost",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (product) => {
        setCurrentProduct(product);
        setIsDeleteModalOpen(true);
      },
      variant: "ghost",
      className: "text-red-600 hover:text-red-700",
    },
  ];

  // Bulk actions
  const bulkActions: TableAction<Product[]>[] = [
    {
      label: "Delete Selected",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedProducts) => {
        setSelectedProducts(selectedProducts);
        setIsDeleteModalOpen(true);
      },
      variant: "destructive",
    },
    {
      label: "Export Selected",
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedProducts) => {
        console.log("Exporting products:", selectedProducts);
        alert(`Exporting ${selectedProducts.length} products!`);
      },
      variant: "outline",
    },
  ];

  // Handlers
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts([...products, newProduct]);
    setIsAddModalOpen(false);
    setFormData({ name: "", category: "", price: "", rating: "", status: "in-stock" });
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    
    const updatedProducts = products.map(product =>
      product.id === currentProduct.id
        ? {
            ...product,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            rating: parseFloat(formData.rating),
            status: formData.status,
          }
        : product
    );
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    setCurrentProduct(null);
    setFormData({ name: "", category: "", price: "", rating: "", status: "in-stock" });
  };

  const handleDeleteProduct = () => {
    if (currentProduct) {
      setProducts(products.filter(product => product.id !== currentProduct.id));
      setCurrentProduct(null);
    } else if (selectedProducts.length > 0) {
      setProducts(products.filter(product => !selectedProducts.some(selected => selected.id === product.id)));
      setSelectedProducts([]);
    }
    setIsDeleteModalOpen(false);
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    console.log(`Exporting products as ${format}`);
    alert(`Exporting products as ${format.toUpperCase()}!`);
  };

  const handleReset = () => {
    setColumnOptions([
      { key: "name", label: "Name", visible: true, sortable: true, filterable: true },
      { key: "category", label: "Category", visible: true, sortable: true, filterable: true },
      { key: "price", label: "Price", visible: true, sortable: true, filterable: true },
      { key: "rating", label: "Rating", visible: true, sortable: true, filterable: true },
      { key: "status", label: "Status", visible: true, sortable: true, filterable: true },
      { key: "createdAt", label: "Created", visible: false, sortable: true, filterable: false },
    ]);
  };

  // Custom filters
  const customFilters = (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Filter</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Tools">Tools</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
          <option value="discontinued">Discontinued</option>
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
              <h1 className="text-3xl font-bold text-gray-900">Table Features Demo</h1>
              <p className="text-gray-600 mt-2">
                Explore all the advanced table features including sorting, filtering, pagination, and more.
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
                Add Product
              </Button>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Advanced Filtering</h3>
              <p className="text-blue-700 text-sm">Search, filter by columns, and use custom filters</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Smart Sorting</h3>
              <p className="text-green-700 text-sm">Click column headers to sort data in any direction</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Bulk Operations</h3>
              <p className="text-purple-700 text-sm">Select multiple rows and perform bulk actions</p>
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            data={products}
            columns={columns.filter(col => columnOptions.find(opt => opt.key === col.key)?.visible)}
            actions={actions}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={3}
            selectable={true}
            onSelectionChange={setSelectedProducts}
            bulkActions={bulkActions}
            caption="Interactive product table with all features enabled"
            onRowClick={(product) => {
              setCurrentProduct(product);
              console.log("Clicked product:", product);
            }}
          />

          {/* Add Product Modal */}
          <FormModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Add New Product"
            onSubmit={handleAddProduct}
            submitText="Add Product"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>
          </FormModal>

          {/* Edit Product Modal */}
          <FormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Product"
            onSubmit={handleEditProduct}
            submitText="Update Product"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
            </div>
          </FormModal>

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteProduct}
            title="Delete Product"
            message={
              currentProduct
                ? `Are you sure you want to delete "${currentProduct.name}"? This action cannot be undone.`
                : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`
            }
            confirmText="Delete"
            variant="destructive"
          />
        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
