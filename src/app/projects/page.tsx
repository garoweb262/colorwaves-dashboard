"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProjectViewModal } from "@/components/projects/ProjectViewModal";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { ProjectStatusModal } from "@/components/projects/ProjectStatusModal";
import { DeleteConfirmModal } from "@/components/projects/DeleteConfirmModal";

interface Project {
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "Residential Housing Estate in Abuja",
        slug: "residential-housing-estate-abuja",
        client: "Abuja Development Corporation",
        technologies: ["Architectural Design", "Construction Management", "Quality Control"],
        imageUrls: ["/images/projects/housing-estate-1.jpg", "/images/projects/housing-estate-2.jpg"],
        description: "A comprehensive residential development featuring modern housing units with premium finishes and sustainable design.",
        startDate: "2023-01-15",
        endDate: "2023-12-30",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:22:00Z"
      },
      {
        id: "2",
        title: "Office Renovation for Corporate Client",
        slug: "office-renovation-corporate-client",
        client: "TechCorp Solutions",
        technologies: ["Interior Design", "Space Planning", "Color Consultation"],
        imageUrls: ["/images/projects/office-renovation-1.jpg", "/images/projects/office-renovation-2.jpg"],
        description: "Complete office space transformation with modern design elements and professional color schemes.",
        startDate: "2023-03-01",
        endDate: "2023-06-15",
        isActive: true,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-19T16:45:00Z"
      },
      {
        id: "3",
        title: "Industrial Paint Supply for Local Manufacturers",
        slug: "industrial-paint-supply-manufacturers",
        client: "Manufacturing Alliance",
        technologies: ["Industrial Coatings", "Supply Chain Management", "Quality Assurance"],
        imageUrls: ["/images/projects/industrial-supply-1.jpg", "/images/projects/industrial-supply-2.jpg"],
        description: "Specialized industrial coating solutions for manufacturing facilities with high-performance requirements.",
        startDate: "2023-05-10",
        endDate: "2023-08-20",
        isActive: true,
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-18T10:30:00Z"
      }
    ];
    
    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
    setIsLoading(false);
  }, []);

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects.filter(project => project != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(project => {
        const name = (project.title || '').toLowerCase();
        const description = (project.description || '').toLowerCase();
        const technologies = project.technologies.join(' ').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return name.includes(searchLower) || 
               description.includes(searchLower) || 
               technologies.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(project => {
          if (key === 'status') return value === 'active' ? project.isActive : !project.isActive;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Project] || '';
      const bValue = b[sortBy as keyof Project] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filters, sortBy, sortOrder]);

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
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

  const handleProjectSaved = (savedProject: Project) => {
    if (!savedProject) return;
    
    if (editingProject) {
      setProjects(prev => prev.map(project => project.id === savedProject.id ? savedProject : project));
    } else {
      setProjects(prev => [...prev, savedProject]);
    }
    setIsFormModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectDeleted = (projectId: string) => {
    if (!projectId) return;
    
    setProjects(prev => prev.filter(project => project.id !== projectId));
    setIsDeleteModalOpen(false);
    setSelectedProject(null);
  };

  const handleUpdateStatus = (project: Project) => {
    if (!project) return;
    
    setSelectedProject(project);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (projectId: string, status: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, isActive: status === 'active' } : p
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Sorting functionality
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredProjects.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Project Showcases</h1>
            <p className="text-gray-600">Manage featured projects and before/after galleries</p>
          </div>
          <Button
            onClick={handleAddProject}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Project
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
                  placeholder="Search projects..."
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
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Project Name</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Description</span>
                      {getSortIcon('description')}
                    </div>
                  </TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('isActive')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {getSortIcon('isActive')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Created</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {project.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 2).map((technology, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {technology}
                            </span>
                          ))}
                          {project.technologies.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{project.technologies.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge color="blue" size="sm">
                          {project.imageUrls.length} images
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(project.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProject(project)}
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showInfo={true}
            totalItems={filteredProjects.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedProject && (
        <ProjectViewModal
          project={selectedProject}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

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
