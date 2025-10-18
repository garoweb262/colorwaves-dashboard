"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, useToast } from "@/amal-ui";
import { ArrowLeft, Calendar, Users, ExternalLink, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SocialShare } from "@/components/SocialShare";
import { projectsAPI } from "@/lib/api";

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
    videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const slug = params.slug as string;
        const response = await projectsAPI.getProjectBySlug(slug);
        
        if (response.success) {
          setProject(response.data);
        } else {
          addToast({
            variant: "error",
            title: "Error",
            description: "Failed to fetch project details",
            duration: 5000
          });
          router.push("/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Project not found",
          duration: 5000
        });
        router.push("/projects");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchProject();
    }
  }, [params.slug, addToast, router]);

  const handleEdit = () => {
    router.push(`/projects?edit=${project?.id}`);
  };

  const handleDelete = async () => {
    if (!project) return;
    
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectsAPI.deleteProject(project.id);
        addToast({
          variant: "success",
          title: "Success",
          description: "Project deleted successfully",
          duration: 3000
        });
        router.push("/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
        addToast({
          variant: "error",
          title: "Error",
          description: "Failed to delete project",
          duration: 5000
        });
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!project) return;
    
    try {
      const newStatus = project.isActive ? "inactive" : "active";
      const response = await projectsAPI.updateStatus(project.id, newStatus);
      
      if (response.success) {
        setProject(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
        addToast({
          variant: "success",
          title: "Success",
          description: "Project status updated successfully",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        variant: "error",
        title: "Error",
        description: "Failed to update project status",
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="glass-card p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/60 mx-auto"></div>
            <p className="text-white/80 mt-4 text-center">Loading project details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="glass-card p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">Project not found</h2>
            <p className="text-white/80 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/projects")}>
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
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/projects")}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Back to Projects
            </Button>
            <div className="flex items-center space-x-2">
              <SocialShare
                url={`${window.location.origin}/projects/${project.slug}`}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrls?.[0]}
                hashtags={project.technologies}
              />
              <Button
                variant="outline"
                onClick={handleToggleStatus}
                leftIcon={project.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {project.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="outline"
                onClick={handleEdit}
                leftIcon={<Edit className="h-4 w-4" />}
                className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
              >
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                leftIcon={<Trash2 className="h-4 w-4" />}
                className="border-red-400/50 text-red-300 hover:bg-red-400/10 hover:text-red-200"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-card overflow-hidden">
          {/* Project Images */}
          {project.imageUrls && project.imageUrls.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-100">
                <img
                  src={project.imageUrls[currentImageIndex]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              
              {project.imageUrls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {project.imageUrls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all backdrop-blur-sm ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Embed */}
          {project.videoUrl && (
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${(project.videoUrl.split('v=')[1] || '').split('&')[0]}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {/* Project Details */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Client: {project.client}</span>
                  </div>
                  {project.startDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(project.startDate)}</span>
                      {project.endDate && <span> - {formatDate(project.endDate)}</span>}
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                project.isActive ? 'bg-green-400/20 text-green-300 border border-green-400/30' : 'bg-gray-400/20 text-gray-300 border border-gray-400/30'
              }`}>
                {project.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-400/20 text-blue-300 border border-blue-400/30 rounded-full text-sm font-medium backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {project.imageUrls && project.imageUrls.length > 1 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.imageUrls.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all backdrop-blur-sm ${
                        index === currentImageIndex ? 'border-blue-400 bg-blue-400/20 scale-105' : 'border-white/20 hover:border-white/40 bg-white/5'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 1}`}
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
                  <span className="font-medium text-white/90">Created:</span> {formatDate(project.createdAt)}
                </div>
                <div>
                  <span className="font-medium text-white/90">Last Updated:</span> {formatDate(project.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
