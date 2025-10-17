"use client";

import React, { useState } from "react";
import { Button, useToast } from "@/amal-ui";
import { ArrowLeft, Send, Upload, X, Image as ImageIcon } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/FileUpload";
import { uploadAPI, newsletterAPI } from "@/lib/api";
import { FormField, GlassInput } from "@/components/ui/FormField";

interface NewsletterFormData {
  subject: string;
  messageContent: string;
  headerImageUrl: string;
  fileUrls: string[];
}

export default function SendNewsletterPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState<NewsletterFormData>({
    subject: "",
    messageContent: "",
    headerImageUrl: "",
    fileUrls: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof NewsletterFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
      // Send newsletter (both header image and file attachments are already uploaded via FileUpload components)
      const result = await newsletterAPI.sendNewsletter({
        subject: formData.subject,
        messageContent: formData.messageContent,
        headerImageUrl: formData.headerImageUrl,
        fileUrls: formData.fileUrls
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
    setFormData(prev => ({ ...prev, fileUrls: newFileUrls }));
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
              <h1 className="text-2xl font-bold text-white">Send Newsletter</h1>
              <p className="text-white/70">Create and send newsletter to all subscribers</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <FormField
              label="Subject"
              error={errors.subject}
              required
            >
              <GlassInput
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Enter newsletter subject"
                error={!!errors.subject}
              />
            </FormField>

            {/* Header Image */}
            <FormField
              label="Header Image (Optional)"
            >
              <FileUpload
                label="Upload Header Image"
                description="Upload a header image for your newsletter"
                accept="image/*"
                maxSize={5}
                folder="newsletters"
                currentFile={formData.headerImageUrl}
                onFileUpload={(fileUrl, fileName) => {
                  setFormData(prev => ({ ...prev, headerImageUrl: fileUrl }));
                }}
                onFileRemove={() => {
                  setFormData(prev => ({ ...prev, headerImageUrl: "" }));
                }}
                showPreview={true}
              />
            </FormField>

            {/* Message Content */}
            <FormField
              label="Message Content (Rich Text)"
              error={errors.messageContent}
              required
            >
              <RichTextEditor
                value={formData.messageContent}
                onChange={(value) => handleInputChange("messageContent", value)}
                placeholder="Enter your newsletter message content here..."
                className={errors.messageContent ? "border-red-400" : ""}
              />
            </FormField>

            {/* File Upload */}
            <FormField
              label="Attachments (Optional)"
            >
              <div className="space-y-4">
                {/* Add new file upload */}
                <FileUpload
                  label="Add Attachment"
                  description="Upload files to attach to the newsletter (PDFs, images, documents)"
                  accept="*/*"
                  maxSize={10}
                  folder="newsletters"
                  onFileUpload={(fileUrl, fileName) => {
                    setFormData(prev => ({
                      ...prev,
                      fileUrls: [...prev.fileUrls, fileUrl]
                    }));
                  }}
                />
                
                {/* Display uploaded files */}
                {formData.fileUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white/80 mb-2">Attached Files:</h4>
                    <div className="space-y-2">
                      {formData.fileUrls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between glass-panel p-3 rounded-md">
                          <div className="flex items-center space-x-2">
                            <Upload className="h-4 w-4 text-white/60" />
                            <span className="text-sm text-white/80 truncate max-w-md">
                              {url.split('/').pop() || `File ${index + 1}`}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormField>

            {/* Preview */}
            <FormField
              label="Preview"
            >
              <div className="glass-panel p-4 rounded-md">
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">
                    Subject: {formData.subject || "Newsletter Subject"}
                  </h3>
                  
                  {/* Header Image Preview */}
                  {formData.headerImageUrl && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-white/80 mb-2">Header Image:</p>
                      <img 
                        src={formData.headerImageUrl} 
                        alt="Header preview" 
                        className="max-w-full h-32 object-cover rounded-md border border-white/20"
                      />
                    </div>
                  )}
                  
                  {/* Content Preview */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-white/80 mb-2">Content:</p>
                    <div 
                      className="text-sm text-white/70 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: formData.messageContent || "Newsletter content will appear here..." 
                      }}
                    />
                  </div>
                  
                  {/* Attachments */}
                  {formData.fileUrls.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-white/80">Attachments:</p>
                      <ul className="text-sm text-white/70 list-disc list-inside">
                        {formData.fileUrls.map((url, index) => (
                          <li key={index}>{url.split('/').pop() || `File ${index + 1}`}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </FormField>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/newsletter')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Send Newsletter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
