"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductViewModal } from "@/components/products/ProductViewModal";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { ProductStatusModal } from "@/components/products/ProductStatusModal";
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal";
import { SkeletonGrid, EmptyProductsState } from "@/components/ui";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Emulsion Paints",
        description: "High-quality emulsion paints for interior and exterior walls. Available in various colors and finishes.",
        imageUrls: [
          "/images/products/emulsion-1.jpg",
          "/images/products/emulsion-2.jpg",
          "/images/products/emulsion-3.jpg"
        ],
        category: "Paints Line",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:22:00Z"
      },
      {
        id: "2",
        name: "Gloss Paints",
        description: "Premium gloss paints for doors, windows, and metal surfaces. Durable and weather-resistant.",
        imageUrls: [
          "/images/products/gloss-1.jpg",
          "/images/products/gloss-2.jpg"
        ],
        category: "Paints Line",
        isActive: true,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: "3",
        name: "Textured Coatings",
        description: "Decorative textured coatings for unique wall finishes. Easy to apply and maintain.",
        imageUrls: [
          "/images/products/textured-1.jpg",
          "/images/products/textured-2.jpg",
          "/images/products/textured-3.jpg",
          "/images/products/textured-4.jpg"
        ],
        category: "Paints Line",
        isActive: true,
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-18T10:30:00Z"
      },
      {
        id: "4",
        name: "Industrial Protective Paints",
        description: "Heavy-duty protective paints for industrial applications. Corrosion-resistant and long-lasting.",
        imageUrls: [
          "/images/products/industrial-1.jpg",
          "/images/products/industrial-2.jpg"
        ],
        category: "Paints Line",
        isActive: true,
        createdAt: "2024-01-18T08:45:00Z",
        updatedAt: "2024-01-19T12:15:00Z"
      },
      {
        id: "5",
        name: "Painting Accessories",
        description: "Complete range of painting accessories including brushes, rollers, and tools.",
        imageUrls: [
          "/images/products/accessories-1.jpg",
          "/images/products/accessories-2.jpg",
          "/images/products/accessories-3.jpg"
        ],
        category: "Other Solutions",
        isActive: true,
        createdAt: "2024-01-19T14:30:00Z",
        updatedAt: "2024-01-20T09:15:00Z"
      },
      {
        id: "6",
        name: "Specialized Coatings",
        description: "Coatings for specialized projects including fire-resistant and anti-microbial options.",
        imageUrls: [
          "/images/products/specialized-1.jpg"
        ],
        category: "Other Solutions",
        isActive: false,
        createdAt: "2024-01-20T16:20:00Z",
        updatedAt: "2024-01-21T11:45:00Z"
      }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setIsLoading(false);
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products.filter(product => product != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(product => {
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return name.includes(searchLower) || 
               description.includes(searchLower) || 
               category.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(product => {
          if (key === 'status') return value === 'active' ? product.isActive : !product.isActive;
          if (key === 'category') return product.category === value;
          return true;
        });
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleProductSaved = (savedProduct: Product) => {
    if (!savedProduct) return;
    
    if (editingProduct) {
      setProducts(prev => prev.map(product => product.id === savedProduct.id ? savedProduct : product));
    } else {
      setProducts(prev => [...prev, savedProduct]);
    }
    setIsFormModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductDeleted = (productId: string) => {
    if (!productId) return;
    
    setProducts(prev => prev.filter(product => product.id !== productId));
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateStatus = (product: Product) => {
    if (!product) return;
    
    setSelectedProduct(product);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (productId: string, status: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: status === 'active' } : p
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredProducts.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600">Manage company products and offerings</p>
            </div>
            <Button
              disabled
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              Add Product
            </Button>
          </div>
          <SkeletonGrid items={6} />
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
            <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600">Manage company products and offerings</p>
          </div>
          <Button
            onClick={handleAddProduct}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Product
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
                  placeholder="Search products..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    color={product.isActive ? "green" : "gray"}
                    size="sm"
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {product.imageUrls.length > 1 && (
                  <div className="absolute bottom-2 right-2">
                    <Badge color="blue" size="sm">
                      +{product.imageUrls.length - 1} more
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                </div>
                
                <Badge color="purple" size="sm" className="mb-2">
                  {product.category}
                </Badge>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Created: {formatDate(product.createdAt)}</span>
                  <span>Updated: {formatDate(product.updatedAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewProduct(product)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit Product"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(product)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title={product.isActive ? "Deactivate" : "Activate"}
                  >
                    {product.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProduct(product)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete Product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <EmptyProductsState
            onAdd={handleAddProduct}
            className="py-12"
          />
        )}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      <ProductFormModal
        product={editingProduct}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleProductSaved}
      />

      {selectedProduct && (
        <DeleteConfirmModal
          product={selectedProduct}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleProductDeleted}
        />
      )}

      {selectedProduct && (
        <ProductStatusModal
          product={selectedProduct}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}
