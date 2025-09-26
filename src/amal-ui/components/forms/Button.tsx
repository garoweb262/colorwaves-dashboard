"use client";

import React from "react";
import { motion } from "framer-motion";
import { ButtonProps } from "../../types";
import { cn } from "../../utilities";
import { useMotionGradient, useMotionState } from "../../utilities/motion";
import { ExternalLink } from "lucide-react";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      onClick,
      ...props
    },
    ref
  ) => {
    const { handleMouseMove, background } = useMotionGradient({
      radius: 100,
      color: "#f97316", // Orange accent color
    });
    const { visible, setVisible } = useMotionState();

    const baseClasses =
      "inline-flex items-center justify-between font-medium uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

    const variantClasses = {
      primary:
        "bg-amaltech-blue text-white hover:bg-amaltech-orange focus:ring-amaltech-blue active:bg-amaltech-orange/90",
      secondary:
        "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 active:bg-orange-700",
      accent:
        "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 active:bg-orange-700",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200",
      outline:
        "border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
      anchor:
        "bg-transparent text-amaltech-blue hover:text-amaltech-orange focus:ring-amaltech-blue",
    };

    const sizeClasses = {
      sm: "h-7 px-2 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const anchorSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const BottomGradient = () => {
      return (
        <>
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
      );
    };

    // Anchor variant with animated hover line
    if (variant === "anchor") {
      return (
        <div className="group relative inline-flex flex-col items-center">
          <motion.button
            ref={ref}
            className={cn(
              "inline-flex items-center justify-between font-medium uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
              variantClasses[variant],
              anchorSizeClasses[size],
              widthClass,
              className
            )}
            disabled={disabled || loading}
            onClick={onClick}
            type={props.type}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {loading && (
              <motion.div
                className="mr-2 h-4 w-4 border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}

            {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}

            {children}

            {rightIcon && !loading && <span className="mr-2">{rightIcon}</span>}

            {/* External link icon for anchor variant */}
            <ExternalLink className="ml-2 h-4 w-4" />
          </motion.button>

          {/* Animated hover line with shimmer effect */}
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amaltech-orange to-transparent opacity-0"
            initial={{ opacity: 0, scaleX: 0 }}
            whileHover={{
              opacity: 1,
              scaleX: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            style={{
              transformOrigin: "left",
            }}
          />

          {/* Shimmer animation line */}
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            initial={{ x: "-100%" }}
            whileHover={{
              x: "100%",
              opacity: [0, 1, 0],
              transition: {
                duration: 0.8,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              },
            }}
          />
        </div>
      );
    }

    return (
      <motion.div
        style={{
          background: visible ? background : "transparent",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="group/btn relative p-[2px] transition duration-300"
      >
        <motion.button
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            widthClass,
            className
          )}
          disabled={disabled || loading}
          onClick={onClick}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          type={props.type}
        >
          {loading && (
            <motion.div
              className="mr-2 h-4 w-4 border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}

          {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}

          {children}

          {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}

          <BottomGradient />
        </motion.button>
      </motion.div>
    );
  }
);

Button.displayName = "Button";
