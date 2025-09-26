"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastProps } from "../types";
import { cn } from "../utilities";

interface Toast extends ToastProps {
  id: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxToasts?: number;
}

export const ToastProvider = ({
  children,
  position = "top-right",
  maxToasts = 5,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { ...toast, id };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });
    },
    [maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const toastVariants = {
    hidden: {
      opacity: 0,
      x: position.includes("right")
        ? 100
        : position.includes("left")
        ? -100
        : 0,
      y: position.includes("top") ? -20 : position.includes("bottom") ? 20 : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      x: position.includes("right")
        ? 100
        : position.includes("left")
        ? -100
        : 0,
      y: position.includes("top") ? -20 : position.includes("bottom") ? 20 : 0,
      scale: 0.95,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}

      {/* Toast Container */}
      <div
        className={cn(
          "fixed z-50 pointer-events-none",
          positionClasses[position]
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            className="space-y-2 pointer-events-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                variants={toastVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <ToastComponent
                  {...toast}
                  onClose={() => removeToast(toast.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const ToastComponent = React.forwardRef<HTMLDivElement, Toast>(
  (
    {
      className,
      variant = "info",
      title,
      description,
      duration = 5000,
      action,
      onClose,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const variantClasses = {
      info: "bg-blue-50 border-blue-200 text-blue-800",
      success: "bg-green-50 border-green-200 text-green-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      error: "bg-red-50 border-red-200 text-red-800",
    };

    const iconClasses = {
      info: "text-blue-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      error: "text-red-400",
    };

    const icons = {
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative p-4 border rounded-lg shadow-lg max-w-sm",
          variantClasses[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        {...props}
      >
        <div className="flex items-start">
          <div className={cn("flex-shrink-0", iconClasses[variant])}>
            {icons[variant]}
          </div>

          <div className="flex-1 ml-3">
            {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
            {description && <p className="text-sm opacity-90">{description}</p>}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {action && <div className="flex-shrink-0">{action}</div>}
            {onClose && (
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-4 h-4"
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
        </div>
      </motion.div>
    );
  }
);

ToastComponent.displayName = "ToastComponent";
