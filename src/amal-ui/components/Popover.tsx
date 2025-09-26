"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PopoverProps } from "../types";
import { cn } from "../utilities";

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      className,
      trigger,
      content,
      placement = "bottom",
      offset = 8,
      showArrow = true,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && triggerRef.current && popoverRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();

        let x = 0;
        let y = 0;

        switch (placement) {
          case "top":
            x =
              triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
            y = triggerRect.top - popoverRect.height - offset;
            break;
          case "bottom":
            x =
              triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;
            y = triggerRect.bottom + offset;
            break;
          case "left":
            x = triggerRect.left - popoverRect.width - offset;
            y =
              triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
            break;
          case "right":
            x = triggerRect.right + offset;
            y =
              triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2;
            break;
        }

        // Ensure popover stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x < 0) x = 8;
        if (x + popoverRect.width > viewportWidth)
          x = viewportWidth - popoverRect.width - 8;
        if (y < 0) y = 8;
        if (y + popoverRect.height > viewportHeight)
          y = viewportHeight - popoverRect.height - 8;

        setPosition({ x, y });
      }
    }, [isOpen, placement, offset]);

    const placementClasses = {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2",
    };

    const arrowClasses = {
      top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-200",
      bottom:
        "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-200",
      left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-200",
      right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-200",
    };

    const popoverVariants = {
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
      <div className="relative inline-block" {...props}>
        <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              className={cn(
                "absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4",
                placementClasses[placement],
                className
              )}
              style={{
                left: position.x,
                top: position.y,
              }}
              variants={popoverVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {showArrow && (
                <div
                  className={cn(
                    "absolute w-0 h-0 border-4 border-transparent",
                    arrowClasses[placement]
                  )}
                />
              )}
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Popover.displayName = "Popover";
