"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function HeadingLink({
  href,
  children,
  className = "",
}: HeadingLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-flex items-center space-x-1 text-sm font-medium transition-colors hover:text-amaltech-orange ${
        isActive ? "text-amaltech-orange" : "text-amaltech-gray-600"
      } ${className}`}
    >
      <span>{children}</span>
      <motion.div
        animate={{ rotate: isActive ? 90 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1} />
      </motion.div>
    </Link>
  );
}
