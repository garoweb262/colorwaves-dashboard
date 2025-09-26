"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MobileNavigation,
  navigationData,
  NavigationMenu,
  Search,
} from "@/amal-ui";
import { ContactSheet } from "@/components/ContactSheet";
import { SearchIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { scrollY } = useScroll();

  const headerY = useTransform(scrollY, [0, 100], [0, -100]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchToggle = (isOpen: boolean) => {
    setIsSearchOpen(isOpen);
  };

  const handleSubmenuChange = (label: string | null) => {
    // Always set active submenu for hover effects (orange tab bar)
    setActiveSubmenu(label);
  };

  return (
    <>
      <motion.header
        style={{
          y: headerY,
          opacity: headerOpacity,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-neutral-300"
            : "bg-white"
        }`}
      >
        <div className="flex items-center px-3 md:px-6 lg:pl-8 lg:pr-0 justify-between h-[70px] lg:h-[90px] relative">
          {/* Bottom border for header */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200"></div>
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-gray-900"
            >
              AmalTech
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu
            items={navigationData}
            locale={locale}
            activeSubmenu={activeSubmenu}
            onSubmenuChange={handleSubmenuChange}
          />

          {/* Search and Mobile Navigation */}
          <div className="flex items-center space-x-2 h-full">
            {/* Search Button */}
            <button
              onClick={() => handleSearchToggle(!isSearchOpen)}
              className="p-1 rounded-lg transition-colors hover:text-amaltech-orange h-full"
            >
              <SearchIcon
                className="h-5 w-5 text-neutral-600 hover:text-amaltech-orange"
                strokeWidth={1}
              />
            </button>

            {/* Mobile Navigation */}
            <MobileNavigation items={navigationData} locale={locale} />

            {/* Contact Drawer */}
            <ContactSheet locale={locale} />
          </div>
        </div>

        {/* Full-Width Dropdown Content - Positioned relative to header */}
        {activeSubmenu &&
          (() => {
            const activeItem = navigationData.find(
              (item) => item.label === activeSubmenu
            );
            return activeItem &&
              activeItem.children &&
              activeItem.children.length > 0 ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.1, 1],
                    staggerChildren: 0.1,
                  }}
                  className="w-full bg-white border-b border-gray-200 shadow-sm z-40 overflow-hidden"
                  onMouseEnter={() => {}} // Keep menu open when hovering dropdown
                  onMouseLeave={() => handleSubmenuChange(null)} // Close when leaving dropdown area
                >
                  {/* 3-Column Layout */}
                  <div className="grid grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">
                    {/* Column 1: Description */}
                    <div className="space-y-4">
                      <p className="text-gray-600 uppercase leading-relaxed">
                        {
                          navigationData.find(
                            (item) => item.label === activeSubmenu
                          )?.description
                        }
                      </p>
                    </div>

                    {/* Column 2: Sub-links */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {navigationData
                          .find((item) => item.label === activeSubmenu)
                          ?.children?.map((subItem, index) => (
                            <motion.div
                              key={subItem.label}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                ease: "easeOut",
                              }}
                            >
                              <Link
                                href={`/${locale}${subItem.href}`}
                                className="group block p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900 group-hover:text-amaltech-orange transition-colors">
                                    {subItem.label}
                                  </span>
                                  <ArrowRight
                                    className="h-4 w-4 text-gray-400 group-hover:text-amaltech-orange transition-colors"
                                    strokeWidth={1}
                                  />
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                      </div>
                    </div>

                    {/* Column 3: Downloadable Content */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {navigationData
                          .find((item) => item.label === activeSubmenu)
                          ?.downloadableContent?.map((content, index) => (
                            <motion.div
                              key={content.label}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                ease: "easeOut",
                              }}
                            >
                              <Link
                                href={content.href}
                                className="group block p-4 rounded-lg border border-gray-200 hover:border-amaltech-orange hover:bg-orange-50 transition-all duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-amaltech-orange transition-colors">
                                    <Download className="h-5 w-5 text-orange-600 group-hover:text-white transition-colors" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900 group-hover:text-amaltech-orange transition-colors truncate">
                                      {content.label}
                                    </h5>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                      <span>{content.type}</span>
                                      <span>•</span>
                                      <span>{content.size}</span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null;
          })()}

        {/* Search Bar */}
        <Search
          onClose={() => handleSearchToggle(false)}
          isOpen={isSearchOpen}
        />
      </motion.header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
