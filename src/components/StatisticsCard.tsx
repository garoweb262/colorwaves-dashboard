"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  color: string;
  bgColor: string;
  isLoading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color,
  bgColor,
  isLoading = false,
  className = "",
  style,
}) => {
  if (isLoading) {
    return (
      <div className={`glass-card ${className}`} style={style}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <div className="w-6 h-6 bg-white/30 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/30 rounded w-3/4"></div>
            <div className="h-8 bg-white/30 rounded w-1/2"></div>
            <div className="h-3 bg-white/30 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card-hover ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-white/70">{title}</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {change && (
          <p
            className={`text-sm mt-2 ${
              changeType === "positive"
                ? "text-green-400"
                : changeType === "negative"
                ? "text-red-400"
                : "text-white/60"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </motion.div>
  );
};
