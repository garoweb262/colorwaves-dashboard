"use client";
import React from "react";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Users,
  Settings,
  MessageSquare,
  HelpCircle,
  Newspaper,
  BookOpen,
  Mail,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: Omit<MenuItem, "children">[];
  roles: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export const roles: Role[] = [
  {
    id: "super-admin",
    name: "Super Administrator",
    description: "Full access to all features and settings"
  },
  {
    id: "admin",
    name: "Administrator",
    description: "Administrative access to most features"
  },
  {
    id: "brand",
    name: "Brand Manager",
    description: "Manage brand content, marketing, and partnerships"
  },
  {
    id: "sales",
    name: "Sales Manager",
    description: "Manage sales, orders, and customer relationships"
  },
  {
    id: "support",
    name: "Support",
    description: "Customer support and basic content management"
  }
];

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand", "sales", "support"]
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["super-admin", "admin"]
  },
  {
    title: "Services",
    href: "/services",
    icon: <Settings className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand"]
  },
  {
    title: "Website Contents",
    href: "/website-contents",
    icon: <FileText className="h-5 w-5" />,
    children: [
      { title: "Projects", href: "/projects", icon: <FileText className="h-4 w-4" />, roles: ["super-admin", "admin", "brand"] },
     { title: "Team", href: "/team", icon: <Users className="h-4 w-4" />, roles: ["super-admin", "admin", "brand"] },
    ],
    roles: ["super-admin", "admin", "brand"]
  },
  {
    title: "Project Requests",
    href: "/project-requests",
    icon: <FileText className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand"]
  },
  {
    title: "Contact Messages",
    href: "/contact-messages",
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand"]
  },
  {
    title: "Partnership Requests",
    href: "/partnership-requests",
    icon: <Users className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand"]
  },
  {
    title: "Newsletter",
    href: "/newsletter",
    icon: <Mail className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand", "sales", "support"]
  },
  // {
  //   title: "Careers",
  //   href: "/careers",
  //   icon: <Users className="h-5 w-5" />,
  //   roles: ["super-admin", "admin", "brand"]
  // },
  // {
  //   title: "Departments",
  //   href: "/departments",
  //   icon: <Database className="h-5 w-5" />,
  //   roles: ["super-admin", "admin", "brand"]
  // },
  // {
  //   title: "Applications",
  //   href: "/applications",
  //   icon: <FileText className="h-5 w-5" />,
  //   roles: ["super-admin", "admin", "brand"]
  // },
  // {
  //   title: "News",
  //   href: "/news",
  //   icon: <Newspaper className="h-5 w-5" />,
  //   roles: ["super-admin", "admin", "brand"]
  // },
  {
    title: "Blog",
    href: "/blog",
    icon: <BookOpen className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand"]
  },
  {
    title: "Products",
    href: "/products",
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ["super-admin", "admin", "brand", "sales"]
  },
  { title: "Testimonies", href: "/testimonies", icon: <MessageSquare className="h-4 w-4" />, roles: ["super-admin", "admin", "brand"] },
  { title: "FAQs", href: "/faqs", icon: <HelpCircle className="h-4 w-4" />, roles: ["super-admin", "admin", "brand"] },

];

export function getMenuItemsForRole(userRole: string): MenuItem[] {
  return menuItems.filter(item => 
    item.roles.includes(userRole) || item.roles.includes("super-admin")
  );
}

export function hasAccess(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole) || requiredRoles.includes("super-admin");
}
