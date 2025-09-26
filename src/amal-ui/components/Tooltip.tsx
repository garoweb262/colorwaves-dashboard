"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProps } from "../types";
import { cn } from "../utilities";

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    { children, content, placement = "top", delay = 300, className, ...props },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    let timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (isVisible && triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let x = 0;
        let y = 0;

        switch (placement) {
          case "top":
            x =
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            y = triggerRect.top - tooltipRect.height - 8;
            break;
          case "bottom":
            x =
              triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
            y = triggerRect.bottom + 8;
            break;
          case "left":
            x = triggerRect.left - tooltipRect.width - 8;
            y =
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            break;
          case "right":
            x = triggerRect.right + 8;
            y =
              triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
            break;
        }

        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x < 8) x = 8;
        if (x + tooltipRect.width > viewportWidth - 8)
          x = viewportWidth - tooltipRect.width - 8;
        if (y < 8) y = 8;
        if (y + tooltipRect.height > viewportHeight - 8)
          y = viewportHeight - tooltipRect.height - 8;

        setPosition({ x, y });
      }
    }, [isVisible, placement]);

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const placementClasses = {
      top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
      top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900",
      bottom:
        "bottom-full left-1/2 transform -translate-y-1/2 border-b-gray-900",
      left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900",
      right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900",
    };

    const tooltipVariants = {
      hidden: {
        opacity: 0,
        scale: 0.95,
        y: placement === "top" ? 10 : placement === "bottom" ? -10 : 0,
        x: placement === "left" ? 10 : placement === "right" ? -10 : 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: placement === "top" ? 10 : placement === "bottom" ? -10 : 0,
        x: placement === "left" ? 10 : placement === "right" ? -10 : 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        },
      },
    };

    return (
      <div
        ref={triggerRef}
        className={cn("relative inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}

        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              className={cn(
                "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap",
                placementClasses[placement]
              )}
              style={{
                left: position.x,
                top: position.y,
              }}
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {content}
              <div
                className={cn(
                  "absolute w-0 h-0 border-4 border-transparent",
                  arrowClasses[placement]
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
