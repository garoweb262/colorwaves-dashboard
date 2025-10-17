"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./UserContext";
import { setGlobalLogoutHandler } from "@/lib/api";

interface LogoutContextType {
  showLogoutModal: (message?: string) => void;
  hideLogoutModal: () => void;
  isLogoutModalOpen: boolean;
  logoutMessage: string;
  handleLogout: () => void;
}

const LogoutContext = createContext<LogoutContextType | undefined>(undefined);

interface LogoutProviderProps {
  children: ReactNode;
}

export function LogoutProvider({ children }: LogoutProviderProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const { logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Set up the global logout handler for API interceptor
  useEffect(() => {
    setGlobalLogoutHandler(showLogoutModal);
  }, []);

  const showLogoutModal = (message?: string) => {
    // Don't show logout modal on authentication-related pages
    const authRoutes = [
      '/',
      '/login',
      '/forgot-password',
      '/verify-otp',
      '/reset-password',
      '/get-started'
    ];
    
    // Check for both direct routes and locale-based routes (e.g., /en/login, /ar/login)
    const isAuthRoute = authRoutes.some(route => {
      return pathname === route || 
             pathname.startsWith(route) ||
             pathname.match(/^\/[a-z]{2}\/(login|forgot-password|verify-otp|reset-password|get-started)/);
    });
    
    if (isAuthRoute) {
      return;
    }
    
    setLogoutMessage(message || "Your session has expired. Please log in again to continue.");
    setIsLogoutModalOpen(true);
  };

  const hideLogoutModal = () => {
    setIsLogoutModalOpen(false);
    setLogoutMessage("");
  };

  const handleLogout = () => {
    // Clear all localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    
    // Call the logout function from UserContext
    logout();
    
    // Redirect to home page
    router.push('/');
  };

  const value: LogoutContextType = {
    showLogoutModal,
    hideLogoutModal,
    isLogoutModalOpen,
    logoutMessage,
    handleLogout,
  };

  return (
    <LogoutContext.Provider value={value}>
      {children}
      {/* Include the LogoutModal directly in the provider */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border border-gray-200">
            <div className="text-center p-6">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Session Expired
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-500 mb-6">
                {logoutMessage}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LogoutContext.Provider>
  );
}

export function useLogout() {
  const context = useContext(LogoutContext);
  if (context === undefined) {
    throw new Error("useLogout must be used within a LogoutProvider");
  }
  return context;
}
