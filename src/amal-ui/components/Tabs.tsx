"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TabsProps, TabItem } from "../types";
import { cn } from "../utilities";

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      className,
      items,
      defaultActive,
      variant = "default",
      size = "md",
      ...props
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState<string>(
      defaultActive || items[0]?.id || ""
    );

    const activeItem = items.find((item) => item.id === activeTab);

    const variantClasses = {
      default: "border-gray-200",
      pills: "bg-gray-100 p-1 rounded-lg",
      underline: "border-b border-gray-200",
    };

    const tabClasses = {
      default: "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300",
      pills: "px-3 py-2 text-sm font-medium rounded-md hover:bg-white hover:shadow-sm",
      underline: "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300",
    };

    const activeTabClasses = {
      default: "border-blue-500 text-blue-600",
      pills: "bg-white shadow-sm text-gray-900",
      underline: "border-blue-500 text-blue-600",
    };

    const sizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const contentVariants = {
      hidden: {
        opacity: 0,
        y: 10,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
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
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {/* Tab Headers */}
        <div
          className={cn(
            "flex",
            variant === "pills" ? "gap-1" : "border-b",
            variantClasses[variant]
          )}
        >
          {items.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-2 transition-colors",
                tabClasses[variant],
                sizeClasses[size],
                item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : activeTab === item.id
                  ? activeTabClasses[variant]
                  : "text-gray-500"
              )}
              whileHover={!item.disabled ? { scale: 1.02 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
              disabled={item.disabled}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          className="mt-4"
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {activeItem?.content}
        </motion.div>
      </div>
    );
  }
);

Tabs.displayName = "Tabs"; 