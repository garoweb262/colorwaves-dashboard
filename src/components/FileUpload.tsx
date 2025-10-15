"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/amal-ui";
import { cn } from "@/amal-ui";
import { uploadAPI, FileUploadResponse } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onFileUpload?: (fileUrl: string, fileName: string) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  currentFile?: string | null;
  label?: string;
  description?: string;
  folder?: string;
  showPreview?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileUpload,
  onFileRemove,
  accept = "image/*",
  maxSize = 5,
  className,
  disabled = false,
  currentFile,
  label = "Upload File",
  description = "Click to upload or drag and drop",
  folder = "general",
  showPreview = true
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<FileUploadResponse> => {
      return await uploadAPI.uploadFile(file, folder);
    },
    onSuccess: (response) => {
      const { fileUrl, originalName } = response.data;
      setUploadedFile({ url: fileUrl, name: originalName });
      onFileUpload?.(fileUrl, originalName);
      setUploadError(null);
    },
    onError: (error: any) => {
      setUploadError(error?.response?.data?.message || "Upload failed. Please try again.");
    },
  });

  const handleFileSelect = (file: File) => {
    setUploadError(null);
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace(/\*/g, ".*"))) {
      setUploadError("Invalid file type");
      return;
    }

    // Call onFileSelect if provided (for backward compatibility)
    onFileSelect?.(file);

    // Upload file to server
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
    setUploadedFile(null);
    onFileRemove?.();
  };

  const getFileIcon = (file: File | string) => {
    const fileType = typeof file === "string" ? file.split('.').pop()?.toLowerCase() : file.type;
    
    if (fileType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType || '')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200",
          isDragOver && !disabled
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          (currentFile || uploadedFile) && "border-green-300 bg-green-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {(currentFile || uploadedFile) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              {getFileIcon(currentFile || uploadedFile?.name || '')}
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">File uploaded successfully</span>
            </div>
            <p className="text-sm text-gray-600 mb-4 break-all">
              {currentFile || uploadedFile?.name}
            </p>
            
            {/* Show image preview if it's an image and showPreview is true */}
            {showPreview && uploadedFile?.url && (
              <div className="mb-4">
                <img
                  src={uploadedFile.url}
                  alt="Uploaded file preview"
                  className="max-w-full max-h-32 mx-auto rounded-lg object-cover"
                />
              </div>
            )}
            
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploadMutation.isPending}
              >
                Change File
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                disabled={disabled || uploadMutation.isPending}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              {uploadMutation.isPending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="h-8 w-8 text-blue-500" />
                </motion.div>
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {uploadMutation.isPending ? "Uploading..." : label}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {description}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Max file size: {maxSize}MB
            </p>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploadMutation.isPending}
              loading={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Choose File"}
            </Button>
          </motion.div>
        )}

        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700">{uploadError}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
