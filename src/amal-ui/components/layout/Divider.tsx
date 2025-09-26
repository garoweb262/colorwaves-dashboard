"use client";

import React from "react";
import { motion } from "framer-motion";
import { DividerProps } from "../../types";
import { cn, getSpacing } from "../../utilities";
import { componentAnimations } from "../../animations";

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = "horizontal",
      variant = "solid",
      size = "md",
      color,
      ...props
    },
    ref
  ) => {
    const orientationClasses = {
      horizontal: "w-full border-t",
      vertical: "h-full border-l",
    };

    const variantClasses = {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    };

    const sizeClasses = {
      sm: "border-1",
      md: "border-2",
      lg: "border-4",
    };

    const colorClasses = {
      default: "border-gray-200",
      primary: "border-blue-500",
      secondary: "border-purple-500",
      accent: "border-orange-500",
      success: "border-green-500",
      warning: "border-yellow-500",
      error: "border-red-500",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          orientationClasses[orientation],
          variantClasses[variant],
          sizeClasses[size],
          colorClasses[color as keyof typeof colorClasses] ||
            colorClasses.default,
          className
        )}
        style={
          color && !colorClasses[color as keyof typeof colorClasses]
            ? { borderColor: color }
            : undefined
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    );
  }
);

Divider.displayName = "Divider";
