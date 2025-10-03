"use client";

import React from "react";
import { motion } from "framer-motion";
import { BreadcrumbProps, BreadcrumbItem } from "../types";
import { cn } from "../utilities";
import { Link } from "./Link";

export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  (
    { children, className, items, separator = "/", size = "md", ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const breadcrumbVariants = {
      hidden: { opacity: 0, y: -10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
    };

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "flex items-center space-x-2",
          sizeClasses[size],
          className
        )}
        variants={breadcrumbVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <motion.span
                className="text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {separator}
              </motion.span>
            )}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center space-x-1 text-gray-900">
                  {item.icon && (
                    <span className="flex-shrink-0">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </motion.nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";
