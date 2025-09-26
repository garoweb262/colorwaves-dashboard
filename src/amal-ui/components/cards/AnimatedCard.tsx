"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../Typography";
import { Button } from "../forms/Button";
import { ArrowRight } from "lucide-react";
import { cn } from "../../utilities";

interface AnimatedCardProps {
  tagline: string;
  description: string;
  image?: string;
  imageAlt?: string;
  className?: string;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  tagline,
  description,
  image,
  imageAlt,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-neutral-100 h-full group card-fill-animation",
        className
      )}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Content container */}
      <div className="relative z-10 p-6 md:p-8  flex flex-col gap-y-12 items-start justify-start h-[25rem]">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4"
        >
          <Typography
            variant="body"
            weight="light"
            className="text-neutral-800 flex group-hover:text-amaltech-blue transition-colors duration-300 gap-2"
          >
            <span className="text-amaltech-orange group-hover:text-white">
              /
            </span>
            {tagline}
          </Typography>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 mb-6"
        >
          <Typography
            variant="body"
            weight="medium"
            className="uppercase text-neutral-800 group-hover:text-white transition-colors duration-300"
          >
            {description}
          </Typography>
        </motion.div>

        {/* Button - extreme bottom left edge of card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute -left-1 -bottom-1 w-1/3"
        >
          <Button
            variant="primary"
            size="md"
            fullWidth
            rightIcon={
              <ArrowRight className="w-4 h-4 group-hover:text-amaltech-orange transition-colors duration-300" />
            }
            className="bg-amaltech-orange button-fill-animation"
          >
            {""}
          </Button>
        </motion.div>

        {/* Image - extreme bottom right edge of card */}
        {image && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -right-3 -bottom-3 h-[15rem] overflow-hidden"
          >
            <img
              src={image}
              alt={imageAlt || "Card Image"}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
