"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutProps } from "../../types";
import { cn } from "../../utilities";
import { componentAnimations } from "../../animations";

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      children,
      className,
      header,
      footer,
      sidebar,
      sidebarPosition = "left",
      sidebarCollapsible = false,
      ...props
    },
    ref
  ) => {
    const hasSidebar = !!sidebar;
    const sidebarClasses = {
      left: "flex-row",
      right: "flex-row-reverse",
    };

    return (
      <motion.div
        ref={ref}
        className={cn("min-h-screen flex flex-col", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        {header && (
          <motion.header
            className="flex-shrink-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {header}
          </motion.header>
        )}

        {/* Main Content with Sidebar */}
        <motion.main
          className={cn(
            "flex-1 flex",
            hasSidebar && sidebarClasses[sidebarPosition]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Sidebar */}
          {sidebar && (
            <motion.aside
              className={cn(
                "flex-shrink-0",
                sidebarPosition === "left" ? "order-first" : "order-last"
              )}
              initial={{ opacity: 0, x: sidebarPosition === "left" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {sidebar}
            </motion.aside>
          )}

          {/* Main Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {children}
          </motion.div>
        </motion.main>

        {/* Footer */}
        {footer && (
          <motion.footer
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {footer}
          </motion.footer>
        )}
      </motion.div>
    );
  }
);

Layout.displayName = "Layout";
