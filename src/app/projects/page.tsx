"use client";

import React, { useState } from "react";
import { Button, Checkbox, useToast } from "@/amal-ui";
import { Plus, Edit, Trash2, Eye, Search, Filter, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTemplate } from "@/components/PageTemplate";
import { useCRUD } from "@/hooks/useCRUD";
import { useRouter } from "next/navigation";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { ProjectStatusModal } from "@/components/projects/ProjectStatusModal";
import { DeleteConfirmModal } from "@/components/projects/DeleteConfirmModal";

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

export default function ProjectsPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const {
    items: projects,
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
  } = useCRUD<Project>({
    endpoint: '/projects',
    pageSize: 10,
    initialFilters: { status: 'all' }
  });

  const handleViewProject = (project: Project) => {
    router.push(`/projects/${project.slug}`);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleAddProject = () => {
    setEditingProject(null);
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

  const isEmpty = projects.length === 0;

  const handleProjectSaved = async (savedProject: Project) => {
    if (!savedProject) return;
    
    try {
      if (editingProject) {
        // Update existing project
        const result = await updateItem(editingProject.id, savedProject);
        if (result) {
          setIsFormModalOpen(false);
          setEditingProject(null);
          addToast({
            variant: "success",
            title: "Project Updated",
            description: `Project "${savedProject.title}" has been updated successfully.`,
            duration: 4000
          });
        }
      } else {
        // Create new project - send only required fields
        const projectData = {
          title: savedProject.title,
          description: savedProject.description,
          client: savedProject.client,
          technologies: savedProject.technologies,
          imageUrls: savedProject.imageUrls,
          startDate: savedProject.startDate,
          endDate: savedProject.endDate,
          isActive: savedProject.isActive ?? true
        };
        const result = await createItem(projectData);
        if (result) {
          setIsFormModalOpen(false);
          setEditingProject(null);
          addToast({
            variant: "success",
            title: "Project Created",
            description: `Project "${savedProject.title}" has been created successfully.`,
            duration: 4000
          });
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      addToast({
        variant: "error",
        title: editingProject ? "Update Failed" : "Creation Failed",
        description: editingProject 
          ? "Failed to update project. Please try again."
          : "Failed to create project. Please try again.",
        duration: 5000
      });
    }
  };

  const handleProjectDeleted = async (projectId: string) => {
    if (!projectId) return;
    
    try {
      const success = await deleteItem(projectId);
      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
        addToast({
          variant: "success",
          title: "Project Deleted",
          description: "Project has been deleted successfully.",
          duration: 4000
        });
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

  const handleUpdateStatus = (project: Project) => {
    if (!project) return;
    
    setSelectedProject(project);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (projectId: string, status: string) => {
    try {
      const success = await updateStatus(projectId, status);
      if (success) {
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

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === projects.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(projects.map(project => project.id));
    }
  };

  const handleBulkAction = async (action: string, ids: string[]) => {
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${ids.length} projects?`)) {
        const success = await bulkDelete(ids);
        if (success) {
          setSelectedItems([]);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filtersContent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">Status</label>
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
        <label className="block text-sm font-medium text-white mb-1">Page Size</label>
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
        title="Project Management"
        description="Manage your project showcases and galleries"
        actionButton={
          <Button
            onClick={handleAddProject}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Project
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search projects..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filtersContent={filtersContent}
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage="No projects found"
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
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-card hover:glass-card-hover transition-all duration-200">
              {/* Project Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {project.imageUrls && project.imageUrls.length > 0 ? (
                  <img
                    src={project.imageUrls[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${project.imageUrls && project.imageUrls.length > 0 ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20`}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {project.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">No Image</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedItems.includes(project.id)}
                    onChange={() => handleSelectItem(project.id)}
                  />
                </div>

                {/* Image Count Badge */}
                {project.imageUrls && project.imageUrls.length > 0 && (
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {project.imageUrls.length} images
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="mb-3">
                  <p className="text-xs text-white/60 mb-1">Client:</p>
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {project.client}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 2).map((technology, index) => (
                      <span key={index} className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                        {technology}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-xs text-white/60">
                        +{project.technologies.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => router.push(`/projects/${project.slug}`)}
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
                      onClick={() => handleEditProject(project)}
                      className="text-palette-gold-600 hover:text-palette-gold-700"
                      title="Edit Project"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(project)}
                      className="text-palette-blue-600 hover:text-palette-blue-700"
                      title={project.isActive ? "Deactivate" : "Activate"}
                    >
                      {project.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project)}
                      className="text-destructive hover:text-destructive-600"
                      title="Delete Project"
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
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-300">
                {selectedItems.length} project(s) selected
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
      <ProjectFormModal
        project={editingProject}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleProjectSaved}
      />

      {selectedProject && (
        <DeleteConfirmModal
          project={selectedProject}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleProjectDeleted}
        />
      )}

      {selectedProject && (
        <ProjectStatusModal
          project={selectedProject}
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
    </DashboardLayout>
  );
}
