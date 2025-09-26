"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../../utilities";
import { useMotionGradient, useMotionState } from "../../utilities/motion";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      label,
      error,
      helperText,
      disabled = false,
      className,
    },
    ref
  ) => {
    const { handleMouseMove, background } = useMotionGradient({
      radius: 100,
      color: "#f97316", // Orange accent color
    });
    const { visible, setVisible } = useMotionState();

    const handleToggle = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const BottomGradient = () => {
      return (
        <>
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/checkbox:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/checkbox:opacity-100" />
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
        className="group/checkbox relative p-[2px] transition duration-300"
      >
        <motion.div
          className="flex items-center space-x-3"
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <motion.button
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={cn(
              "relative flex h-5 w-5 items-center justify-center border-2 border-gray-200 bg-white transition-colors focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-50",
              checked && "border-orange-600 bg-orange-600",
              error && "border-red-300 focus:ring-red-400",
              className
            )}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {label && (
            <motion.label
              className="text-sm font-medium text-gray-700 cursor-pointer"
              onClick={handleToggle}
              whileHover={{ color: "#f97316" }}
            >
              {label}
            </motion.label>
          )}
        </motion.div>

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
    );
  }
);

Checkbox.displayName = "Checkbox";
