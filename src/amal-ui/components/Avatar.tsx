"use client";

import React from "react";
import { motion } from "framer-motion";
import { AvatarProps } from "../types";
import { cn } from "../utilities";

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      size = "md",
      fallback,
      status,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: "w-6 h-6 text-xs",
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
      xl: "w-16 h-16 text-xl",
      "2xl": "w-20 h-20 text-2xl",
    };

    const statusClasses = {
      online: "bg-green-400",
      offline: "bg-gray-400",
      away: "bg-yellow-400",
      busy: "bg-red-400",
    };

    const statusSizes = {
      xs: "w-1.5 h-1.5",
      sm: "w-2 h-2",
      md: "w-2.5 h-2.5",
      lg: "w-3 h-3",
      xl: "w-4 h-4",
      "2xl": "w-5 h-5",
    };

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const fallbackText = fallback || (alt ? getInitials(alt) : "?");

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative inline-block rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 overflow-hidden",
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}

      >
        {src ? (
          <motion.img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallbackElement = target.nextElementSibling as HTMLElement;
              if (fallbackElement) {
                fallbackElement.style.display = "flex";
              }
            }}
          />
        ) : null}
        
        <motion.div
          className={cn(
            "w-full h-full flex items-center justify-center",
            src ? "hidden" : ""
          )}
          initial={{ opacity: src ? 0 : 1 }}
          animate={{ opacity: src ? 0 : 1 }}
        >
          {fallbackText}
        </motion.div>

        {status && (
          <motion.div
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-white",
              statusClasses[status],
              statusSizes[size]
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </motion.div>
    );
  }
);

Avatar.displayName = "Avatar"; 