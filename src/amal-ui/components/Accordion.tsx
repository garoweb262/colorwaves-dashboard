"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccordionProps, AccordionItem } from "../types";
import { cn } from "../utilities";

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      className,
      items,
      allowMultiple = false,
      defaultOpen = [],
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (itemId: string) => {
      if (allowMultiple) {
        setOpenItems((prev) =>
          prev.includes(itemId)
            ? prev.filter((id) => id !== itemId)
            : [...prev, itemId]
        );
      } else {
        setOpenItems((prev) =>
          prev.includes(itemId) ? [] : [itemId]
        );
      }
    };

    const isOpen = (itemId: string) => openItems.includes(itemId);

    const contentVariants = {
      hidden: {
        height: 0,
        opacity: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
      visible: {
        height: "auto",
        opacity: 1,
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
        className={cn("space-y-2", className)}
        {...props}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={false}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.01 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          >
            <motion.button
              onClick={() => !item.disabled && toggleItem(item.id)}
              className={cn(
                "w-full px-4 py-3 text-left flex items-center justify-between font-medium transition-colors",
                item.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-900 hover:bg-gray-50"
              )}
              whileHover={!item.disabled ? { backgroundColor: "#f9fafb" } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
            >
              <span>{item.title}</span>
              <motion.svg
                className="w-5 h-5 text-gray-500 flex-shrink-0"
                animate={{ rotate: isOpen(item.id) ? 180 : 0 }}
                transition={{
                  type: "spring",
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
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {isOpen(item.id) && (
                <motion.div
                  className="px-4 pb-3"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="pt-2 border-t border-gray-100">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  }
);

Accordion.displayName = "Accordion"; 