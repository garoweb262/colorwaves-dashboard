"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { roles } from "@/lib/menuConfig";
import { ChevronDown, User, Check } from "lucide-react";

export function RoleSwitcher() {
  const { user, switchRole, currentRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:block">{currentRole?.name || "Unknown Role"}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Switch Role</h3>
              <p className="text-xs text-gray-500">Current: {currentRole?.name}</p>
            </div>
            
            <div className="py-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    switchRole(role.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-gray-500">{role.description}</div>
                  </div>
                  {user.role === role.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                This is for testing purposes only. In production, roles are managed by administrators.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
