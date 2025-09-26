"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";

interface DashboardRouteGuardProps {
  children: React.ReactNode;
}

export function DashboardRouteGuard({ children }: DashboardRouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status from UserContext
    if (isAuthenticated && user) {
      setIsLoading(false);
    } else if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Show loading while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

