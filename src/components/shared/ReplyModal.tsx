"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { X, Paperclip } from "lucide-react";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReply: (replyData: {
    replyTitle: string;
    replyMessage: string;
    replyAttachments: string[];
  }) => void;
  title?: string;
  isLoading?: boolean;
}

export function ReplyModal({ 
  isOpen, 
  onClose, 
  onReply, 
  title = "Reply",
  isLoading = false 
}: ReplyModalProps) {
  const [formData, setFormData] = useState({
    replyTitle: "",
    replyMessage: ""
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        replyTitle: "",
        replyMessage: ""
      });
      setAttachments([]);
      setErrors({});
    }
  }, [isOpen]);

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
      await onReply({
        replyTitle: formData.replyTitle,
        replyMessage: formData.replyMessage,
        replyAttachments: attachments
      });
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: string[] = [];
    const maxFiles = 3;
    const currentCount = attachments.length;

    for (let i = 0; i < Math.min(files.length, maxFiles - currentCount); i++) {
      const file = files[i];
      // In a real app, you would upload the file and get a URL
      // For now, we'll create a mock URL
      const mockUrl = URL.createObjectURL(file);
      newAttachments.push(mockUrl);
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.replyMessage && (
              <p className="mt-1 text-sm text-red-600">{errors.replyMessage}</p>
            )}
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Max 3 files)
            </label>
            
            {/* File Upload */}
            {attachments.length < 3 && (
              <div className="mb-4">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="attachments"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Files
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF
                </p>
              </div>
            )}

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        File {index + 1}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
              disabled={isSubmitting || isLoading}
              loading={isSubmitting || isLoading}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              {isSubmitting || isLoading ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
