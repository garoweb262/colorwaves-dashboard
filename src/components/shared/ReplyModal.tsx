"use client";

import React, { useState, useEffect } from "react";
import { Button, useToast } from "@/amal-ui";
import { Modal } from "@/amal-ui";
import { X, Paperclip } from "lucide-react";
import { uploadAPI } from "@/lib/api";

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
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    replyTitle: "",
    replyMessage: ""
  });
  const [attachments, setAttachments] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        replyTitle: "",
        replyMessage: ""
      });
      setAttachments([]);
      setErrors({});
      setUploadedFiles([]);
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
      let finalAttachments = [...attachments];

      // Upload files if there are new files
      if (uploadedFiles.length > 0) {
        setIsUploadingFiles(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadFiles(uploadedFiles, "attachments");
          
          if (uploadResponse.success && uploadResponse.data) {
            const newFileUrls = uploadResponse.data.map(item => item.fileUrl);
            finalAttachments = [...finalAttachments, ...newFileUrls];
          } else {
            throw new Error("Failed to upload files");
          }
        } catch (uploadError) {
          console.error("Error uploading files:", uploadError);
          addToast({
            variant: "error",
            title: "File Upload Failed",
            description: "Failed to upload files. Please try again.",
            duration: 5000
          });
          return;
        } finally {
          setIsUploadingFiles(false);
        }
      }

      await onReply({
        replyTitle: formData.replyTitle,
        replyMessage: formData.replyMessage,
        replyAttachments: finalAttachments
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const maxFiles = 3;
    const currentCount = attachments.length;

    for (let i = 0; i < Math.min(files.length, maxFiles - currentCount); i++) {
      const file = files[i];
      newFiles.push(file);
      // Create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setAttachments(prev => [...prev, previewUrl]);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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
              disabled={isSubmitting || isLoading || isUploadingFiles}
              loading={isSubmitting || isLoading || isUploadingFiles}
              className="bg-primary hover:bg-primary-600 text-primary-foreground"
            >
              {isUploadingFiles ? "Uploading Files..." : isSubmitting || isLoading ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
