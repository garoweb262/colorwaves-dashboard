"use client";

import React from "react";
import { motion } from "framer-motion";
import { BadgeProps } from "../types";
import { cn } from "../utilities";

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "md",
      dot = false,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-gray-100 text-gray-800 border-gray-200",
      primary: "bg-blue-100 text-blue-800 border-blue-200",
      secondary: "bg-purple-100 text-purple-800 border-purple-200",
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      error: "bg-red-100 text-red-800 border-red-200",
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    };

    const dotClasses = {
      default: "bg-gray-400",
      primary: "bg-blue-400",
      secondary: "bg-purple-400",
      success: "bg-green-400",
      warning: "bg-yellow-400",
      error: "bg-red-400",
    };

    return (
      <motion.span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 border rounded-full font-medium",
          variantClasses[variant],
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
        {dot && (
          <motion.span
            className={cn("w-1.5 h-1.5 rounded-full", dotClasses[variant])}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
        {children}
      </motion.span>
    );
  }
);

Badge.displayName = "Badge";
