"use client";

import React, { useState } from "react";
import { Button, useToast } from "@/amal-ui";
import { ArrowLeft, Send, Upload, X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import { uploadAPI, newsletterAPI } from "@/lib/api";

interface NewsletterFormData {
  subject: string;
  messageContent: string;
  fileUrls: string[];
}

export default function SendNewsletterPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<NewsletterFormData>({
    subject: "",
    messageContent: "",
    fileUrls: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const handleInputChange = (field: keyof NewsletterFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFilesSelect = (urls: string[], files?: File[]) => {
    if (files) {
      setUploadedFiles(files);
    }
    handleInputChange("fileUrls", urls);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.messageContent.trim()) {
      newErrors.messageContent = "Message content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalFileUrls = [...formData.fileUrls];

      // Upload files if there are new files
      if (uploadedFiles.length > 0) {
        setIsUploadingFiles(true);
        
        try {
          const uploadResponse = await uploadAPI.uploadImages(uploadedFiles, "newsletters");
          
          if (uploadResponse.success && uploadResponse.data) {
            const newFileUrls = uploadResponse.data.map(item => item.fileUrl);
            finalFileUrls = [...finalFileUrls, ...newFileUrls];
          } else {
            throw new Error("Failed to upload files");
          }
        } catch (uploadError) {
          console.error("Error uploading files:", uploadError);
          addToast({
            variant: "error",
            title: "Files Upload Failed",
            description: "Failed to upload files. Please try again.",
            duration: 5000
          });
          return;
        } finally {
          setIsUploadingFiles(false);
        }
      }

      // Send newsletter
      const result = await newsletterAPI.sendNewsletter({
        subject: formData.subject,
        messageContent: formData.messageContent,
        fileUrls: finalFileUrls
      });

      if (result.success) {
        addToast({
          variant: "success",
          title: "Newsletter Sent",
          description: result.data.message || "Newsletter has been sent successfully.",
          duration: 5000
        });
        router.push('/newsletter');
      } else {
        throw new Error('Failed to send newsletter');
      }
    } catch (error) {
      console.error("Error sending newsletter:", error);
      addToast({
        variant: "error",
        title: "Send Failed",
        description: error instanceof Error ? error.message : "Failed to send newsletter. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number) => {
    const newFileUrls = formData.fileUrls.filter((_, i) => i !== index);
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, fileUrls: newFileUrls }));
    setUploadedFiles(newFiles);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/newsletter')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Newsletter
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Newsletter</h1>
              <p className="text-gray-600">Create and send newsletter to all subscribers</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                  errors.subject ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter newsletter subject"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea
                value={formData.messageContent}
                onChange={(e) => handleInputChange("messageContent", e.target.value)}
                rows={12}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-palette-violet ${
                  errors.messageContent ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your newsletter message content here..."
              />
              {errors.messageContent && (
                <p className="mt-1 text-sm text-red-600">{errors.messageContent}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <ImageUpload
                label="Upload Newsletter Attachments"
                description="Upload files to attach to the newsletter (PDFs, images, documents)"
                currentImages={formData.fileUrls}
                onImageSelect={() => {}}
                onImagesSelect={(urls, files) => handleFilesSelect(urls, files)}
                onImageRemove={() => {}}
                maxSize={10}
                multiple={true}
                maxImages={10}
              />
              
              {/* Display uploaded files */}
              {formData.fileUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h4>
                  <div className="space-y-2">
                    {formData.fileUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Upload className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700 truncate max-w-md">
                            {url.split('/').pop() || `File ${index + 1}`}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    Subject: {formData.subject || "Newsletter Subject"}
                  </h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">
                    {formData.messageContent || "Newsletter content will appear here..."}
                  </div>
                  {formData.fileUrls.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Attachments:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {formData.fileUrls.map((url, index) => (
                          <li key={index}>{url.split('/').pop() || `File ${index + 1}`}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/newsletter')}
                disabled={isSubmitting || isUploadingFiles}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting || isUploadingFiles}
                disabled={isSubmitting || isUploadingFiles}
                leftIcon={<Send className="h-4 w-4" />}
              >
                {isUploadingFiles ? "Uploading Files..." : "Send Newsletter"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
