"use client";

import { useState } from "react";
import { uploadAPI, FileUploadResponse, ImageUploadResponse, MultipleFileUploadResponse } from "@/lib/api";

interface UseFileUploadOptions {
  onSuccess?: (response: FileUploadResponse | ImageUploadResponse | MultipleFileUploadResponse) => void;
  onError?: (error: string) => void;
}

interface UseFileUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  
  // Upload functions
  uploadFile: (file: File, folder?: string) => Promise<FileUploadResponse | null>;
  uploadImage: (image: File, folder?: string) => Promise<ImageUploadResponse | null>;
  uploadImages: (images: File[], folder?: string) => Promise<MultipleFileUploadResponse | null>;
  uploadFiles: (files: File[], folder?: string) => Promise<MultipleFileUploadResponse | null>;
  deleteFile: (fileName: string) => Promise<boolean>;
  
  // Utility functions
  clearError: () => void;
}

export function useFileUpload({ onSuccess, onError }: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleUpload = async <T>(
    uploadFn: () => Promise<T>,
    successCallback?: (response: T) => void
  ): Promise<T | null> => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate progress (since we don't have real progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await uploadFn();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (successCallback) {
        successCallback(response);
      }
      
      if (onSuccess) {
        onSuccess(response as any);
      }
      
      return response;
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const uploadFile = async (file: File, folder?: string): Promise<FileUploadResponse | null> => {
    return handleUpload(
      () => uploadAPI.uploadFile(file, folder),
      (response) => console.log('File uploaded:', response)
    );
  };

  const uploadImage = async (image: File, folder?: string): Promise<ImageUploadResponse | null> => {
    return handleUpload(
      () => uploadAPI.uploadImage(image, folder),
      (response) => console.log('Image uploaded:', response)
    );
  };

  const uploadImages = async (images: File[], folder?: string): Promise<MultipleFileUploadResponse | null> => {
    return handleUpload(
      () => uploadAPI.uploadImages(images, folder),
      (response) => console.log('Images uploaded:', response)
    );
  };

  const uploadFiles = async (files: File[], folder?: string): Promise<MultipleFileUploadResponse | null> => {
    return handleUpload(
      () => uploadAPI.uploadFiles(files, folder),
      (response) => console.log('Files uploaded:', response)
    );
  };

  const deleteFile = async (fileName: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await uploadAPI.deleteFile(fileName);
      return response.success;
    } catch (error: any) {
      console.error('Delete file error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return false;
    }
  };

  return {
    isUploading,
    uploadProgress,
    error,
    uploadFile,
    uploadImage,
    uploadImages,
    uploadFiles,
    deleteFile,
    clearError
  };
}
