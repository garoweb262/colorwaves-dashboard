"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn, getSpacing } from "../../utilities";
import { useMotionGradient, useMotionState } from "../../utilities/motion";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      label,
      error,
      helperText,
      size = "md",
      fullWidth = false,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const BottomGradient = () => {
      return (
        <>
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/select:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/select:opacity-100" />
        </>
      );
    };

    return (
      <motion.div
        ref={ref}
        style={{
          background: visible ? background : "transparent",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/select relative p-[2px] transition duration-300"
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
            <motion.button
              type="button"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className={cn(
                "shadow-input dark:placeholder-text-neutral-600 flex w-full border-none bg-white px-3 py-2 text-sm text-black transition duration-400 group-hover/select:shadow-none focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-orange-600 border border-gray-200",
                sizeClasses[size],
                widthClass,
                "pr-10",
                error &&
                  "border-red-300 focus-visible:ring-red-400 dark:focus-visible:ring-red-600",
                className
              )}
            >
              <span className={selectedOption ? "text-black" : "text-gray-500"}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <ChevronDown
                  className="h-4 w-4 text-gray-400"
                  strokeWidth={1}
                />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto"
                >
                  {options.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                        option.value === value && "bg-orange-50 text-orange-600"
                      )}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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

Select.displayName = "Select";
