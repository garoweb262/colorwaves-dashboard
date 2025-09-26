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
    const { handleMouseMove, background } = useMotionGradient({
      radius: 100,
      color: "#f97316", // Orange accent color
    });
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
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/input:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/input:opacity-100" />
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
                "shadow-input dark:placeholder-text-neutral-600 flex w-full border-none bg-white px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-orange-600 border border-gray-200",
                sizeClasses[size],
                widthClass,
                leftIcon ? "pl-10" : "",
                rightIcon ? "pr-10" : "",
                error &&
                  "border-red-300 focus-visible:ring-red-400 dark:focus-visible:ring-red-600"
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
              className="mt-1 text-sm text-red-600"
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
