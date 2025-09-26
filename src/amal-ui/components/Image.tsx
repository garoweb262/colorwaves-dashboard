"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageProps } from "../types";
import { cn } from "../utilities";

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      src,
      alt,
      fallback,
      loading = "lazy",
      sizes,
      objectFit = "cover",
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const objectFitClasses = {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      none: "object-none",
      "scale-down": "object-scale-down",
    };

    const handleError = () => {
      setImageError(true);
    };

    const handleLoad = () => {
      setImageLoaded(true);
    };

    if (imageError && fallback) {
      return (
        <motion.div
          className={cn(
            "bg-gray-200 flex items-center justify-center",
            objectFitClasses[objectFit],
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
          }}
        >
          <span className="text-gray-500 text-sm">{fallback}</span>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        }}
      >
        <motion.img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          sizes={sizes}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            objectFitClasses[objectFit],
            !imageLoaded && "opacity-0",
            imageLoaded && "opacity-100",
            className
          )}
          onError={handleError}
          onLoad={handleLoad}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
          }}
        />
        {!imageLoaded && !imageError && (
          <motion.div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    );
  }
);

Image.displayName = "Image";
