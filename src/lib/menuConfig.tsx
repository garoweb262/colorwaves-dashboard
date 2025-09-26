import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Users,
  Shield,
  BarChart3,
  Settings,
  Image,
  Calendar,
  MessageSquare,
  Database,
  Palette,
  HelpCircle,
  ChevronRight,
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
    id: "admin",
    name: "Super Administrator",
    description: "Full access to all features and settings"
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
  }
];

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["admin", "brand", "sales"]
  },
  {
    title: "Website Content",
    href: "/content",
    icon: <FileText className="h-5 w-5" />,
    children: [
      { title: "Pages", href: "/content/pages", icon: <FileText className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "Posts", href: "/content/posts", icon: <FileText className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "Media", href: "/content/media", icon: <Image className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "Templates", href: "/content/templates", icon: <FileText className="h-4 w-4" />, roles: ["admin"] },
    ],
    roles: ["admin", "brand"]
  },
  {
    title: "E-commerce",
    href: "/ecommerce",
    icon: <ShoppingCart className="h-5 w-5" />,
    children: [
      { title: "Products", href: "/ecommerce/products", icon: <ShoppingCart className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "Orders", href: "/ecommerce/orders", icon: <FileText className="h-4 w-4" />, roles: ["admin", "sales"] },
      { title: "Inventory", href: "/ecommerce/inventory", icon: <Database className="h-4 w-4" />, roles: ["admin", "sales"] },
      { title: "Analytics", href: "/ecommerce/analytics", icon: <BarChart3 className="h-4 w-4" />, roles: ["admin", "sales"] },
    ],
    roles: ["admin", "brand", "sales"]
  },
  {
    title: "Partners",
    href: "/partners",
    icon: <Users className="h-5 w-5" />,
    children: [
      { title: "Partner List", href: "/partners/list", icon: <Users className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "Applications", href: "/partners/applications", icon: <FileText className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "Analytics", href: "/partners/analytics", icon: <BarChart3 className="h-4 w-4" />, roles: ["admin", "brand"] },
    ],
    roles: ["admin", "brand"]
  },
  {
    title: "Users & Security",
    href: "/users",
    icon: <Shield className="h-5 w-5" />,
    children: [
      { title: "User Management", href: "/users/management", icon: <Users className="h-4 w-4" />, roles: ["admin"] },
      { title: "Roles & Permissions", href: "/users/roles", icon: <Shield className="h-4 w-4" />, roles: ["admin"] },
      { title: "Security Settings", href: "/users/security", icon: <Shield className="h-4 w-4" />, roles: ["admin"] },
      { title: "Audit Logs", href: "/users/audit", icon: <FileText className="h-4 w-4" />, roles: ["admin"] },
    ],
    roles: ["admin"]
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      { title: "Website Analytics", href: "/analytics/website", icon: <BarChart3 className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "User Analytics", href: "/analytics/users", icon: <Users className="h-4 w-4" />, roles: ["admin"] },
      { title: "Content Analytics", href: "/analytics/content", icon: <FileText className="h-4 w-4" />, roles: ["admin", "brand"] },
      { title: "E-commerce Analytics", href: "/analytics/ecommerce", icon: <ShoppingCart className="h-4 w-4" />, roles: ["admin", "sales"] },
    ],
    roles: ["admin", "brand", "sales"]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    children: [
      { title: "General Settings", href: "/settings/general", icon: <Settings className="h-4 w-4" />, roles: ["admin"] },
      { title: "Appearance", href: "/settings/appearance", icon: <Palette className="h-4 w-4" />, roles: ["admin"] },
      { title: "Integrations", href: "/settings/integrations", icon: <Database className="h-4 w-4" />, roles: ["admin"] },
      { title: "Backup & Restore", href: "/settings/backup", icon: <Database className="h-4 w-4" />, roles: ["admin"] },
    ],
    roles: ["admin"]
  }
];

export function getMenuItemsForRole(userRole: string): MenuItem[] {
  return menuItems.filter(item => 
    item.roles.includes(userRole) || item.roles.includes("admin")
  );
}

export function hasAccess(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole) || requiredRoles.includes("admin");
}
