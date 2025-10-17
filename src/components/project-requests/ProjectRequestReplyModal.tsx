"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast, Textarea } from "@/amal-ui";
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Reply to Project Request">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        

        {request && (
          <div className="space-y-6">
            {/* Original Request */}
            <div className="glass-form-section p-4">
              <h3 className="font-medium text-white mb-3">Project Request Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/80"><strong className="text-white">Client:</strong> {request.clientName} ({request.email})</p>
                {request.companyName && <p className="text-white/80"><strong className="text-white">Company:</strong> {request.companyName}</p>}
                <p className="text-white/80"><strong className="text-white">Project:</strong> {request.projectTitle}</p>
                <p className="text-white/80"><strong className="text-white">Budget:</strong> {request.budget}</p>
                <p className="text-white/80"><strong className="text-white">Timeline:</strong> {request.timeline}</p>
                <p className="text-white/80"><strong className="text-white">Description:</strong></p>
                <div className="glass-card p-3 rounded border-l-4 border-purple-500/50">
                  <p className="whitespace-pre-wrap text-white/90">{request.projectDescription}</p>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                label="Reply Message"
                placeholder="Type your reply here..."
                value={formData.replyMessage}
                onChange={(e) => handleInputChange("replyMessage", e.target.value)}
                error={errors.replyMessage}
                required
                rows={6}
                fullWidth
              />

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
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
