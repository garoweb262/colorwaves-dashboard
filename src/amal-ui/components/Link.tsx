"use client";

import React from "react";
import { motion } from "framer-motion";
import { LinkProps } from "../types";
import { cn } from "../utilities";

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      className,
      href,
      external = false,
      variant = "default",
      underline = false,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "text-gray-900 hover:text-gray-700",
      primary: "text-blue-600 hover:text-blue-700",
      secondary: "text-purple-600 hover:text-purple-700",
    };

    const underlineClass = underline ? "underline" : "";

    const externalIcon = external && (
      <motion.svg
        className="w-4 h-4 ml-1 inline-block"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </motion.svg>
    );

    return (
      <motion.a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(
          "inline-flex items-center transition-colors duration-200",
          variantClasses[variant],
          underlineClass,
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring" as const,
          stiffness: 400,
          damping: 25,
        }}
      >
        {children}
        {externalIcon}
      </motion.a>
    );
  }
);

Link.displayName = "Link";
