"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ServiceViewModal } from "@/components/services/ServiceViewModal";
import { ServiceFormModal } from "@/components/services/ServiceFormModal";
import { ServiceStatusModal } from "@/components/services/ServiceStatusModal";
import { DeleteConfirmModal } from "@/components/services/DeleteConfirmModal";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockServices: Service[] = [
      {
        id: "1",
        name: "Paint Production & Supply",
        slug: "paint-production-supply",
        description: "High-quality decorative and industrial paints. Eco-friendly, durable, and affordable.",
        imageUrl: "/images/services/paint-production.jpg",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:22:00Z"
      },
      {
        id: "2",
        name: "Real Estate & Property Development",
        slug: "real-estate-property-development",
        description: "Residential and commercial building projects. Affordable housing solutions for communities.",
        imageUrl: "/images/services/real-estate.jpg",
        isActive: true,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: "3",
        name: "Interior & Exterior Design",
        slug: "interior-exterior-design",
        description: "Creative, functional, and sustainable design solutions.",
        imageUrl: "/images/services/design.jpg",
        isActive: true,
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-18T10:30:00Z"
      },
      {
        id: "4",
        name: "Construction & Renovation",
        slug: "construction-renovation",
        description: "Reliable construction and finishing services tailored to client needs.",
        imageUrl: "/images/services/construction.jpg",
        isActive: false,
        createdAt: "2024-01-18T08:45:00Z",
        updatedAt: "2024-01-19T12:15:00Z"
      }
    ];
    
    setServices(mockServices);
    setFilteredServices(mockServices);
    setIsLoading(false);
  }, []);

  // Filter services
  useEffect(() => {
    let filtered = services.filter(service => service != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(service => {
        const name = (service.name || '').toLowerCase();
        const description = (service.description || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return name.includes(searchLower) || description.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(service => {
          if (key === 'status') return value === 'active' ? service.isActive : !service.isActive;
          return true;
        });
      }
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, filters]);

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsFormModalOpen(true);
  };

  const handleDeleteService = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleAddService = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  const handleServiceSaved = (savedService: Service) => {
    if (!savedService) return;
    
    if (editingService) {
      setServices(prev => prev.map(service => service.id === savedService.id ? savedService : service));
    } else {
      setServices(prev => [...prev, savedService]);
    }
    setIsFormModalOpen(false);
    setEditingService(null);
  };

  const handleServiceDeleted = (serviceId: string) => {
    if (!serviceId) return;
    
    setServices(prev => prev.filter(service => service.id !== serviceId));
    setIsDeleteModalOpen(false);
    setSelectedService(null);
  };

  const handleUpdateStatus = (service: Service) => {
    if (!service) return;
    
    setSelectedService(service);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (serviceId: string, status: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, isActive: status === 'active' } : s
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredServices.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600">Manage company services and offerings</p>
          </div>
          <Button
            onClick={handleAddService}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Service
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
                  placeholder="Search services..."
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
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((service) => (
            <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge
                    color={service.isActive ? "green" : "gray"}
                    size="sm"
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Created: {formatDate(service.createdAt)}</span>
                  <span>Updated: {formatDate(service.updatedAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewService(service)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditService(service)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit Service"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(service)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title={service.isActive ? "Deactivate" : "Activate"}
                  >
                    {service.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete Service"
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
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first service"}
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <Button onClick={handleAddService} leftIcon={<Plus className="h-4 w-4" />}>
                Add Service
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedService && (
        <ServiceViewModal
          service={selectedService}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      <ServiceFormModal
        service={editingService}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleServiceSaved}
      />

      {selectedService && (
        <DeleteConfirmModal
          service={selectedService}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleServiceDeleted}
        />
      )}

      {selectedService && (
        <ServiceStatusModal
          service={selectedService}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}
