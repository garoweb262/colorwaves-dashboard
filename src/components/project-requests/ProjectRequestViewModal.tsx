"use client";

import React from "react";
import { Modal } from "@/amal-ui";
import { X, Mail, Phone, MapPin, DollarSign, Calendar, MessageSquare, Image as ImageIcon } from "lucide-react";

interface ProjectRequest {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  projectType: string;
  budgetRange: string;
  location: string;
  description: string;
  images: string[];
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectRequestViewModalProps {
  projectRequest: ProjectRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectRequestViewModal({ projectRequest, isOpen, onClose }: ProjectRequestViewModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'replied':
        return 'bg-blue-100 text-blue-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Project Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(projectRequest.status)}`}>
              {projectRequest.status}
            </span>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {projectRequest.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{projectRequest.fullName}</p>
                  <p className="text-sm text-gray-500">Project Requester</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{projectRequest.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{projectRequest.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Project Type</span>
                <p className="text-sm text-gray-900 capitalize">{projectRequest.projectType}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-500">Budget Range</span>
                  <p className="text-sm text-gray-900">{projectRequest.budgetRange}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-sm text-gray-900">{projectRequest.location}</p>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Description</span>
                <p className="text-sm text-gray-900 mt-1">{projectRequest.description}</p>
              </div>
            </div>
          </div>

          {/* Project Images */}
          {projectRequest.images && projectRequest.images.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {projectRequest.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm opacity-0 group-hover:opacity-100">
                        Image {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply Information */}
          {projectRequest.status === 'replied' && projectRequest.replyTitle && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reply Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Reply Title</span>
                  <p className="text-sm text-gray-900">{projectRequest.replyTitle}</p>
                </div>
                
                {projectRequest.replyMessage && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Reply Message</span>
                    <p className="text-sm text-gray-900 mt-1">{projectRequest.replyMessage}</p>
                  </div>
                )}
                
                {projectRequest.replyAttachments && projectRequest.replyAttachments.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Attachments</span>
                    <div className="mt-2 space-y-2">
                      {projectRequest.replyAttachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                          <MessageSquare className="h-4 w-4" />
                          <span>Attachment {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-500">Created</span>
                  <p className="text-sm text-gray-900">{formatDate(projectRequest.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Updated</span>
                  <p className="text-sm text-gray-900">{formatDate(projectRequest.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
