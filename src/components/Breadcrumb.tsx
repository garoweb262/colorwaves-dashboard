"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/amal-ui";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-gray-600", className)}>
      <Link
        href="/dashboard"
        className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Admin</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
