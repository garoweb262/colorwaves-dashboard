"use client";

import React from "react";
import { motion } from "framer-motion";
import { StackProps } from "../../types";
import { cn, getSpacing } from "../../utilities";
import { componentAnimations } from "../../animations";

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      children,
      className,
      direction = "vertical",
      spacing = "md",
      divider,
      ...props
    },
    ref
  ) => {
    const directionClasses = {
      vertical: "flex flex-col",
      horizontal: "flex flex-row",
    };

    const spacingClasses = {
      none: "",
      xs: `space-y-${getSpacing("xs")}`,
      sm: `space-y-${getSpacing("sm")}`,
      md: `space-y-${getSpacing("md")}`,
      lg: `space-y-${getSpacing("lg")}`,
      xl: `space-y-${getSpacing("xl")}`,
    };

    const horizontalSpacingClasses = {
      none: "",
      xs: `space-x-${getSpacing("xs")}`,
      sm: `space-x-${getSpacing("sm")}`,
      md: `space-x-${getSpacing("md")}`,
      lg: `space-x-${getSpacing("lg")}`,
      xl: `space-x-${getSpacing("xl")}`,
    };

    const isHorizontal = direction === "horizontal";
    const spacingClass = isHorizontal
      ? horizontalSpacingClasses[spacing]
      : spacingClasses[spacing];

    return (
      <motion.div
        ref={ref}
        className={cn(directionClasses[direction], spacingClass, className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {divider
          ? React.Children.map(children, (child, index) => (
              <React.Fragment key={index}>
                {child}
                {index < React.Children.count(children) - 1 && (
                  <div className={isHorizontal ? "mx-2" : "my-2"}>
                    {divider}
                  </div>
                )}
              </React.Fragment>
            ))
          : children}
      </motion.div>
    );
  }
);

Stack.displayName = "Stack";
