"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast } from "@/amal-ui";
import { X } from "lucide-react";
import { Modal } from "@/amal-ui";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'replied' | 'declined';
  replyTitle?: string;
  replyMessage?: string;
  replyAttachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContactMessageReplyModalProps {
  message?: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (messageId: string, replyData: { reply: string; status: string }) => void;
}

export function ContactMessageReplyModal({ message, isOpen, onClose, onReply }: ContactMessageReplyModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    replyMessage: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      setFormData({
        replyMessage: message.replyMessage || ""
      });
    } else {
      setFormData({
        replyMessage: ""
      });
    }
    setErrors({});
  }, [message, isOpen]);

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
    
    if (!validateForm() || !message) return;

    setIsSubmitting(true);

    try {
      onReply(message.id, {
        reply: formData.replyMessage,
        status: 'replied'
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
            Reply to Contact Message
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

        {message && (
          <div className="space-y-6">
            {/* Original Message */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Original Message</h3>
              <div className="space-y-2 text-sm">
                <p><strong>From:</strong> {message.name} ({message.email})</p>
                <p><strong>Subject:</strong> {message.subject}</p>
                <p><strong>Message:</strong></p>
                <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <p className="whitespace-pre-wrap">{message.message}</p>
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
