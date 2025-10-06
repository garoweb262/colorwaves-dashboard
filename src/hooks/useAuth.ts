"use client";

import { useUser } from "@/contexts/UserContext";

export function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    token, 
    hasRole, 
    hasAnyRole, 
    logout 
  } = useUser();

  return {
    user,
    isAuthenticated,
    token,
    hasRole,
    hasAnyRole,
    logout,
    // Convenience methods
    isSuperAdmin: hasRole("super_admin"),
    isAdmin: hasAnyRole(["super_admin", "admin"]),
    isUser: hasAnyRole(["user", "admin", "super_admin"]),
  };
}
