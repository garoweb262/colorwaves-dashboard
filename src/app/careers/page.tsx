"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Calendar, MapPin, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface Career {
  id: string;
  title: string;
  slug: string;
  departmentId: string;
  departmentName: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  applicationDeadline: string;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<Career[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCareers: Career[] = [
      {
        id: "1",
        title: "Paint Production Engineer",
        slug: "paint-production-engineer",
        departmentId: "1",
        departmentName: "Production",
        description: "Lead paint formulation, quality control, and production optimization. Ensure consistent product quality and develop new formulations.",
        requirements: [
          "Bachelor's degree in Chemical Engineering or related field",
          "3+ years experience in paint/coating industry",
          "Knowledge of paint formulation and testing methods",
          "Strong analytical and problem-solving skills"
        ],
        responsibilities: [
          "Develop and optimize paint formulations",
          "Conduct quality control tests and analysis",
          "Troubleshoot production issues",
          "Collaborate with R&D team on new products"
        ],
        salaryRange: "₦300,000 - ₦500,000",
        location: "Abuja, FCT",
        employmentType: "Full-time",
        experienceLevel: "Mid",
        applicationDeadline: "2024-03-15T23:59:59Z",
        isActive: true,
        isPublished: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        title: "Marketing Executive",
        slug: "marketing-executive",
        departmentId: "2",
        departmentName: "Marketing",
        description: "Drive brand growth through strategic marketing initiatives, partnerships, and market expansion. Lead digital marketing campaigns and brand positioning.",
        requirements: [
          "Bachelor's degree in Marketing, Business, or related field",
          "2+ years experience in marketing or brand management",
          "Strong digital marketing skills",
          "Excellent communication and presentation skills"
        ],
        responsibilities: [
          "Develop and execute marketing strategies",
          "Manage digital marketing campaigns",
          "Build strategic partnerships",
          "Analyze market trends and competitor activities"
        ],
        salaryRange: "₦250,000 - ₦400,000",
        location: "Lagos, Nigeria",
        employmentType: "Full-time",
        experienceLevel: "Mid",
        applicationDeadline: "2024-03-20T23:59:59Z",
        isActive: true,
        isPublished: true,
        createdAt: "2024-01-16T09:15:00Z",
        updatedAt: "2024-01-16T09:15:00Z"
      },
      {
        id: "3",
        title: "Project Manager",
        slug: "project-manager",
        departmentId: "3",
        departmentName: "Project Management",
        description: "Oversee project execution from planning to delivery. Coordinate with clients, manage timelines, and ensure successful project completion.",
        requirements: [
          "Bachelor's degree in Project Management, Engineering, or related field",
          "5+ years project management experience",
          "PMP certification preferred",
          "Strong leadership and communication skills"
        ],
        responsibilities: [
          "Plan and execute projects from start to finish",
          "Coordinate with clients and stakeholders",
          "Manage project timelines and budgets",
          "Lead project teams and ensure quality delivery"
        ],
        salaryRange: "₦400,000 - ₦600,000",
        location: "Abuja, FCT",
        employmentType: "Full-time",
        experienceLevel: "Senior",
        applicationDeadline: "2024-03-25T23:59:59Z",
        isActive: true,
        isPublished: true,
        createdAt: "2024-01-17T11:20:00Z",
        updatedAt: "2024-01-17T11:20:00Z"
      },
      {
        id: "4",
        title: "Sales & Distribution Officer",
        slug: "sales-distribution-officer",
        departmentId: "4",
        departmentName: "Sales & Distribution",
        description: "Manage sales operations, build distribution networks, and maintain customer relationships. Drive revenue growth through effective sales strategies.",
        requirements: [
          "Bachelor's degree in Business, Sales, or related field",
          "3+ years sales experience",
          "Strong negotiation and relationship-building skills",
          "Knowledge of distribution networks"
        ],
        responsibilities: [
          "Develop and maintain customer relationships",
          "Build and manage distribution networks",
          "Achieve sales targets and KPIs",
          "Provide customer support and service"
        ],
        salaryRange: "₦200,000 - ₦350,000",
        location: "Port Harcourt, Rivers",
        employmentType: "Full-time",
        experienceLevel: "Mid",
        applicationDeadline: "2024-03-30T23:59:59Z",
        isActive: true,
        isPublished: false,
        createdAt: "2024-01-18T08:45:00Z",
        updatedAt: "2024-01-18T08:45:00Z"
      }
    ];
    
    setCareers(mockCareers);
    setFilteredCareers(mockCareers);
    setIsLoading(false);
  }, []);

  // Filter and sort careers
  useEffect(() => {
    let filtered = careers.filter(career => career != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(career => {
        const title = (career.title || '').toLowerCase();
        const departmentName = (career.departmentName || '').toLowerCase();
        const description = (career.description || '').toLowerCase();
        const location = (career.location || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return title.includes(searchLower) || 
               departmentName.includes(searchLower) ||
               description.includes(searchLower) ||
               location.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(career => {
          if (key === 'status') return career.isActive === (value === 'active');
          if (key === 'published') return career.isPublished === (value === 'published');
          if (key === 'department') return career.departmentId === value;
          if (key === 'employmentType') return career.employmentType === value;
          if (key === 'experienceLevel') return career.experienceLevel === value;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Career] || '';
      const bValue = b[sortBy as keyof Career] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCareers(filtered);
  }, [careers, searchTerm, filters, sortBy, sortOrder]);

  const getStatusColor = (isActive: boolean, isPublished: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-800';
    if (!isPublished) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-blue-100 text-blue-800';
      case 'Part-time': return 'bg-purple-100 text-purple-800';
      case 'Contract': return 'bg-orange-100 text-orange-800';
      case 'Internship': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'Entry': return 'bg-green-100 text-green-800';
      case 'Mid': return 'bg-blue-100 text-blue-800';
      case 'Senior': return 'bg-purple-100 text-purple-800';
      case 'Executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const handleViewCareer = (career: Career) => {
    setSelectedCareer(career);
    setIsViewModalOpen(true);
  };

  const handleEditCareer = (career: Career) => {
    setEditingCareer(career);
    setIsFormModalOpen(true);
  };

  const handleDeleteCareer = (career: Career) => {
    setSelectedCareer(career);
    setIsDeleteModalOpen(true);
  };

  const handleAddCareer = () => {
    setEditingCareer(null);
    setIsFormModalOpen(true);
  };

  const handleCareerSaved = (savedCareer: Career) => {
    if (!savedCareer) return;
    
    if (editingCareer) {
      setCareers(prev => prev.map(career => career.id === savedCareer.id ? savedCareer : career));
    } else {
      setCareers(prev => [...prev, savedCareer]);
    }
    setIsFormModalOpen(false);
    setEditingCareer(null);
  };

  const handleCareerDeleted = (careerId: string) => {
    if (!careerId) return;
    
    setCareers(prev => prev.filter(career => career.id !== careerId));
    setIsDeleteModalOpen(false);
    setSelectedCareer(null);
  };

  const handleUpdateStatus = (career: Career) => {
    setCareers(prev => prev.map(c => 
      c.id === career.id ? { ...c, isActive: !c.isActive } : c
    ));
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
  const totalPages = Math.ceil(filteredCareers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredCareers.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Career Opportunities</h1>
            <p className="text-gray-600">Manage job postings and career opportunities</p>
          </div>
          <Button
            onClick={() => setEditingCareer(null)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-600 text-primary-foreground"
          >
            Add Job Posting
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
                  placeholder="Search job postings..."
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-md">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Published</label>
                <select
                  value={filters.published || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, published: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  value={filters.employmentType || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, employmentType: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select
                  value={filters.experienceLevel || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Levels</option>
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
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

        {/* Careers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((career) => (
            <div key={career.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {career.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(career.isActive, career.isPublished)}`}>
                    {!career.isActive ? "Inactive" : !career.isPublished ? "Draft" : "Published"}
                  </span>
                </div>
                
                <Badge color="blue" size="sm" className="mb-3">
                  {career.departmentName}
                </Badge>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {career.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{career.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <DollarSign className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{career.salaryRange}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className={`${isDeadlinePassed(career.applicationDeadline) ? 'text-red-600' : 'text-gray-600'}`}>
                      Deadline: {formatDate(career.applicationDeadline)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Badge color="blue" size="sm" className={getEmploymentTypeColor(career.employmentType)}>
                    {career.employmentType}
                  </Badge>
                  <Badge color="green" size="sm" className={getExperienceLevelColor(career.experienceLevel)}>
                    {career.experienceLevel}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{career.requirements.length} requirements</span>
                  <span>/{career.slug}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewCareer(career)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCareer(career)}
                    className="text-palette-gold-600 hover:text-palette-gold-700"
                    title="Edit Job"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateStatus(career)}
                    className="text-palette-blue-600 hover:text-palette-blue-700"
                    title={career.isActive ? "Deactivate" : "Activate"}
                  >
                    {career.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCareer(career)}
                    className="text-destructive hover:text-destructive-600"
                    title="Delete Job"
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
        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f) 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first job posting"}
            </p>
            {!searchTerm && !Object.values(filters).some(f => f) && (
              <Button onClick={handleAddCareer} leftIcon={<Plus className="h-4 w-4" />}>
                Add Job Posting
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals will be implemented next */}
    </DashboardLayout>
  );
}
