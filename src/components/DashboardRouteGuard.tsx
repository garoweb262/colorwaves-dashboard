"use client";

import { ProtectedRoute } from "./ProtectedRoute";

interface DashboardRouteGuardProps {
  children: React.ReactNode;
}

export function DashboardRouteGuard({ children }: DashboardRouteGuardProps) {
  return (
    <ProtectedRoute fallbackPath="/login">
      {children}
    </ProtectedRoute>
  );
}

