"use client";

import React from "react";
import { Modal } from "@/amal-ui";
import { Badge } from "@/amal-ui";
import { X, Mail, Phone, Building, Calendar, FileText } from "lucide-react";

interface PartnershipRequest {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  partnershipType: string;
  message?: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface PartnershipRequestViewModalProps {
  request: PartnershipRequest;
  isOpen: boolean;
  onClose: () => void;
}

export function PartnershipRequestViewModal({ request, isOpen, onClose }: PartnershipRequestViewModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'replied': return 'bg-blue-100 text-blue-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Partnership Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status}
            </span>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {request.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.fullName}</p>
                  <p className="text-sm text-gray-500">Full Name</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.companyName}</p>
                  <p className="text-sm text-gray-500">Company</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.email}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.phoneNumber}</p>
                  <p className="text-sm text-gray-500">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Partnership Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Partnership Type</span>
                <div className="mt-1">
                  <Badge color="blue" size="sm">
                    {request.partnershipType}
                  </Badge>
                </div>
              </div>

              {request.message && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Message</span>
                  <div className="mt-1 p-3 bg-white rounded-md border">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{request.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reply Information */}
          {request.status === 'replied' && (request.replyTitle || request.replyMessage) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reply Information</h3>
              <div className="space-y-3">
                {request.replyTitle && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reply Title</span>
                    <p className="mt-1 text-sm text-gray-900">{request.replyTitle}</p>
                  </div>
                )}

                {request.replyMessage && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reply Message</span>
                    <div className="mt-1 p-3 bg-white rounded-md border">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{request.replyMessage}</p>
                    </div>
                  </div>
                )}

                {request.replyAttachments && request.replyAttachments.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Attachments</span>
                    <div className="mt-1 space-y-2">
                      {request.replyAttachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded-md border">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{attachment.split('/').pop()}</span>
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
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Received</p>
                  <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                </div>
              </div>

              {request.updatedAt !== request.createdAt && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-500">{formatDate(request.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
