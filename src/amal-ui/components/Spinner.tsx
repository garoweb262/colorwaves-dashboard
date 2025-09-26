"use client";

import React from "react";
import { motion } from "framer-motion";
import { SpinnerProps } from "../types";
import { cn } from "../utilities";

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = "md",
      variant = "default",
      speed = "normal",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    };

    const variantClasses = {
      default: "border-gray-300 border-t-gray-600",
      primary: "border-blue-300 border-t-blue-600",
      secondary: "border-purple-300 border-t-purple-600",
    };

    const speedClasses = {
      slow: 2,
      normal: 1,
      fast: 0.5,
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "inline-block border-2 border-solid rounded-full animate-spin",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: speedClasses[speed],
          repeat: Infinity,
          ease: "linear",
        }}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner"; 