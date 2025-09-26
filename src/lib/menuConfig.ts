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
  { id: "super_admin", name: "Super Administrator", description: "Full access to all features and settings" },
  { id: "admin", name: "Administrator", description: "Access to most features with some restrictions" },
  { id: "content_manager", name: "Content Manager", description: "Manage website content and media" },
  { id: "editor", name: "Editor", description: "Create and edit content" },
  { id: "viewer", name: "Viewer", description: "View-only access to dashboard" }
];

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ["super_admin", "admin", "content_manager", "editor", "viewer"]
  },
  {
    title: "Website Content",
    href: "/content",
    icon: <FileText className="h-5 w-5" />,
    children: [
      { title: "Pages", href: "/content/pages", icon: <FileText className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager", "editor"] },
      { title: "Posts", href: "/content/posts", icon: <FileText className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager", "editor"] },
      { title: "Media", href: "/content/media", icon: <Image className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager", "editor"] },
      { title: "Templates", href: "/content/templates", icon: <FileText className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
    ],
    roles: ["super_admin", "admin", "content_manager", "editor"]
  },
  {
    title: "E-commerce",
    href: "/ecommerce",
    icon: <ShoppingCart className="h-5 w-5" />,
    children: [
      { title: "Products", href: "/ecommerce/products", icon: <ShoppingCart className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
      { title: "Orders", href: "/ecommerce/orders", icon: <ShoppingCart className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Customers", href: "/ecommerce/customers", icon: <Users className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Inventory", href: "/ecommerce/inventory", icon: <Database className="h-4 w-4" />, roles: ["super_admin", "admin"] },
    ],
    roles: ["super_admin", "admin"]
  },
  {
    title: "Partners",
    href: "/partners",
    icon: <Users className="h-5 w-5" />,
    children: [
      { title: "Partner List", href: "/partners/list", icon: <Users className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Applications", href: "/partners/applications", icon: <FileText className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Commissions", href: "/partners/commissions", icon: <BarChart3 className="h-4 w-4" />, roles: ["super_admin", "admin"] },
    ],
    roles: ["super_admin", "admin"]
  },
  {
    title: "Users & Security",
    href: "/users",
    icon: <Shield className="h-5 w-5" />,
    children: [
      { title: "User Management", href: "/users", icon: <Users className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Roles & Permissions", href: "/users/roles", icon: <Shield className="h-4 w-4" />, roles: ["super_admin"] },
      { title: "Security Settings", href: "/users/security", icon: <Shield className="h-4 w-4" />, roles: ["super_admin"] },
    ],
    roles: ["super_admin", "admin"]
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      { title: "Overview", href: "/analytics", icon: <BarChart3 className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
      { title: "Traffic", href: "/analytics/traffic", icon: <BarChart3 className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
      { title: "Sales", href: "/analytics/sales", icon: <BarChart3 className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Reports", href: "/analytics/reports", icon: <FileText className="h-4 w-4" />, roles: ["super_admin", "admin"] },
    ],
    roles: ["super_admin", "admin", "content_manager"]
  },
  {
    title: "Marketing",
    href: "/marketing",
    icon: <MessageSquare className="h-5 w-5" />,
    children: [
      { title: "Campaigns", href: "/marketing/campaigns", icon: <MessageSquare className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
      { title: "Email Marketing", href: "/marketing/email", icon: <Mail className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
      { title: "Social Media", href: "/marketing/social", icon: <MessageSquare className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager"] },
    ],
    roles: ["super_admin", "admin", "content_manager"]
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    children: [
      { title: "General", href: "/settings/general", icon: <Settings className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Appearance", href: "/settings/appearance", icon: <Palette className="h-4 w-4" />, roles: ["super_admin", "admin"] },
      { title: "Integrations", href: "/settings/integrations", icon: <Database className="h-4 w-4" />, roles: ["super_admin"] },
      { title: "Backup", href: "/settings/backup", icon: <Database className="h-4 w-4" />, roles: ["super_admin"] },
    ],
    roles: ["super_admin", "admin"]
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: <HelpCircle className="h-5 w-5" />,
    children: [
      { title: "Documentation", href: "/help/docs", icon: <FileText className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager", "editor", "viewer"] },
      { title: "FAQ", href: "/help/faq", icon: <HelpCircle className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager", "editor", "viewer"] },
      { title: "Contact Support", href: "/help/contact", icon: <MessageSquare className="h-4 w-4" />, roles: ["super_admin", "admin", "content_manager", "editor", "viewer"] },
    ],
    roles: ["super_admin", "admin", "content_manager", "editor", "viewer"]
  }
];

export function getMenuItemsForRole(userRole: string): MenuItem[] {
  return menuItems.filter(item =>
    item.roles.includes(userRole) || item.roles.includes("super_admin")
  );
}

export function hasAccess(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole) || requiredRoles.includes("super_admin");
}
