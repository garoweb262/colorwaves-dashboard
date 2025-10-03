"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { X, Calendar, User, Tag, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/amal-ui";

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

interface ProjectViewModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectViewModal({ project, isOpen, onClose }: ProjectViewModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Project Header */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Created: {formatDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {project.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Timeline */}
          {(project.startDate || project.endDate) && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Project Timeline
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.startDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Start Date</p>
                      <p className="text-gray-900">{formatDate(project.startDate)}</p>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">End Date</p>
                      <p className="text-gray-900">{formatDate(project.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Images */}
          {project.imageUrls && project.imageUrls.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Project Images
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
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

          {/* Project Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Project Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Project ID</p>
                <p className="text-gray-900 font-mono">{project.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Slug</p>
                <p className="text-gray-900 font-mono">{project.slug}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Created</p>
                <p className="text-gray-900">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Last Updated</p>
                <p className="text-gray-900">{formatDate(project.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
