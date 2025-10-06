"use client";

import React, { useState } from "react";
import { Button, Checkbox, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTemplate } from "@/components/PageTemplate";
import { useCRUD } from "@/hooks/useCRUD";
import { useRouter } from "next/navigation";
import { ServiceFormModal } from "@/components/services/ServiceFormModal";
import { DeleteConfirmModal } from "@/components/services/DeleteConfirmModal";
import { ServiceStatusModal } from "@/components/services/ServiceStatusModal";

interface Service {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export default function ServicesPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    items: services,
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
  } = useCRUD<Service>({
    endpoint: '/services',
    pageSize: 10,
    initialFilters: { status: 'all' }
  });

  const handleViewService = (service: Service) => {
    router.push(`/services/${service.slug}`);
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFilter = (key: string, value: any) => {
    setFilters((prev: Record<string, any>) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const isEmpty = services.length === 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleServiceSaved = async (savedService: Service) => {
    if (!savedService) return;
    
    try {
      if (editingService) {
        // Update existing service
        const result = await updateItem(editingService.id, savedService);
        if (result) {
          setIsFormModalOpen(false);
          setEditingService(null);
          addToast({
            variant: "success",
            title: "Service Updated",
            description: `Service "${savedService.name}" has been updated successfully.`,
            duration: 4000
          });
        }
      } else {
        // Create new service - send only required fields
        const serviceData = {
          name: savedService.name,
          description: savedService.description,
          imageUrl: savedService.imageUrl,
          isActive: savedService.isActive
        };
        const result = await createItem(serviceData);
        if (result) {
          setIsFormModalOpen(false);
          setEditingService(null);
          addToast({
            variant: "success",
            title: "Service Created",
            description: `Service "${savedService.name}" has been created successfully.`,
            duration: 4000
          });
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      addToast({
        variant: "error",
        title: editingService ? "Update Failed" : "Creation Failed",
        description: editingService 
          ? "Failed to update service. Please try again."
          : "Failed to create service. Please try again.",
        duration: 5000
      });
    }
  };

  const handleServiceDeleted = async (serviceId: string) => {
    if (!serviceId) return;
    
    try {
      const success = await deleteItem(serviceId);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedService(null);
        addToast({
          variant: "success",
          title: "Service Deleted",
          description: "Service has been deleted successfully.",
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      addToast({
        variant: "error",
        title: "Delete Failed",
        description: "Failed to delete service. Please try again.",
        duration: 5000
      });
    }
  };

  const handleUpdateStatus = (service: Service) => {
    if (!service) return;
    
    setSelectedService(service);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (serviceId: string, status: string) => {
    try {
      const success = await updateStatus(serviceId, status);
      if (success) {
        addToast({
          variant: "success",
          title: "Status Updated",
          description: `Service status has been updated to ${status}.`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Status Update Failed",
        description: "Failed to update service status. Please try again.",
        duration: 5000
      });
    }
  };


  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === services.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(services.map(service => service.id));
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} services?`)) {
        const success = await bulkDelete(ids);
        if (success) {
          setSelectedItems([]);
        }
      }
    }
  };

  const filtersContent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => {
            const value = e.target.value === 'all' ? null : e.target.value;
            handleFilter('status', value);
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
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <PageTemplate
        title="Service Management"
        description="Manage your services and pricing"
        actionButton={
          <Button
            onClick={handleAddService}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Service
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search services..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filtersContent={filtersContent}
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage="No services found"
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPrevPage={goToPrevPage}
        onRefresh={fetchItems}
      >
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Service Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${service.imageUrl ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {service.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">No Image</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedItems.includes(service.id)}
                    onChange={() => handleSelectItem(service.id)}
                  />
                </div>
              </div>

              {/* Service Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => handleViewService(service)}
                    className="flex-1 bg-primary hover:bg-primary-600 text-primary-foreground"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  <div className="flex items-center space-x-1 ml-2">
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
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedItems.length} service(s) selected
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
      </PageTemplate>

      {/* Modals */}
      <ServiceFormModal
        service={editingService}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleServiceSaved}
      />

      <DeleteConfirmModal
        service={selectedService}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleServiceDeleted}
      />

      <ServiceStatusModal
        service={selectedService}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedService(null);
        }}
        onUpdateStatus={handleStatusUpdate}
      />
    </DashboardLayout>
  );
}