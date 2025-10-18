"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, useToast, Badge } from "@/amal-ui";
import { ArrowLeft, Calendar, Tag, Edit, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SocialShare } from "@/components/SocialShare";
import { crudAPI } from "@/lib/api";

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const slug = params.slug as string;
        const response = await crudAPI.getItemBySlug<Product>('/products', slug);
        
        if (response.success) {
          setProduct(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch product details",
            duration: 5000
          });
          router.push("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Product not found",
          duration: 5000
        });
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug, addToast, router]);

  const handleEdit = () => {
    router.push(`/products?edit=${product?.id}`);
  };

  const handleDelete = async () => {
    if (!product) return;
    
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await crudAPI.deleteItem('/products', product.id);
        addToast({
          variant: "success",
          title: "Success",
          description: "Product deleted successfully",
          duration: 3000
        });
        router.push("/products");
      } catch (error) {
        console.error("Error deleting product:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to delete product",
          duration: 5000
        });
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;
    
    try {
      const newStatus = product.isActive ? "inactive" : "active";
      const response = await crudAPI.updateStatus('/products', product.id, newStatus);
      
      if (response.success) {
        setProduct(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
        addToast({
          variant: "success",
          title: "Success",
          description: "Product status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update product status",
        duration: 5000
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product!.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product!.imageUrls.length) % product!.imageUrls.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="glass-card p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mx-auto"></div>
            <p className="text-white/80 mt-4 text-center">Loading product details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="glass-card p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Product not found</h2>
            <p className="text-white/80 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/products")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Products
          </Button>
          <div className="flex items-center space-x-2">
            <SocialShare
              url={`${window.location.origin}/products/${product.slug}`}
              title={product.name}
              description={product.description}
              imageUrl={product.imageUrls?.[0]}
              hashtags={[product.category]}
            />
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              leftIcon={product.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            >
              {product.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-destructive hover:text-destructive-600"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-card overflow-hidden">
          {/* Product Images */}
          {product.imageUrls && product.imageUrls.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={product.imageUrls[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
                
                {product.imageUrls.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                        {currentImageIndex + 1} / {product.imageUrls.length}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge color="purple" size="md">
                    {product.category}
                  </Badge>
                  <Badge color={product.isActive ? "green" : "gray"} size="md">
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Benefits</h2>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3 text-white/80">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3 text-white/80">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Image Gallery Thumbnails */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">All Images</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.imageUrls.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all backdrop-blur-sm ${
                        index === currentImageIndex ? 'border-blue-400 bg-blue-400/20' : 'border-white/20 hover:border-white/40 bg-white/5'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-6 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
                <div>
                  <span className="font-medium text-white/90">Created:</span> {formatDate(product.createdAt)}
                </div>
                <div>
                  <span className="font-medium text-white/90">Last Updated:</span> {formatDate(product.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

