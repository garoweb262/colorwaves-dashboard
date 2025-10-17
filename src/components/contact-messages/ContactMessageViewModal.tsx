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
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
      case 'accepted':
        return 'bg-green-500/20 text-green-300 border border-green-400/30';
      case 'replied':
        return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
      case 'declined':
        return 'bg-red-500/20 text-red-300 border border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-400/30';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Contact Message Details">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contactMessage.status)}`}>
              {contactMessage.status}
            </span>
          </div>

          {/* Contact Information */}
          <div className="glass-form-section p-4">
            <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-300 text-sm font-medium">
                    {contactMessage.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{contactMessage.fullName}</p>
                  <p className="text-sm text-white/70">Message Sender</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80">{contactMessage.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-white/60" />
                <span className="text-sm text-white/80">{contactMessage.phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="glass-form-section p-4">
            <h3 className="text-lg font-medium text-white mb-4">Message Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-white/80">Subject</span>
                <p className="text-sm text-white">{contactMessage.subject}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-white/80">Message</span>
                <p className="text-sm text-white mt-1 whitespace-pre-wrap">{contactMessage.message}</p>
              </div>
            </div>
          </div>

          {/* Reply Information */}
          {contactMessage.status === 'replied' && contactMessage.replyTitle && (
            <div className="glass-form-section p-4">
              <h3 className="text-lg font-medium text-white mb-4">Reply Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-white/80">Reply Title</span>
                  <p className="text-sm text-white">{contactMessage.replyTitle}</p>
                </div>
                
                {contactMessage.replyMessage && (
                  <div>
                    <span className="text-sm font-medium text-white/80">Reply Message</span>
                    <p className="text-sm text-white mt-1 whitespace-pre-wrap">{contactMessage.replyMessage}</p>
                  </div>
                )}
                
                {contactMessage.replyAttachments && contactMessage.replyAttachments.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-white/80">Attachments</span>
                    <div className="mt-2 space-y-2">
                      {contactMessage.replyAttachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-300">
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
          <div className="glass-form-section p-4">
            <h3 className="text-lg font-medium text-white mb-4">Timestamps</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-white/60" />
                <div>
                  <span className="text-sm font-medium text-white/80">Created</span>
                  <p className="text-sm text-white">{formatDate(contactMessage.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-white/60" />
                <div>
                  <span className="text-sm font-medium text-white/80">Last Updated</span>
                  <p className="text-sm text-white">{formatDate(contactMessage.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
