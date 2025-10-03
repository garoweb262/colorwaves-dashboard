"use client";

import React, { useState } from "react";
import { Modal, Button } from "@/amal-ui";
import { X, Paperclip } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

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

interface PartnershipRequestReplyModalProps {
  request: PartnershipRequest;
  isOpen: boolean;
  onClose: () => void;
  onReply: (requestId: string, replyData: any) => void;
}

export function PartnershipRequestReplyModal({ request, isOpen, onClose, onReply }: PartnershipRequestReplyModalProps) {
  const [formData, setFormData] = useState({
    replyTitle: "",
    replyMessage: ""
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (files: string[]) => {
    if (files.length + attachments.length > 3) {
      setErrors(prev => ({ ...prev, attachments: "Maximum 3 files allowed" }));
      return;
    }
    setAttachments(prev => [...prev, ...files]);
    if (errors.attachments) {
      setErrors(prev => ({ ...prev, attachments: "" }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.replyTitle.trim()) {
      newErrors.replyTitle = "Reply title is required";
    }

    if (!formData.replyMessage.trim()) {
      newErrors.replyMessage = "Reply message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const replyData = {
        replyTitle: formData.replyTitle,
        replyMessage: formData.replyMessage,
        replyAttachments: attachments
      };

      onReply(request.id, replyData);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ replyTitle: "", replyMessage: "" });
    setAttachments([]);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Reply to Partnership Request</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Request Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Replying to:</h3>
          <p className="text-sm text-gray-900">{request.fullName} - {request.companyName}</p>
          <p className="text-sm text-gray-500">{request.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reply Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply Title *
            </label>
            <input
              type="text"
              value={formData.replyTitle}
              onChange={(e) => handleInputChange("replyTitle", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
              placeholder="Enter reply title"
            />
            {errors.replyTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.replyTitle}</p>
            )}
          </div>

          {/* Reply Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply Message *
            </label>
            <textarea
              value={formData.replyMessage}
              onChange={(e) => handleInputChange("replyMessage", e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet focus:border-transparent"
              placeholder="Enter your reply message"
            />
            {errors.replyMessage && (
              <p className="mt-1 text-sm text-red-600">{errors.replyMessage}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Max 3 files)
            </label>
            <FileUpload
              onFileUpload={(fileUrl, fileName) => handleFileUpload([fileUrl])}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              maxSize={10}
              className="mb-4"
            />
            
            {/* Display uploaded files */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{file.split('/').pop()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {errors.attachments && (
              <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              {isSubmitting ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
