"use client";

import React from "react";
import { motion } from "framer-motion";
import { InputProps } from "../../types";
import { cn, getSpacing } from "../../utilities";
import { useMotionGradient, useMotionState } from "../../utilities/motion";


export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
      ...props
    },
    ref
  ) => {
   
    const { visible, setVisible } = useMotionState();

    const sizeClasses = {
      sm: `h-8 px-3 text-sm ${getSpacing("xs")}`,
      md: `h-10 px-4 text-base ${getSpacing("sm")}`,
      lg: `h-12 px-6 text-lg ${getSpacing("md")}`,
    };

    const widthClass = fullWidth ? "w-full" : "";

    const BottomGradient = () => {
      return (
        <>
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-palette-blue to-transparent opacity-0 transition duration-500 group-hover/input:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-palette-violet to-transparent opacity-0 blur-sm transition duration-500 group-hover/input:opacity-100" />
        </>
      );
    };

    return (
      <motion.div
        
     
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/input relative p-[2px] transition duration-300"
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 z-10">
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              className={cn(
                "flex w-full glass-input px-3 py-2 text-sm transition duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 z-10">
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

Input.displayName = "Input";
