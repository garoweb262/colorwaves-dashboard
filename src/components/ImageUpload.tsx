"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, CheckCircle } from "lucide-react";
import { Button } from "@/amal-ui";
import { cn } from "@/amal-ui";

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  onImageRemove?: () => void;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  currentImage?: string | null;
  label?: string;
  description?: string;
  multiple?: boolean;
  maxImages?: number;
  onImagesSelect?: (imageUrls: string[]) => void;
  currentImages?: string[];
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  maxSize = 5,
  className,
  disabled = false,
  currentImage,
  label = "Upload Image",
  description = "Click to upload or drag and drop",
  multiple = false,
  maxImages = 5,
  onImagesSelect,
  currentImages = []
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    setUploadError(null);
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file");
      return;
    }

    setIsUploading(true);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    if (multiple) {
      const newImages = [...previewImages, previewUrl];
      if (newImages.length > maxImages) {
        setUploadError(`Maximum ${maxImages} images allowed`);
        setIsUploading(false);
        return;
      }
      setPreviewImages(newImages);
      onImagesSelect?.(newImages);
    } else {
      setPreviewImages([previewUrl]);
      onImageSelect(previewUrl);
    }
    
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple) {
        files.forEach(file => handleImageSelect(file));
      } else {
        handleImageSelect(files[0]);
      }
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
      if (multiple) {
        Array.from(files).forEach(file => handleImageSelect(file));
      } else {
        handleImageSelect(files[0]);
      }
    }
  };

  const handleRemoveImage = (index?: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
    
    if (multiple && index !== undefined) {
      const newImages = previewImages.filter((_, i) => i !== index);
      setPreviewImages(newImages);
      onImagesSelect?.(newImages);
    } else {
      setPreviewImages([]);
      onImageRemove?.();
    }
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
          previewImages.length > 0 && "border-green-300 bg-green-50"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {previewImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                {multiple ? `${previewImages.length} image(s) uploaded` : "Image uploaded successfully"}
              </span>
            </div>
            
            <div className={cn(
              "grid gap-4",
              multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
            )}>
              {previewImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              {multiple ? "Add More Images" : "Change Image"}
            </Button>
              {!multiple && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage()}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Upload className="h-8 w-8 text-blue-500" />
                </motion.div>
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {isUploading ? "Uploading..." : label}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {description}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Max file size: {maxSize}MB {multiple && `• Max ${maxImages} images`}
            </p>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              loading={isUploading}
            >
              {isUploading ? "Uploading..." : "Choose Image" + (multiple ? "s" : "")}
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
