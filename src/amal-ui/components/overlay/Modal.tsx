"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalProps } from "../../types";
import { cn } from "../../utilities";

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      className,
      isOpen,
      onClose,
      title,
      size = "md",
      closeOnOverlayClick = true,
      closeOnEsc = true,
      showCloseButton = true,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (closeOnEsc) {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            onClose();
          }
        };

        if (isOpen) {
          document.addEventListener("keydown", handleEsc);
          document.body.style.overflow = "hidden";
        }

        return () => {
          document.removeEventListener("keydown", handleEsc);
          document.body.style.overflow = "unset";
        };
      }
    }, [isOpen, onClose, closeOnEsc]);

    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      full: "max-w-full mx-4",
    };

    const backdropVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    const modalVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={closeOnOverlayClick ? onClose : undefined}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className={cn(
                "relative w-full bg-white rounded-lg shadow-2xl border border-gray-200",
                sizeClasses[size],
                className
              )}
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h2 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-6">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = "Modal";
