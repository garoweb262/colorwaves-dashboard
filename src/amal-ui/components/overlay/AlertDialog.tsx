"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertDialogProps } from "../../types";
import { cn } from "../../utilities";
import { Button } from "../forms/Button";

export const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    {
      children,
      className,
      isOpen,
      onClose,
      onConfirm,
      title,
      description,
      confirmText = "Confirm",
      cancelText = "Cancel",
      variant = "destructive",
      size = "md",
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
    };

    const variantClasses: Record<string, string> = {
      destructive: "border-red-200",
      warning: "border-yellow-200",
      info: "border-blue-200",
    };

    const iconClasses: Record<string, string> = {
      destructive: "text-red-400",
      warning: "text-yellow-400",
      info: "text-blue-400",
    };

    const icons: Record<string, React.ReactNode> = {
      destructive: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      warning: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      info: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };

    const backdropVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    const dialogVariants = {
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

    const handleConfirm = () => {
      onConfirm?.();
      onClose();
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
            onClick={onClose}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              variants={backdropVariants}
            />

            {/* Dialog Content */}
            <motion.div
              className={cn(
                "relative w-full bg-white rounded-lg shadow-2xl border",
                variantClasses[variant],
                sizeClasses[size],
                className
              )}
              variants={dialogVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Icon */}
                <div className={cn("flex-shrink-0 mb-4", iconClasses[variant])}>
                  {icons[variant]}
                </div>

                {/* Title */}
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h2>
                )}

                {/* Description */}
                {description && (
                  <p className="text-sm text-gray-600 mb-6">{description}</p>
                )}

                {/* Content */}
                {children && <div className="mb-6">{children}</div>}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-gray-700"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={variant === "destructive" ? "destructive" : "primary"}
                    onClick={handleConfirm}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

AlertDialog.displayName = "AlertDialog"; 