"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownProps, DropdownItem } from "../types";
import { cn } from "../utilities";

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      children,
      className,
      trigger,
      items,
      placement = "bottom",
      size = "md",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const placementClasses = {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2",
    };

    const sizeClasses = {
      sm: "min-w-32",
      md: "min-w-40",
      lg: "min-w-48",
    };

    const dropdownVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: placement === "top" ? 10 : -10,
        x: placement === "left" ? 10 : placement === "right" ? -10 : 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: placement === "top" ? 10 : -10,
        x: placement === "left" ? 10 : placement === "right" ? -10 : 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
    };

    const handleItemClick = (item: DropdownItem) => {
      if (!item.disabled) {
        item.onClick?.();
        setIsOpen(false);
      }
    };

    return (
      <div
        ref={dropdownRef}
        className={cn("relative inline-block", className)}
        {...props}
      >
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={ref}
              className={cn(
                "absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1",
                placementClasses[placement],
                sizeClasses[size]
              )}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.value || index}
                  className={cn(
                    "px-4 py-2 text-sm cursor-pointer transition-colors",
                    item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => handleItemClick(item)}
                  whileHover={!item.disabled ? { backgroundColor: "#f3f4f6" } : {}}
                  whileTap={!item.disabled ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <span className="flex-shrink-0 text-gray-500">
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1">{item.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown"; 