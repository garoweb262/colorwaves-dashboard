"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeadingProps } from "../types";
import { cn } from "../utilities";

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      children,
      className,
      level = 1,
      variant,
      weight = "bold",
      color,
      align = "left",
      truncate = false,
      noOfLines,
      ...props
    },
    ref
  ) => {
    const levelClasses = {
      1: "text-4xl font-heading",
      2: "text-3xl font-heading",
      3: "text-2xl font-heading",
      4: "text-xl font-heading",
      5: "text-lg font-heading",
      6: "text-base font-heading",
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
      onCopy,
      onCut,
      onPaste,
      onCopyCapture,
      onCutCapture,
      onPasteCapture,
      ...compatibleProps
    } = props;

    const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <Component
          className={cn(
            levelClasses[level],
            weightClasses[weight],
            alignClasses[align],
            truncateClass,
            lineClampClass,
            className
          )}
          style={{ color }}
          {...compatibleProps}
        >
          {children}
        </Component>
      </motion.div>
    );
  }
);

Heading.displayName = "Heading";
