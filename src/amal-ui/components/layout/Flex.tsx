"use client";

import React from "react";
import { motion } from "framer-motion";
import { FlexProps } from "../../types";
import { cn, getSpacing } from "../../utilities";
import { componentAnimations } from "../../animations";

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      className,
      direction = "row",
      wrap = "nowrap",
      alignItems = "stretch",
      justifyContent = "start",
      gap = "none",
      ...props
    },
    ref
  ) => {
    const directionClasses = {
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
      column: "flex-col",
      "column-reverse": "flex-col-reverse",
    };

    const wrapClasses = {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    };

    const alignItemsClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };

    const justifyContentClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const gapClasses = {
      none: "",
      sm: `gap-${getSpacing("sm")}`,
      md: `gap-${getSpacing("md")}`,
      lg: `gap-${getSpacing("lg")}`,
      xl: `gap-${getSpacing("xl")}`,
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          wrapClasses[wrap],
          alignItemsClasses[alignItems],
          justifyContentClasses[justifyContent],
          gapClasses[gap],
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    );
  }
);

Flex.displayName = "Flex";
