"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NavigationItem } from "../../types";
import React from "react";

interface NavigationMenuProps {
  items: NavigationItem[];
  locale: string;
  activeSubmenu: string | null;
  onSubmenuChange: (label: string | null) => void;
}

export function NavigationMenu({
  items,
  locale,
  activeSubmenu,
  onSubmenuChange,
}: NavigationMenuProps) {
  const handleSubmenuClick = (label: string) => {
    onSubmenuChange(activeSubmenu === label ? null : label);
  };

  const handleMouseEnter = (label: string) => {
    // Always show active tab bar on hover for all items
    onSubmenuChange(label);
  };

  const handleMouseLeave = () => {
    // Don't close immediately - let the dropdown handle its own hover
  };

  return (
    <nav className="hidden lg:flex items-center h-full space-x-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="relative group h-full flex items-center"
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          {item.children ? (
            <button
              onClick={() => handleSubmenuClick(item.label)}
              className="flex items-center h-full px-3 text-gray-700 hover:text-amaltech-orange active:text-amaltech-orange uppercase transition-colors relative text-sm font-medium tracking-wide"
            >
              <span>{item.label}</span>

              {/* Active Tab Bar */}
              {activeSubmenu === item.label && (
                <motion.div
                  layoutId={`activeTab-${item.label}`}
                  className="absolute -top-0.5 left-0 right-0 h-1.5 bg-amaltech-orange rounded-full z-10"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </button>
          ) : (
            <Link
              href={`/${locale}${item.href}`}
              className="flex uppercase items-center h-full px-3 text-gray-700 hover:text-amaltech-orange active:text-amaltech-orange transition-colors relative text-sm font-medium tracking-wide"
            >
              {item.label}

              {/* Active Tab Bar for direct links */}
              {activeSubmenu === item.label && (
                <motion.div
                  layoutId={`activeTab-${item.label}`}
                  className="absolute -top-0.5 left-0 right-0 h-1.5 bg-amaltech-orange rounded-full z-10"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
