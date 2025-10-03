"use client";

import React, { useState, useEffect } from "react";
import { Button, Badge } from "@/amal-ui";
import { Calendar, MapPin, DollarSign, User, Mail, Phone, FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
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

interface Career {
  id: string;
  title: string;
  slug: string;
  departmentName: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  applicationDeadline: string;
}

export default function ApplicationDetailsPage({ params }: { params: { slug: string } }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [career, setCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app, fetch by slug
  useEffect(() => {
    const mockApplication: Application = {
      id: "1",
      fullName: "John Adebayo",
      email: "john.adebayo@email.com",
      phoneNumber: "+234 802 123 4567",
      careerId: "1",
      careerTitle: "Paint Production Engineer",
      careerSlug: "paint-production-engineer",
      resumeUrl: "/resumes/john-adebayo-resume.pdf",
      coverLetter: "I am excited to apply for the Paint Production Engineer position at Colorwaves. With my background in chemical engineering and 4 years of experience in the paint industry, I believe I can contribute significantly to your team.\n\nMy experience includes:\n- Developing new paint formulations\n- Quality control and testing\n- Production optimization\n- Team leadership\n\nI am particularly drawn to Colorwaves' commitment to innovation and sustainability in the paint industry. I would love the opportunity to discuss how my skills and experience can contribute to your continued success.\n\nThank you for considering my application.",
      status: "shortlisted",
      notes: "Strong technical background, good communication skills, PMP certified. Recommended for interview.",
      interviewDate: "2024-02-20T10:00:00Z",
      interviewNotes: "Interview scheduled for February 20th at 10:00 AM. Focus on technical questions and cultural fit.",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-22T14:15:00Z"
    };

    const mockCareer: Career = {
      id: "1",
      title: "Paint Production Engineer",
      slug: "paint-production-engineer",
      departmentName: "Production",
      description: "Lead paint formulation, quality control, and production optimization. Ensure consistent product quality and develop new formulations.",
      requirements: [
        "Bachelor's degree in Chemical Engineering or related field",
        "3+ years experience in paint/coating industry",
        "Knowledge of paint formulation and testing methods",
        "Strong analytical and problem-solving skills",
        "Experience with quality control systems",
        "Good communication and teamwork skills"
      ],
      responsibilities: [
        "Develop and optimize paint formulations",
        "Conduct quality control tests and analysis",
        "Troubleshoot production issues",
        "Collaborate with R&D team on new products",
        "Maintain production documentation",
        "Train production staff on quality standards"
      ],
      salaryRange: "₦300,000 - ₦500,000",
      location: "Abuja, FCT",
      employmentType: "Full-time",
      experienceLevel: "Mid",
      applicationDeadline: "2024-03-15T23:59:59Z"
    };

    setApplication(mockApplication);
    setCareer(mockCareer);
    setIsLoading(false);
  }, [params.slug]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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

  if (!application || !career) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The application you're looking for doesn't exist.</p>
          <Link href="/applications">
            <Button>Back to Applications</Button>
          </Link>
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
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <Link href="/applications" className="hover:text-gray-700">Applications</Link>
              <span>/</span>
              <span className="text-gray-900">{application.fullName}</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">{application.fullName}</h1>
            <p className="text-gray-600">Application for {career.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Edit" : "Edit Application"}
            </Button>
            <Link href="/applications">
              <Button variant="outline">Back to Applications</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Application Status</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(application.status)}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {application.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{application.notes}</p>
                </div>
              )}

              {application.interviewDate && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Interview Details</h3>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {formatDateTime(application.interviewDate)}
                      </span>
                    </div>
                    {application.interviewNotes && (
                      <p className="text-sm text-blue-800">{application.interviewNotes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{career.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Salary Range</p>
                    <p className="text-sm text-gray-600">{career.salaryRange}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Employment Type</p>
                    <p className="text-sm text-gray-600">{career.employmentType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experience Level</p>
                    <p className="text-sm text-gray-600">{career.experienceLevel}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Job Description</h3>
                <p className="text-sm text-gray-600">{career.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Requirements</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {career.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Responsibilities</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {career.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Applicant Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="text-sm text-gray-600">{application.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">{application.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-600">{application.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume</h2>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <FileText className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Resume Document</p>
                  <p className="text-xs text-gray-500">PDF Document</p>
                </div>
                <a 
                  href={application.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">View</span>
                </a>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDateTime(application.createdAt)}</p>
                  </div>
                </div>
                
                {application.status !== 'pending' && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status Updated</p>
                      <p className="text-xs text-gray-500">{formatDateTime(application.updatedAt)}</p>
                    </div>
                  </div>
                )}
                
                {application.interviewDate && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Interview Scheduled</p>
                      <p className="text-xs text-gray-500">{formatDateTime(application.interviewDate)}</p>
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
