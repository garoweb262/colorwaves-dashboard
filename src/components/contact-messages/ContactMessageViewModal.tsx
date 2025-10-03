"use client";

import React from "react";
import { Modal } from "@/amal-ui";
import { X, Mail, Phone, Calendar, MessageSquare } from "lucide-react";

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContactMessageViewModalProps {
  contactMessage: ContactMessage;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactMessageViewModal({ contactMessage, isOpen, onClose }: ContactMessageViewModalProps) {
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
          <h2 className="text-xl font-semibold text-gray-900">Contact Message Details</h2>
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contactMessage.status)}`}>
              {contactMessage.status}
            </span>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {contactMessage.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{contactMessage.fullName}</p>
                  <p className="text-sm text-gray-500">Message Sender</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{contactMessage.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{contactMessage.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Message Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Subject</span>
                <p className="text-sm text-gray-900">{contactMessage.subject}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Message</span>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{contactMessage.message}</p>
              </div>
            </div>
          </div>

          {/* Reply Information */}
          {contactMessage.status === 'replied' && contactMessage.replyTitle && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reply Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Reply Title</span>
                  <p className="text-sm text-gray-900">{contactMessage.replyTitle}</p>
                </div>
                
                {contactMessage.replyMessage && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Reply Message</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{contactMessage.replyMessage}</p>
                  </div>
                )}
                
                {contactMessage.replyAttachments && contactMessage.replyAttachments.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Attachments</span>
                    <div className="mt-2 space-y-2">
                      {contactMessage.replyAttachments.map((attachment, index) => (
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
                  <p className="text-sm text-gray-900">{formatDate(contactMessage.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Updated</span>
                  <p className="text-sm text-gray-900">{formatDate(contactMessage.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
