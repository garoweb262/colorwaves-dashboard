"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Badge, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductViewModal } from "@/components/products/ProductViewModal";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { ProductStatusModal } from "@/components/products/ProductStatusModal";
import { DeleteConfirmModal } from "@/components/products/DeleteConfirmModal";
import { productsAPI } from "@/lib/api";

interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  category: string;
  isActive: boolean;
  benefits: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { addToast } = useToast();
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getProducts();
        if (response.success) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch products",
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to fetch products",
          duration: 5000
        });
        // Fallback to empty array
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [addToast]);

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

  const handleProductSaved = async (savedProduct: Product) => {
    if (!savedProduct) return;
    
    try {
      if (editingProduct) {
        // Update existing product in local state
        setProducts(prev => prev.map(product => product.id === savedProduct.id ? savedProduct : product));
      } else {
        // Add new product to local state
        setProducts(prev => [...prev, savedProduct]);
      }
    } catch (error) {
      console.error("Error updating product list:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update product list",
        duration: 5000
      });
    } finally {
      setIsFormModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleProductDeleted = async (productId: string) => {
    if (!productId) return;
    
    try {
      await productsAPI.deleteProduct(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
      addToast({
        variant: "success",
        title: "Success",
        description: "Product deleted successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to delete product",
        duration: 5000
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleUpdateStatus = (product: Product) => {
    if (!product) return;
    
    setSelectedProduct(product);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (productId: string, status: string) => {
    try {
      const response = await productsAPI.updateStatus(productId, status);
      if (response.success) {
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, isActive: status === 'active' } : p
        ));
        addToast({
          variant: "success",
          title: "Success",
          description: "Product status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update product status",
        duration: 5000
      });
    } finally {
      setIsStatusModalOpen(false);
      setSelectedProduct(null);
    }
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
            <h1 className="text-2xl font-bold text-white">Products Management</h1>
            <p className="text-white/70">Manage company products and offerings</p>
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
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 glass-form-section rounded-md">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
                <select
                  value={filters.category || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Page Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="w-full glass-select px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30"
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
        {filteredProducts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-white/70">No products found. Add your first product to get started.</p>
            <Button
              onClick={handleAddProduct}
              className="mt-4"
            >
              Add Product
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((product) => (
                <div key={product.id} className="glass-card hover:glass-card-hover transition-all duration-200 overflow-hidden">
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
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    
                    <Badge color="purple" size="sm" className="mb-2">
                      {product.category}
                    </Badge>
                    
                    <p className="text-sm text-white/70 mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                      <span>Created: {formatDate(product.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/products/${product.slug}`)}
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
                <span className="text-sm text-white/70">
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
          </>
        )}
      </div>

      {/* Modals */}
      <ProductViewModal
        product={selectedProduct}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProduct(null);
        }}
      />

      <ProductFormModal
        product={editingProduct}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleProductSaved}
      />

      <DeleteConfirmModal
        product={selectedProduct}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleProductDeleted}
      />

      <ProductStatusModal
        product={selectedProduct}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedProduct(null);
        }}
        onUpdateStatus={handleStatusUpdate}
      />
    </DashboardLayout>
  );
}
