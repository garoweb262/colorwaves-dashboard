"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProgressProps } from "../types";
import { cn } from "../utilities";

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = "md",
      variant = "default",
      animated = true,
      striped = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    const variantClasses = {
      default: "bg-blue-600",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600",
    };

    const stripedAnimation = animated && striped ? "animate-pulse" : "";

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <motion.div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variantClasses[variant],
            stripedAnimation
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5,
          }}
          style={{
            backgroundImage: striped
              ? "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)"
              : "none",
            backgroundSize: striped ? "1rem 1rem" : "auto",
          }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress"; 