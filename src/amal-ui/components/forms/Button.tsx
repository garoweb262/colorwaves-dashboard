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
      color: "#70369D", // ColorWaves violet
    });
    const { visible, setVisible } = useMotionState();

    const baseClasses =
      "inline-flex items-center justify-center font-medium uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

      
    const variantClasses = {
      primary:
        "bg-white/10 backdrop-blur-lg text-white hover:bg-white/15 focus:ring-white/20 active:bg-white/20 border border-white/20",
      secondary:
        "bg-white/5 backdrop-blur-md text-white hover:bg-white/10 focus:ring-white/20 active:bg-white/15 border border-white/10",
      accent:
        "bg-white/8 backdrop-blur-md text-white hover:bg-white/12 focus:ring-white/20 active:bg-white/18 border border-white/15",
      ghost:
        "bg-transparent text-white/70 hover:bg-white/10 hover:text-white focus:ring-white/20 active:bg-white/15",
      outline:
        "border border-white/30 text-white hover:bg-white/10 hover:text-white focus:ring-white/20 active:bg-white/15 backdrop-blur-sm",
      destructive:
        "bg-red-500/20 backdrop-blur-lg text-red-200 hover:bg-red-500/30 focus:ring-red-400/30 active:bg-red-500/40 border border-red-400/30",
      anchor:
        "bg-transparent text-white/70 hover:text-white hover:bg-white/5 focus:ring-white/20",
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
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-palette-blue to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-palette-violet to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
              "inline-flex items-center justify-center font-medium uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
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
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-palette-violet to-transparent opacity-0"
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
