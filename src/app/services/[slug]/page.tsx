"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, useToast } from "@/amal-ui";
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight, Calendar, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { crudAPI } from "@/lib/api";

interface Service {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!params.slug) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch by slug first, then by ID if slug fails
        let response;
        try {
          response = await crudAPI.getItemBySlug<Service>('/services', params.slug as string);
        } catch (slugError) {
          // If slug fetch fails, try by ID
          response = await crudAPI.getItem<Service>('/services', params.slug as string);
        }
        
        if (response.success) {
          setService(response.data);
        } else {
          setError('Service not found');
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Failed to load service details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [params.slug]);

  const handleEdit = () => {
    if (service) {
      router.push(`/services/edit/${service.id}`);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        const response = await crudAPI.deleteItem('/services', service.id);
        if (response.success) {
          addToast({
            variant: "success",
            title: "Service Deleted",
            description: `Service "${service.name}" has been deleted successfully.`,
            duration: 4000
          });
          router.push('/services');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        addToast({
          variant: "error",
          title: "Delete Failed",
          description: "Failed to delete service. Please try again.",
          duration: 5000
        });
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!service) return;
    
    try {
      const newStatus = service.isActive ? 'inactive' : 'active';
      const response = await crudAPI.updateStatus('/services', service.id, newStatus);
      
      if (response.success) {
        setService(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
        addToast({
          variant: "success",
          title: "Status Updated",
          description: `Service status has been updated to ${newStatus}.`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      addToast({
        variant: "error",
        title: "Status Update Failed",
        description: "Failed to update service status. Please try again.",
        duration: 5000
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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

  if (error || !service) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The service you're looking for doesn't exist."}</p>
            <Button onClick={() => router.push('/services')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Services
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/services')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-gray-600">Service Details</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleStatusToggle}
              leftIcon={service.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              className={service.isActive ? "text-green-600 hover:text-green-700" : "text-gray-600 hover:text-gray-700"}
            >
              {service.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button
              onClick={handleEdit}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="relative h-64 bg-gray-100">
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
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {service.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-500">No Image Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {service.description || "No description available for this service."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Service ID</label>
                  <p className="text-sm text-gray-900 font-mono">{service.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Slug</label>
                  <p className="text-sm text-gray-900 font-mono">{service.slug}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-sm text-gray-900">{service.name}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
              <div className="space-y-4">
                {service.createdAt && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-sm text-gray-500">{formatDate(service.createdAt)}</p>
                    </div>
                  </div>
                )}
                {service.updatedAt && (
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(service.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
