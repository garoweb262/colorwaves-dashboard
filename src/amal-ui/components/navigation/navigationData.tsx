import React from "react";
import {
  Home,
  Building2,
  Wifi,
  Database,
  Smartphone,
  Factory,
  Heart,
  Radio,
  Truck,
  Users,
  Briefcase,
  Target,
  Zap,
  Shield,
  Globe,
  Settings,
  BarChart3,
  Microscope,
  Newspaper,
  GraduationCap,
  Download,
  FileText,
  Award,
  Lightbulb,
  Rocket,
  BookOpen,
  Video,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Cpu,
  CircuitBoard,
  Code,
  Fuel,
  Banknote,
  Stethoscope,
  PhoneCall,
  Anchor,
  Lock,
  BookOpenCheck,
  Building,
  Zap as Lightning,
  Cog,
  ShieldCheck,
  FileCode,
  Headphones,
  Store,
  UserCheck,
  Handshake,
  LifeBuoy,
  Eye,
  Scale,
  Accessibility,
  Network,
} from "lucide-react";
import { NavigationItem } from "../../types";

export const navigationData: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
    description:
      "Explore our comprehensive product portfolio designed for modern businesses. From consumer electronics to industrial solutions, we deliver quality and innovation.",
    children: [
      {
        label: "Consumer Electronics",
        href: "/products/consumer-electronics",
        description: "Smart devices for everyday use",
        icon: React.createElement(Smartphone, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
        children: [
          {
            label: "Amal Aero Smart Gas & Smoke Detector",
            href: "/products/consumer-electronics/amal-aero-detector",
          },
          {
            label: "Mobile Phone Chargers",
            href: "/products/consumer-electronics/phone-chargers",
          },
          {
            label: "Washing Machine",
            href: "/products/consumer-electronics/washing-machine",
          },
        ],
      },
      {
        label: "Industrial Products",
        href: "/products/industrial",
        description: "Professional and industrial equipment",
        icon: React.createElement(Factory, {
          className: "h-6 w-6 text-green-600",
          strokeWidth: 1,
        }),
        children: [
          {
            label: "Industrial Gas Detector (Pipeline)",
            href: "/products/industrial/gas-detector",
          },
          {
            label: "Flow Meters",
            href: "/products/industrial/flow-meters",
          },
          {
            label: "Fire Control Panel",
            href: "/products/industrial/fire-control-panel",
          },
          {
            label: "Cylinder Monitoring Device",
            href: "/products/industrial/cylinder-monitoring",
          },
          {
            label: "Wire Twisting Machine",
            href: "/products/industrial/wire-twisting-machine",
          },
        ],
      },
      {
        label: "Smart Devices & IoT",
        href: "/products/smart-devices-iot",
        description: "Connected smart solutions",
        icon: React.createElement(Wifi, {
          className: "h-6 w-6 text-purple-600",
          strokeWidth: 1,
        }),
        children: [
          {
            label: "Smart Energy Meters",
            href: "/products/smart-devices-iot/energy-meters",
          },
          {
            label: "IMSI Catchers",
            href: "/products/smart-devices-iot/imsi-catchers",
          },
          {
            label: "Smart Irrigation Systems",
            href: "/products/smart-devices-iot/irrigation-systems",
          },
        ],
      },
      {
        label: "Medical Devices",
        href: "/products/medical-devices",
        description: "Healthcare technology solutions",
        icon: React.createElement(Heart, {
          className: "h-6 w-6 text-red-600",
          strokeWidth: 1,
        }),
        children: [
          {
            label: "Fever Detection Device",
            href: "/products/medical-devices/fever-detection",
          },
          {
            label: "Glucose Monitor Device",
            href: "/products/medical-devices/glucose-monitor",
          },
        ],
      },
      {
        label: "Utility Accessories",
        href: "/products/utility-accessories",
        description: "Essential utility solutions",
        icon: React.createElement(Settings, {
          className: "h-6 w-6 text-orange-600",
          strokeWidth: 1,
        }),
        children: [
          {
            label: "Crimp Seals (Electricity Meters)",
            href: "/products/utility-accessories/crimp-seals",
          },
          {
            label: "POS Terminals",
            href: "/products/utility-accessories/pos-terminals",
          },
        ],
      },
    ],
    downloadableContent: [
      {
        label: "Product Catalog",
        type: "PDF",
        size: "15.8 MB",
        icon: BookOpen,
        href: "/downloads/product-catalog.pdf",
      },
      {
        label: "Technical Specifications",
        type: "PDF",
        size: "3.9 MB",
        icon: FileText,
        href: "/downloads/technical-specs.pdf",
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    description:
      "Transform your business with our cutting-edge technology services. From R&D to manufacturing, we deliver innovative solutions that drive growth and efficiency.",
    children: [
      {
        label: "Research & Development",
        href: "/services/research-development",
        description: "Cutting-edge technology research",
        icon: React.createElement(Microscope, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Hardware Engineering",
        href: "/services/hardware-engineering",
        description: "Advanced hardware design and development",
        icon: React.createElement(CircuitBoard, {
          className: "h-6 w-6 text-green-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "PCB Design & Manufacturing",
        href: "/services/pcb-design-manufacturing",
        description: "Professional PCB solutions",
        icon: React.createElement(Cpu, {
          className: "h-6 w-6 text-purple-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Embedded & Software Development",
        href: "/services/embedded-software",
        description: "Custom software solutions",
        icon: React.createElement(Code, {
          className: "h-6 w-6 text-orange-600",
          strokeWidth: 1,
        }),
      },
    ],
    downloadableContent: [
      {
        label: "Services Guide",
        type: "PDF",
        size: "5.2 MB",
        icon: BookOpen,
        href: "/downloads/services-guide.pdf",
      },
      {
        label: "Case Studies",
        type: "PDF",
        size: "12.1 MB",
        icon: Award,
        href: "/downloads/case-studies.pdf",
      },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    description:
      "We serve diverse industries with tailored technology solutions. From oil & gas to healthcare, our expertise spans across multiple sectors.",
    children: [
      {
        label: "Oil & Gas",
        href: "/industries/oil-gas",
        description: "Energy sector technology solutions",
        icon: React.createElement(Fuel, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Banking & Fintech",
        href: "/industries/banking-fintech",
        description: "Financial technology solutions",
        icon: React.createElement(Banknote, {
          className: "h-6 w-6 text-green-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Healthcare",
        href: "/industries/healthcare",
        description: "Medical technology and devices",
        icon: React.createElement(Stethoscope, {
          className: "h-6 w-6 text-red-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Telecommunications",
        href: "/industries/telecommunications",
        description: "Network and communication solutions",
        icon: React.createElement(PhoneCall, {
          className: "h-6 w-6 text-purple-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Marine & Ports",
        href: "/industries/marine-ports",
        description: "Maritime technology solutions",
        icon: React.createElement(Anchor, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Defense & Security",
        href: "/industries/defense-security",
        description: "Security and defense technology",
        icon: React.createElement(Lock, {
          className: "h-6 w-6 text-gray-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Education",
        href: "/industries/education",
        description: "Educational technology solutions",
        icon: React.createElement(BookOpenCheck, {
          className: "h-6 w-6 text-indigo-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Government",
        href: "/industries/government",
        description: "Public sector technology solutions",
        icon: React.createElement(Building, {
          className: "h-6 w-6 text-gray-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Utilities & Smart Cities",
        href: "/industries/utilities-smart-cities",
        description: "Smart city infrastructure solutions",
        icon: React.createElement(Lightning, {
          className: "h-6 w-6 text-yellow-600",
          strokeWidth: 1,
        }),
      },
    ],
    downloadableContent: [
      {
        label: "Industry Solutions Guide",
        type: "PDF",
        size: "8.4 MB",
        icon: BookOpen,
        href: "/downloads/industry-solutions.pdf",
      },
      {
        label: "Industry Case Studies",
        type: "PDF",
        size: "16.7 MB",
        icon: Award,
        href: "/downloads/industry-case-studies.pdf",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about",
    description:
      "Discover our mission, values, and the people who drive innovation at AmalTech. Learn about our journey from startup to industry leader.",
    children: [
      {
        label: "About Amal",
        href: "/about/company",
        description: "Learn about our mission and values",
        icon: React.createElement(Building2, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Executives",
        href: "/about/executives",
        description: "Meet our executive team",
        icon: React.createElement(Users, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Board of Directors",
        href: "/about/board",
        description: "Our board leadership",
        icon: React.createElement(UserCheck, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Careers",
        href: "/careers",
        description: "Join our team",
        icon: React.createElement(Briefcase, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Corporate Responsibility",
        href: "/about/corporate-responsibility",
        description: "Our commitment to society",
        icon: React.createElement(Handshake, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
    ],
    downloadableContent: [
      {
        label: "Company Overview",
        type: "PDF",
        size: "2.4 MB",
        icon: Download,
        href: "/downloads/company-overview.pdf",
      },
      {
        label: "Annual Report 2023",
        type: "PDF",
        size: "8.7 MB",
        icon: FileText,
        href: "/downloads/annual-report-2023.pdf",
      },
    ],
  },
  {
    label: "News & Events",
    href: "/news-events",
    description:
      "Stay updated with the latest news, insights, and thought leadership from AmalTech. Access our press releases, blog posts, and industry analysis.",
    children: [
      {
        label: "Amal Blog",
        href: "/news-events/blog",
        description: "Expert insights and industry trends",
        icon: React.createElement(Newspaper, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Press Release",
        href: "/news-events/press",
        description: "Latest company announcements and updates",
        icon: React.createElement(FileText, {
          className: "h-6 w-6 text-green-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Events",
        href: "/news-events/events",
        description: "Conferences, webinars, and meetups",
        icon: React.createElement(Calendar, {
          className: "h-6 w-6 text-purple-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "White Papers",
        href: "/news-events/white-papers",
        description: "In-depth industry research",
        icon: React.createElement(BookOpen, {
          className: "h-6 w-6 text-orange-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Media Contacts",
        href: "/news-events/media-contacts",
        description: "Press and media inquiries",
        icon: React.createElement(Phone, {
          className: "h-6 w-6 text-red-600",
          strokeWidth: 1,
        }),
      },
    ],
    downloadableContent: [
      {
        label: "Media Kit",
        type: "ZIP",
        size: "28.5 MB",
        icon: Download,
        href: "/downloads/media-kit.zip",
      },
      {
        label: "Brand Guidelines",
        type: "PDF",
        size: "6.2 MB",
        icon: BookOpen,
        href: "/downloads/brand-guidelines.pdf",
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    description:
      "Get in touch with our team for sales inquiries, technical support, or partnership opportunities. We're here to help you succeed.",
    children: [
      {
        label: "Sales Inquiries",
        href: "/contact/sales",
        description: "Product and service inquiries",
        icon: React.createElement(Store, {
          className: "h-6 w-6 text-blue-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Technical Support",
        href: "/contact/support",
        description: "Product support and troubleshooting",
        icon: React.createElement(Headphones, {
          className: "h-6 w-6 text-green-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "Partnership",
        href: "/contact/partnership",
        description: "Business partnership opportunities",
        icon: React.createElement(Handshake, {
          className: "h-6 w-6 text-purple-600",
          strokeWidth: 1,
        }),
      },
      {
        label: "General Inquiries",
        href: "/contact/general",
        description: "General questions and information",
        icon: React.createElement(Mail, {
          className: "h-6 w-6 text-orange-600",
          strokeWidth: 1,
        }),
      },
    ],
    downloadableContent: [
      {
        label: "Contact Directory",
        type: "PDF",
        size: "1.2 MB",
        icon: Download,
        href: "/downloads/contact-directory.pdf",
      },
      {
        label: "Office Locations",
        type: "PDF",
        size: "2.8 MB",
        icon: MapPin,
        href: "/downloads/office-locations.pdf",
      },
    ],
  },
];

// Additional navigation items for footer and secondary navigation
export const footerNavigation = [
  {
    label: "About Us",
    children: [
      { label: "About Amal", href: "/about/company" },
      { label: "Executives", href: "/about/executives" },
      { label: "Board of Directors", href: "/about/board" },
      {
        label: "Corporate Responsibility",
        href: "/about/corporate-responsibility",
      },
    ],
  },
  {
    label: "Careers",
    children: [
      { label: "Job Listings", href: "/careers" },
      { label: "Internship Program", href: "/careers/internships" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { label: "Blog", href: "/news-events/blog" },
      { label: "Press Release", href: "/news-events/press" },
      { label: "White Papers", href: "/news-events/white-papers" },
      { label: "Events", href: "/news-events/events" },
      { label: "Media", href: "/news-events/media-contacts" },
    ],
  },
  {
    label: "Partners",
    children: [
      { label: "Distributor Program", href: "/partners/distributors" },
      { label: "Reseller Program", href: "/partners/resellers" },
      { label: "Partner Support", href: "/partners/support" },
    ],
  },
  {
    label: "Support",
    children: [
      { label: "Quality Management", href: "/support/quality" },
      { label: "Regulatory Info", href: "/support/regulatory" },
      { label: "Technical Resources", href: "/support/technical" },
      { label: "Contact Us", href: "/contact/support" },
    ],
  },
];

// Legal and policy links
export const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy",
    description: "How we protect your data",
  },
  {
    label: "Terms of Use",
    href: "/terms",
    description: "Our service agreement terms",
  },
  {
    label: "Cookie Policy",
    href: "/cookies",
    description: "How we use cookies",
  },
  {
    label: "Accessibility",
    href: "/accessibility",
    description: "Accessibility statement",
  },
  {
    label: "Sitemap",
    href: "/sitemap",
    description: "Site navigation map",
  },
];

// Filter links for the footer or secondary navigation (keeping for backward compatibility)
export const filterLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy",
    description: "How we protect your data",
  },
  {
    label: "Terms of Service",
    href: "/terms",
    description: "Our service agreement terms",
  },
  {
    label: "Cookie Policy",
    href: "/cookies",
    description: "How we use cookies",
  },
];
