"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Grip, ChevronDown, X } from "lucide-react";
import { Button } from "../forms/Button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
} from "../overlay/Drawer";
import { NavigationItem } from "../../types";
import React from "react";

interface MobileNavigationProps {
  items: NavigationItem[];
  locale: string;
}

// Reusable Navigation Item Component
function NavigationItemComponent({
  item,
  locale,
  level = 0,
  onClose,
}: {
  item: NavigationItem;
  locale: string;
  level?: number;
  onClose: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isDirectLink = item.href && !hasChildren;

  const handleClick = () => {
    if (isDirectLink) {
      onClose(); // Close menu when navigating
    } else if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderContent = () => {
    if (isDirectLink) {
      return (
        <Link
          href={`/${locale}${item.href}`}
          className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-0"
          onClick={onClose} // Ensure menu closes when link is clicked
        >
          <span className="font-medium">{item.label}</span>
          {item.icon && React.isValidElement(item.icon) && (
            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
              {React.cloneElement(item.icon as React.ReactElement<any>, {
                strokeWidth: 1,
                className: "h-3 w-3 text-blue-600",
              })}
            </div>
          )}
        </Link>
      );
    }

    return (
      <button
        className="w-full flex items-center justify-start gap-4 text-left p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-0 font-medium"
        onClick={handleClick}
      >
        <span>{item.label}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown
            className="h-4 w-4 text-gray-500 fill-current"
            strokeWidth={1}
          />
        </motion.div>
      </button>
    );
  };

  return (
    <div className="space-y-1">
      {renderContent()}

      {/* Nested Items */}
      {hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div
                className={`space-y-1 ${
                  level === 0
                    ? "ml-4 border-l-2 border-gray-200 pl-3"
                    : "ml-3 border-l border-gray-200 pl-3"
                }`}
              >
                {item.children?.map((childItem) => (
                  <NavigationItemComponent
                    key={childItem.label}
                    item={childItem}
                    locale={locale}
                    level={level + 1}
                    onClose={onClose}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export function MobileNavigation({ items, locale }: MobileNavigationProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const resetExpandedStates = () => {
    setExpandedItems([]);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetExpandedStates();
    }
  };

  return (
    <div className="lg:hidden">
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <button className="p-1 focus:outline-none focus:ring-0 active:outline-none">
            {isOpen ? (
              <X className="h-6 w-6 text-orange-500" strokeWidth={1} />
            ) : (
              <Grip
                className="h-6 w-6 text-gray-600"
                strokeWidth={1}
                fill="currentColor"
              />
            )}
          </button>
        </DrawerTrigger>

        <DrawerContent side="top" className="w-full max-h-[90vh]">
          <DrawerBody>
            <div className="px-4 py-2 space-y-1">
              {items.map((item) => (
                <NavigationItemComponent
                  key={item.label}
                  item={item}
                  locale={locale}
                  onClose={() => handleOpenChange(false)}
                />
              ))}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
