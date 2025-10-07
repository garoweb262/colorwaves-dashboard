"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";

interface ProjectRequest {
  id: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  projectTitle: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  images?: string[];
  services?: string[];
  website?: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectRequestReplyModalProps {
  request?: ProjectRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (requestId: string, replyData: { reply: string; status: string }) => void;
}

export function ProjectRequestReplyModal({ request, isOpen, onClose, onReply }: ProjectRequestReplyModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    replyMessage: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setFormData({
        replyMessage: request.replyMessage || ""
      });
    } else {
      setFormData({
        replyMessage: ""
      });
    }
    setErrors({});
  }, [request, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.replyMessage.trim()) {
      newErrors.replyMessage = "Reply message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !request) return;

    setIsSubmitting(true);

    try {
      onReply(request.id, {
        reply: formData.replyMessage,
        status: 'under_review'
      });
      
      // Show success toast
      addToast({
        variant: "success",
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
        duration: 4000
      });
      
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: "Reply Failed",
        description: "Failed to send reply. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Reply to Project Request
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {request && (
          <div className="space-y-6">
            {/* Original Request */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Project Request Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Client:</strong> {request.clientName} ({request.email})</p>
                {request.companyName && <p><strong>Company:</strong> {request.companyName}</p>}
                <p><strong>Project:</strong> {request.projectTitle}</p>
                <p><strong>Budget:</strong> {request.budget}</p>
                <p><strong>Timeline:</strong> {request.timeline}</p>
                <p><strong>Description:</strong></p>
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <p className="whitespace-pre-wrap">{request.projectDescription}</p>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Message *
                </label>
                <textarea
                  value={formData.replyMessage}
                  onChange={(e) => handleInputChange("replyMessage", e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                    errors.replyMessage ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Type your reply here..."
                />
                {errors.replyMessage && (
                  <p className="mt-1 text-sm text-red-600">{errors.replyMessage}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Send Reply
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
}
