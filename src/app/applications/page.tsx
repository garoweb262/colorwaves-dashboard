"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Edit, Trash2, Eye, Search, Filter, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, FileText, Calendar, User } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";

interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  careerId: string;
  careerTitle: string;
  careerSlug: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected';
  notes?: string;
  interviewDate?: string;
  interviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: "1",
        fullName: "John Adebayo",
        email: "john.adebayo@email.com",
        phoneNumber: "+234 802 123 4567",
        careerId: "1",
        careerTitle: "Paint Production Engineer",
        careerSlug: "paint-production-engineer",
        resumeUrl: "/resumes/john-adebayo-resume.pdf",
        coverLetter: "I am excited to apply for the Paint Production Engineer position. With my background in chemical engineering and 4 years of experience in the paint industry, I believe I can contribute significantly to your team.",
        status: "pending",
        createdAt: "2024-01-20T10:30:00Z",
        updatedAt: "2024-01-20T10:30:00Z"
      },
      {
        id: "2",
        fullName: "Sarah Okafor",
        email: "sarah.okafor@email.com",
        phoneNumber: "+234 803 456 7890",
        careerId: "2",
        careerTitle: "Marketing Executive",
        careerSlug: "marketing-executive",
        resumeUrl: "/resumes/sarah-okafor-resume.pdf",
        coverLetter: "I am passionate about marketing and have successfully led several digital marketing campaigns. I would love to bring my expertise to Colorwaves and help grow the brand.",
        status: "reviewed",
        notes: "Strong digital marketing background, good communication skills",
        createdAt: "2024-01-19T14:22:00Z",
        updatedAt: "2024-01-21T09:15:00Z"
      },
      {
        id: "3",
        fullName: "Michael Chen",
        email: "michael.chen@email.com",
        phoneNumber: "+234 804 789 0123",
        careerId: "3",
        careerTitle: "Project Manager",
        careerSlug: "project-manager",
        resumeUrl: "/resumes/michael-chen-resume.pdf",
        coverLetter: "With 6 years of project management experience and PMP certification, I am confident I can successfully lead projects at Colorwaves.",
        status: "shortlisted",
        notes: "Excellent project management skills, PMP certified",
        interviewDate: "2024-02-15T10:00:00Z",
        createdAt: "2024-01-18T16:45:00Z",
        updatedAt: "2024-01-22T11:30:00Z"
      },
      {
        id: "4",
        fullName: "Fatima Ibrahim",
        email: "fatima.ibrahim@email.com",
        phoneNumber: "+234 805 234 5678",
        careerId: "4",
        careerTitle: "Sales & Distribution Officer",
        careerSlug: "sales-distribution-officer",
        resumeUrl: "/resumes/fatima-ibrahim-resume.pdf",
        coverLetter: "I have extensive experience in sales and distribution networks. I am excited about the opportunity to contribute to Colorwaves' growth.",
        status: "interviewed",
        notes: "Strong sales background, good network connections",
        interviewDate: "2024-02-10T14:00:00Z",
        interviewNotes: "Interview went well, candidate showed good knowledge of distribution networks",
        createdAt: "2024-01-17T08:45:00Z",
        updatedAt: "2024-01-23T16:20:00Z"
      },
      {
        id: "5",
        fullName: "David Johnson",
        email: "david.johnson@email.com",
        phoneNumber: "+234 806 345 6789",
        careerId: "1",
        careerTitle: "Paint Production Engineer",
        careerSlug: "paint-production-engineer",
        resumeUrl: "/resumes/david-johnson-resume.pdf",
        coverLetter: "I am a chemical engineer with 5 years of experience in paint formulation. I am excited about the opportunity to work with Colorwaves.",
        status: "accepted",
        notes: "Excellent technical skills, good cultural fit",
        interviewDate: "2024-02-05T09:00:00Z",
        interviewNotes: "Outstanding candidate, accepted offer",
        createdAt: "2024-01-16T12:30:00Z",
        updatedAt: "2024-01-24T10:45:00Z"
      },
      {
        id: "6",
        fullName: "Grace Nwankwo",
        email: "grace.nwankwo@email.com",
        phoneNumber: "+234 807 456 7890",
        careerId: "2",
        careerTitle: "Marketing Executive",
        careerSlug: "marketing-executive",
        resumeUrl: "/resumes/grace-nwankwo-resume.pdf",
        coverLetter: "I am a marketing professional with experience in brand management and digital marketing.",
        status: "rejected",
        notes: "Not enough experience in B2B marketing",
        interviewDate: "2024-02-08T11:00:00Z",
        interviewNotes: "Candidate lacks B2B marketing experience required for the role",
        createdAt: "2024-01-15T15:20:00Z",
        updatedAt: "2024-01-25T14:10:00Z"
      }
    ];
    
    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
    setIsLoading(false);
  }, []);

  // Filter and sort applications
  useEffect(() => {
    let filtered = applications.filter(application => application != null);

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(application => {
        const fullName = (application.fullName || '').toLowerCase();
        const email = (application.email || '').toLowerCase();
        const careerTitle = (application.careerTitle || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) ||
               careerTitle.includes(searchLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(application => {
          if (key === 'status') return application.status === value;
          if (key === 'career') return application.careerId === value;
          return true;
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      const aValue = a[sortBy as keyof Application] || '';
      const bValue = b[sortBy as keyof Application] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, filters, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-indigo-100 text-indigo-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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
  const totalPages = Math.ceil(filteredApplications.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredApplications.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-gray-600">Manage and review job applications</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
                <select
                  value={filters.career || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, career: e.target.value === 'all' ? null : e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet"
                >
                  <option value="all">All Positions</option>
                  <option value="1">Paint Production Engineer</option>
                  <option value="2">Marketing Executive</option>
                  <option value="3">Project Manager</option>
                  <option value="4">Sales & Distribution Officer</option>
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

        {/* Applications Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Applicant</span>
                      {getSortIcon('fullName')}
                    </div>
                  </TableHead>
                  <TableHead>Position Applied</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </TableHead>
                  <TableHead>Interview</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Applied</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{application.fullName}</p>
                          <p className="text-xs text-gray-500">{application.phoneNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{application.careerTitle}</p>
                        <Link 
                          href={`/applications/${application.careerSlug}`}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="text-gray-600">{application.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <a 
                          href={application.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          View Resume
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {application.interviewDate ? (
                        <div className="text-xs">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{formatDateTime(application.interviewDate)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(application.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-palette-gold-600 hover:text-palette-gold-700"
                          title="Edit Application"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive-600"
                          title="Delete Application"
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
            totalItems={filteredApplications.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals will be implemented next */}
    </DashboardLayout>
  );
}
