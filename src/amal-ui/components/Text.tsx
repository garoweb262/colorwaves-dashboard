"use client";

import React from "react";
import { motion } from "framer-motion";
import { TextProps } from "../types";
import { cn } from "../utilities";

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      children,
      className,
      variant = "body",
      weight = "normal",
      color,
      align = "left",
      truncate = false,
      noOfLines,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      h1: "text-4xl font-bold font-sans",
      h2: "text-3xl font-semibold font-sans",
      h3: "text-2xl font-semibold font-sans",
      h4: "text-xl font-medium font-sans",
      h5: "text-lg font-medium font-sans",
      h6: "text-base font-medium font-sans",
      body: "text-base font-sans",
      caption: "text-sm font-sans",
      overline: "text-xs uppercase tracking-wider font-sans",
    };

    const weightClasses = {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    };

    const alignClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    };

    const truncateClass = truncate ? "truncate" : "";
    const lineClampClass = noOfLines ? `line-clamp-${noOfLines}` : "";

    // Filter out conflicting props that don't work with motion components
    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      onTransitionStart,
      onTransitionEnd,
      onLoad,
      onError,
      onAbort,
      onCanPlay,
      onCanPlayThrough,
      onDurationChange,
      onEmptied,
      onEnded,
      onLoadedData,
      onLoadedMetadata,
      onLoadStart,
      onPause,
      onPlay,
      onPlaying,
      onProgress,
      onRateChange,
      onSeeked,
      onSeeking,
      onStalled,
      onSuspend,
      onTimeUpdate,
      onVolumeChange,
      onWaiting,
      ...compatibleProps
    } = props;

    return (
      <motion.p
        ref={ref}
        className={cn(
          variantClasses[variant],
          weightClasses[weight],
          alignClasses[align],
          truncateClass,
          lineClampClass,
          className
        )}
        style={{ color }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        {...compatibleProps}
      >
        {children}
      </motion.p>
    );
  }
);

Text.displayName = "Text";
