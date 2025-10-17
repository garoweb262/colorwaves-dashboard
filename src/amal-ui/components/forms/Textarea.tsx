"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn, getSpacing } from "../../utilities";
import { useMotionGradient, useMotionState } from "../../utilities/motion";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = "md",
      fullWidth = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const { handleMouseMove, background } = useMotionGradient({
      radius: 100,
      color: "#f97316", // Orange accent color
    });
    const { visible, setVisible } = useMotionState();

    const sizeClasses = {
      sm: `px-3 py-2 text-sm ${getSpacing("xs")}`,
      md: `px-4 py-3 text-base ${getSpacing("sm")}`,
      lg: `px-6 py-4 text-lg ${getSpacing("md")}`,
    };

    const widthClass = fullWidth ? "w-full" : "";

    const BottomGradient = () => {
      return (
        <>
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/textarea:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/textarea:opacity-100" />
        </>
      );
    };

    return (
      <motion.div
        style={{
          background: visible ? background : "transparent",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/textarea relative p-[2px] transition duration-300"
      >
        <motion.div
          className="relative"
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          {label && (
            <label className="block text-sm font-medium text-white/80 mb-2">
              {label}
            </label>
          )}

          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-3 text-white/60 z-10">
                {leftIcon}
              </div>
            )}

            <textarea
              ref={ref}
              rows={rows}
              className={cn(
                "flex w-full glass-textarea text-sm transition duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                sizeClasses[size],
                widthClass,
                leftIcon ? "pl-10" : "",
                rightIcon ? "pr-10" : "",
                error &&
                  "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/30"
              )}
              {...props}
            />

            {rightIcon && (
              <div className="absolute right-3 top-3 text-white/60 z-10">
                {rightIcon}
              </div>
            )}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-300"
            >
              {error}
            </motion.p>
          )}

          {helperText && !error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-white/60"
            >
              {helperText}
            </motion.p>
          )}

          <BottomGradient />
        </motion.div>
      </motion.div>
    );
  }
);

Textarea.displayName = "Textarea";
