"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, useToast } from "@/amal-ui";
import { ArrowLeft, Edit, Trash2, ToggleLeft, ToggleRight, Calendar, Clock, User, Tag, Image as ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { crudAPI } from "@/lib/api";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { DeleteConfirmModal } from "@/components/projects/DeleteConfirmModal";
import { ProjectStatusModal } from "@/components/projects/ProjectStatusModal";

interface Project {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string;
  technologies: string[];
  imageUrls: string[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.slug) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch by slug first, then by ID if slug fails
        let response;
        try {
          console.log('Fetching project by slug:', params.slug);
          response = await crudAPI.getItemBySlug<Project>('/projects', params.slug as string);
          console.log('Slug response:', response);
        } catch (slugError) {
          console.log('Slug fetch failed, trying by ID:', slugError);
          // If slug fetch fails, try by ID
          response = await crudAPI.getItem<Project>('/projects', params.slug as string);
        }
        
        if (response.success) {
          setProject(response.data);
        } else {
          setError('Project not found');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.slug]);

  const handleEdit = () => {
    setIsFormModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleUpdateStatus = () => {
    setIsStatusModalOpen(true);
  };

  const handleProjectSaved = async (savedProject: Project) => {
    if (!savedProject) return;
    
    try {
      // Update the project in state
      setProject(savedProject);
      setIsFormModalOpen(false);
      
      addToast({
        variant: "success",
        title: "Project Updated",
        description: `Project "${savedProject.title}" has been updated successfully.`,
        duration: 4000
      });
    } catch (error) {
      console.error("Error updating project:", error);
      addToast({
        variant: "error",
        title: "Update Failed",
        description: "Failed to update project. Please try again.",
        duration: 5000
      });
    }
  };

  const handleProjectDeleted = async (projectId: string) => {
    if (!projectId) return;
    
    try {
      const success = await crudAPI.deleteItem('/projects', projectId);
      if (success) {
        setIsDeleteModalOpen(false);
        addToast({
          variant: "success",
          title: "Project Deleted",
          description: "Project has been deleted successfully.",
          duration: 4000
        });
        router.push('/projects');
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      addToast({
        variant: "error",
        title: "Delete Failed",
        description: "Failed to delete project. Please try again.",
        duration: 5000
      });
    }
  };

  const handleStatusUpdate = async (projectId: string, status: string) => {
    try {
      const success = await crudAPI.updateStatus('/projects', projectId, status);
      if (success) {
        // Update the project status in state
        setProject(prev => prev ? { ...prev, isActive: status === 'active' } : null);
        setIsStatusModalOpen(false);
        
        addToast({
          variant: "success",
          title: "Status Updated",
          description: `Project status has been updated to ${status}.`,
          duration: 4000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Status Update Failed",
        description: "Failed to update project status. Please try again.",
        duration: 5000
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
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

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The project you're looking for doesn't exist."}</p>
            <Button onClick={() => router.push('/projects')} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Projects
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
              variant="outline"
              onClick={() => router.push('/projects')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Projects
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-600">Project Details</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleEdit}
              leftIcon={<Edit className="h-4 w-4" />}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              Edit Project
            </Button>
            <Button
              onClick={handleUpdateStatus}
              variant="outline"
              leftIcon={project.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              className={project.isActive ? "text-green-600 hover:text-green-700" : "text-gray-600 hover:text-gray-700"}
            >
              {project.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              leftIcon={<Trash2 className="h-4 w-4" />}
              className="text-destructive hover:text-destructive-600"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image Gallery */}
            {project.imageUrls && project.imageUrls.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Project Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.imageUrls.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => window.open(imageUrl, '_blank')}
                        >
                          View Full Size
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Technologies & Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((technology, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Project Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Client</p>
                    <p className="text-sm text-gray-600">{project.client}</p>
                  </div>
                </div>
                
                {project.startDate && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start Date</p>
                      <p className="text-sm text-gray-600">{formatDate(project.startDate)}</p>
                    </div>
                  </div>
                )}
                
                {project.endDate && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">End Date</p>
                      <p className="text-sm text-gray-600">{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{formatDateTime(project.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDateTime(project.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectFormModal
        project={project}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleProjectSaved}
      />

      <DeleteConfirmModal
        project={project}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleProjectDeleted}
      />

      <ProjectStatusModal
        project={project}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdateStatus={handleStatusUpdate}
      />
    </DashboardLayout>
  );
}
