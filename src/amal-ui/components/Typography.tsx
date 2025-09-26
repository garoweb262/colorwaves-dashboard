"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utilities";

interface TypographyProps {
  children: React.ReactNode;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "overline";
  weight?:
    | "thin"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  truncate?: boolean;
  noOfLines?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body",
  weight = "normal",
  color,
  align = "left",
  truncate = false,
  noOfLines,
  className,
  as,
  ...props
}) => {
  const variantClasses = {
    h1: "text-[2rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.6875rem] font-heading leading-none tracking-tighter",
    h2: "text-[1.75rem] md:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.125rem] font-heading leading-none tracking-tighter",
    h3: "text-[1.5rem] md:text-[1.875rem] lg:text-[2.25rem] xl:text-[2.5rem] font-heading leading-none tracking-tighter",
    h4: "text-[1.25rem] md:text-[1.5rem] lg:text-[1.75rem] xl:text-[2rem] font-heading leading-none tracking-tighter",
    h5: "text-[1.125rem] md:text-[1.375rem] lg:text-[1.5rem] xl:text-[1.75rem] font-heading leading-none tracking-tighter",
    h6: "text-[1rem] md:text-[1.125rem] lg:text-[1.25rem] xl:text-[1.5rem] font-heading leading-none tracking-tighter",
    body: "text-[0.875rem] md:text-[1rem] lg:text-[1.125rem] xl:text-[1.25rem] font-sans",
    caption:
      "text-[0.75rem] md:text-[0.8125rem] lg:text-[0.875rem] xl:text-[1rem] font-sans",
    overline:
      "text-[0.625rem] md:text-[0.6875rem] lg:text-[0.75rem] xl:text-[0.875rem] uppercase tracking-wider font-sans",
  };

  // Custom font sizes for more control
  const getCustomFontSize = (variant: string) => {
    const sizes = {
      h1: {
        fontSize: "2rem",
        "@media (min-width: 768px)": { fontSize: "5rem" },
        "@media (min-width: 1024px)": { fontSize: "7rem" },
        "@media (min-width: 1280px)": { fontSize: "8rem" },
      },
      h2: {
        fontSize: "1.75rem",
        "@media (min-width: 768px)": { fontSize: "2.25rem" },
        "@media (min-width: 1024px)": { fontSize: "2.75rem" },
        "@media (min-width: 1280px)": { fontSize: "3.125rem" },
      },
      h3: {
        fontSize: "1.5rem",
        "@media (min-width: 768px)": { fontSize: "1.875rem" },
        "@media (min-width: 1024px)": { fontSize: "2.25rem" },
        "@media (min-width: 1280px)": { fontSize: "2.5rem" },
      },
      h4: {
        fontSize: "1.25rem",
        "@media (min-width: 768px)": { fontSize: "1.5rem" },
        "@media (min-width: 1024px)": { fontSize: "1.75rem" },
        "@media (min-width: 1280px)": { fontSize: "2rem" },
      },
      h5: {
        fontSize: "1.125rem",
        "@media (min-width: 768px)": { fontSize: "1.375rem" },
        "@media (min-width: 1024px)": { fontSize: "1.5rem" },
        "@media (min-width: 1280px)": { fontSize: "1.75rem" },
      },
      h6: {
        fontSize: "1rem",
        "@media (min-width: 768px)": { fontSize: "1.125rem" },
        "@media (min-width: 1024px)": { fontSize: "1.25rem" },
        "@media (min-width: 1280px)": { fontSize: "1.5rem" },
      },
      body: {
        fontSize: "1rem",
        "@media (min-width: 768px)": { fontSize: "1.125rem" },
        "@media (min-width: 1024px)": { fontSize: "1.25rem" },
        "@media (min-width: 1280px)": { fontSize: "1.375rem" },
      },
      caption: {
        fontSize: "0.875rem",
        "@media (min-width: 768px)": { fontSize: "0.9375rem" },
        "@media (min-width: 1024px)": { fontSize: "1rem" },
        "@media (min-width: 1280px)": { fontSize: "1.125rem" },
      },
      overline: {
        fontSize: "0.75rem",
        "@media (min-width: 768px)": { fontSize: "0.8125rem" },
        "@media (min-width: 1024px)": { fontSize: "0.875rem" },
        "@media (min-width: 1280px)": { fontSize: "1rem" },
      },
    };
    return sizes[variant as keyof typeof sizes] || {};
  };

  const weightClasses = {
    thin: "font-thin",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const truncateClass = truncate ? "truncate" : "";
  const lineClampClass = noOfLines ? `line-clamp-${noOfLines}` : "";

  // Determine the component to render
  let Component: keyof JSX.IntrinsicElements = "p";
  if (as) {
    Component = as;
  } else if (variant.startsWith("h")) {
    Component = variant as keyof JSX.IntrinsicElements;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <Component
        className={cn(
          variantClasses[variant],
          weightClasses[weight],
          alignClasses[align],
          truncateClass,
          lineClampClass,
          className
        )}
        style={{ color }}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
};
