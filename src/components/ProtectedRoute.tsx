"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackPath = "/" 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, hasAnyRole } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        router.push(fallbackPath);
        return;
      }

      if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        console.log("User doesn't have required role, redirecting to dashboard");
        router.push("/dashboard");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRoles, hasAnyRole, router, fallbackPath]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or doesn't have required role
  if (!isAuthenticated || (requiredRoles.length > 0 && !hasAnyRole(requiredRoles))) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[],
  fallbackPath?: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRoles={requiredRoles} fallbackPath={fallbackPath}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
