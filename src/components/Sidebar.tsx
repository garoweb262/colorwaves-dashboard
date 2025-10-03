"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/amal-ui";
import { ChevronRight, ChevronLeft, LogOut } from "lucide-react";
import { getMenuItemsForRole, type MenuItem } from "@/lib/menuConfig";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userRole?: string;
}

export function Sidebar({ isCollapsed, onToggle, userRole = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { logout } = useUser();
  const router = useRouter();

  // Get menu items based on user role
  const menuItems = getMenuItemsForRole(userRole);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (children: MenuItem["children"]) => {
    return children?.some(child => pathname === child.href) || false;
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 70 : 280,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col relative shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
         <Image src="/images/logo/ColorWaves_Logo Horizontal Black.png" alt="ColorWaves Logo" width={150} height={50} />
          </motion.div>
        )}
        
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.title);
            const isItemActive = isActive(item.href) || isChildActive(item.children);

            return (
              <li key={item.title}>
                {hasChildren ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50",
                        isItemActive && "bg-blue-50 text-blue-700 border border-blue-200",
                        !isCollapsed && "justify-between"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={cn(
                          "text-gray-600 transition-colors",
                          isItemActive && "text-blue-600"
                        )}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className={cn(
                            "font-medium text-gray-700",
                            isItemActive && "text-blue-700"
                          )}>{item.title}</span>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-400"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {isExpanded && !isCollapsed && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 mt-1 space-y-1"
                        >
                          {item.children?.map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center space-x-3 p-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50",
                                  isActive(child.href) && "bg-blue-50 text-blue-700 border border-blue-200"
                                )}
                              >
                                <span className={cn(
                                  "text-gray-500",
                                  isActive(child.href) && "text-blue-600"
                                )}>
                                  {child.icon}
                                </span>
                                <span className={cn(
                                  "text-gray-700",
                                  isActive(child.href) && "text-blue-700"
                                )}>{child.title}</span>
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-gray-50",
                      isItemActive && "bg-blue-50 text-blue-700 border border-blue-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "text-gray-600 transition-colors",
                        isItemActive && "text-blue-600"
                      )}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className={cn(
                          "font-medium text-gray-700",
                          isItemActive && "text-blue-700"
                        )}>{item.title}</span>
                      )}
                    </div>
                    
                    {!isCollapsed && item.badge && (
                      <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer with Logout */}
      {!isCollapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t border-gray-200"
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-red-50 text-red-600 hover:text-red-700 hover:border hover:border-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Logout</span>
          </button>
        </motion.div>
      ) : (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg transition-all duration-200 hover:bg-red-50 text-red-600 hover:text-red-700 flex items-center justify-center"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.aside>
  );
}
