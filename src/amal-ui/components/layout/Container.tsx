"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { ContainerProps } from "../../types";
import { cn } from "../../utilities";
import { componentAnimations } from "../../animations";

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      className,
      maxWidth = "xl",
      padding = "md",
      centered = true,
      ...props
    },
    ref
  ) => {
    // Use the exact width specifications from BackgroundGridLines CSS
    const maxWidthClasses = {
      sm: "w-[88%] min-w-[350px] mx-auto", // Mobile layout
      md: "w-[88%] mx-auto", // Tablet layout
      lg: "w-[88%] mx-auto", // Tablet layout
      xl: "max-w-[1280px] mx-auto", // Desktop layout
      "2xl": "max-w-[1280px] mx-auto", // Desktop layout
      full: "w-full",
    };

    // Responsive width classes that match BackgroundGridLines exactly
    const responsiveWidthClasses = {
      sm: "w-[88%] min-w-[350px] mx-auto md:w-[88%] lg:w-[88%] xl:max-w-[1280px]",
      md: "w-[88%] mx-auto md:w-[88%] lg:w-[88%] xl:max-w-[1280px]",
      lg: "w-[88%] mx-auto md:w-[88%] lg:w-[88%] xl:max-w-[1280px]",
      xl: "w-[88%] mx-auto md:w-[88%] lg:w-[88%] xl:max-w-[1280px]",
      "2xl": "w-[88%] mx-auto md:w-[88%] lg:w-[88%] xl:max-w-[1280px]",
      full: "w-full",
    };

    // Fixed padding classes using proper Tailwind values
    const paddingClasses = {
      none: "",
      sm: "px-4 py-4",
      md: "px-6 py-6",
      lg: "px-8 py-8",
      xl: "px-10 py-10",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          responsiveWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    );
  }
);

Container.displayName = "Container";
