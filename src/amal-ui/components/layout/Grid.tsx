"use client";

import React from "react";
import { motion } from "framer-motion";
import { GridProps } from "../../types";
import { cn, getSpacing } from "../../utilities";
import { componentAnimations } from "../../animations";

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      className,
      columns = 1,
      gap = "md",
      alignItems = "stretch",
      justifyContent = "start",
      ...props
    },
    ref
  ) => {
    const gapClasses = {
      none: "",
      sm: `gap-${getSpacing("sm")}`,
      md: `gap-${getSpacing("md")}`,
      lg: `gap-${getSpacing("lg")}`,
      xl: `gap-${getSpacing("xl")}`,
    };

    const alignItemsClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifyContentClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    // Handle responsive columns
    const getGridColumns = () => {
      if (typeof columns === "number") {
        return `grid-cols-${columns}`;
      }

      const responsiveClasses = [];
      if (columns.base) responsiveClasses.push(`grid-cols-${columns.base}`);
      if (columns.sm) responsiveClasses.push(`sm:grid-cols-${columns.sm}`);
      if (columns.md) responsiveClasses.push(`md:grid-cols-${columns.md}`);
      if (columns.lg) responsiveClasses.push(`lg:grid-cols-${columns.lg}`);
      if (columns.xl) responsiveClasses.push(`xl:grid-cols-${columns.xl}`);
      if (columns["2xl"])
        responsiveClasses.push(`2xl:grid-cols-${columns["2xl"]}`);

      return responsiveClasses.join(" ");
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "grid",
          getGridColumns(),
          gapClasses[gap],
          alignItemsClasses[alignItems],
          justifyContentClasses[justifyContent],
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

Grid.displayName = "Grid";
