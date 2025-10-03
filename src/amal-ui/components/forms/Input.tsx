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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
          )}

          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              className={cn(
                "flex w-full border border-gray-300 bg-white px-3 py-2 text-sm text-black transition duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:border-palette-violet focus:outline-none focus:ring-1 focus:ring-palette-violet disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:border-gray-600 dark:focus:border-palette-violet dark:focus:ring-palette-violet",
                sizeClasses[size],
                widthClass,
                leftIcon ? "pl-10" : "",
                rightIcon ? "pr-10" : "",
                error &&
                  "border-palette-red focus:border-palette-red focus:ring-palette-red dark:focus:border-palette-red dark:focus:ring-palette-red"
              )}
              {...props}
            />

            {rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                {rightIcon}
              </div>
            )}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-palette-red"
            >
              {error}
            </motion.p>
          )}

          {helperText && !error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-gray-500"
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
