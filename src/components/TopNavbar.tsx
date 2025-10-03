"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumb } from "./Breadcrumb";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/amal-ui";

interface TopNavbarProps {
  onMenuToggle: () => void;
  isSidebarCollapsed: boolean;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function TopNavbar({ onMenuToggle, isSidebarCollapsed, breadcrumbs = [] }: TopNavbarProps) {
  const { user, logout } = useUser();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "New user registered",
      message: "John Doe has joined the platform",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Content published",
      message: "New blog post has been published",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      message: "System maintenance completed",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode logic here
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left section */}
      <div className="flex items-center space-x-6">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} />

        

        {/* Mobile search toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
        >
          <Search className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-600" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications dropdown */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer",
                        notification.unread && "bg-blue-50"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user?.avatar || "U"}</span>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User"}
            </span>
          </button>

          {/* User dropdown */}
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                  <p className="text-xs text-blue-600 font-medium capitalize">{user?.role || "user"}</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="absolute top-20 left-4 right-4" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
