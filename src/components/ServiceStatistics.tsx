"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatisticsCard } from "./StatisticsCard";
import { statisticsAPI } from "@/lib/api";
import { 
  Users, 
  FileText, 
  Newspaper, 
  MessageSquare, 
  Briefcase, 
  Handshake, 
  Mail, 
  HelpCircle, 
  FolderOpen, 
  Star,
  TrendingUp,
  Activity
} from "lucide-react";

interface ServiceStatisticsProps {
  serviceName: string;
  className?: string;
}

const serviceConfig = {
  users: {
    title: "Users",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    metrics: [
      { key: "total", label: "Total Users", color: "text-blue-600", bgColor: "bg-blue-50" },
      { key: "active", label: "Active Users", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "inactive", label: "Inactive Users", color: "text-gray-600", bgColor: "bg-gray-50" },
    ]
  },
  blogs: {
    title: "Blogs",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    metrics: [
      { key: "total", label: "Total Blogs", color: "text-purple-600", bgColor: "bg-purple-50" },
      { key: "published", label: "Published", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "draft", label: "Drafts", color: "text-orange-600", bgColor: "bg-orange-50" },
      { key: "featured", label: "Featured", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    ]
  },
  news: {
    title: "News",
    icon: Newspaper,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    metrics: [
      { key: "total", label: "Total News", color: "text-indigo-600", bgColor: "bg-indigo-50" },
      { key: "published", label: "Published", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "draft", label: "Drafts", color: "text-orange-600", bgColor: "bg-orange-50" },
      { key: "featured", label: "Featured", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    ]
  },
  "contact-messages": {
    title: "Contact Messages",
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-50",
    metrics: [
      { key: "total", label: "Total Messages", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "pending", label: "Pending", color: "text-orange-600", bgColor: "bg-orange-50" },
      { key: "replied", label: "Replied", color: "text-blue-600", bgColor: "bg-blue-50" },
      { key: "accepted", label: "Accepted", color: "text-green-600", bgColor: "bg-green-50" },
    ]
  },
  "project-requests": {
    title: "Project Requests",
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    metrics: [
      { key: "total", label: "Total Requests", color: "text-blue-600", bgColor: "bg-blue-50" },
      { key: "pending", label: "Pending", color: "text-orange-600", bgColor: "bg-orange-50" },
      { key: "accepted", label: "Accepted", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "replied", label: "Replied", color: "text-purple-600", bgColor: "bg-purple-50" },
    ]
  },
  "partnership-requests": {
    title: "Partnership Requests",
    icon: Handshake,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    metrics: [
      { key: "total", label: "Total Requests", color: "text-purple-600", bgColor: "bg-purple-50" },
      { key: "pending", label: "Pending", color: "text-orange-600", bgColor: "bg-orange-50" },
      { key: "accepted", label: "Accepted", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "replied", label: "Replied", color: "text-blue-600", bgColor: "bg-blue-50" },
    ]
  },
  services: {
    title: "Services",
    icon: Activity,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    metrics: [
      { key: "total", label: "Total Services", color: "text-teal-600", bgColor: "bg-teal-50" },
      { key: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "inactive", label: "Inactive", color: "text-gray-600", bgColor: "bg-gray-50" },
    ]
  },
  products: {
    title: "Products",
    icon: FolderOpen,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    metrics: [
      { key: "total", label: "Total Products", color: "text-orange-600", bgColor: "bg-orange-50" },
      { key: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "inactive", label: "Inactive", color: "text-gray-600", bgColor: "bg-gray-50" },
    ]
  },
  projects: {
    title: "Projects",
    icon: FolderOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    metrics: [
      { key: "total", label: "Total Projects", color: "text-indigo-600", bgColor: "bg-indigo-50" },
      { key: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "inactive", label: "Inactive", color: "text-gray-600", bgColor: "bg-gray-50" },
    ]
  },
  testimonies: {
    title: "Testimonies",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    metrics: [
      { key: "total", label: "Total Testimonies", color: "text-yellow-600", bgColor: "bg-yellow-50" },
      { key: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "inactive", label: "Inactive", color: "text-gray-600", bgColor: "bg-gray-50" },
    ]
  },
  faqs: {
    title: "FAQs",
    icon: HelpCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    metrics: [
      { key: "total", label: "Total FAQs", color: "text-gray-600", bgColor: "bg-gray-50" },
      { key: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "inactive", label: "Inactive", color: "text-gray-600", bgColor: "bg-gray-50" },
    ]
  },
  newsletter: {
    title: "Newsletter",
    icon: Mail,
    color: "text-red-600",
    bgColor: "bg-red-50",
    metrics: [
      { key: "total", label: "Total Subscribers", color: "text-red-600", bgColor: "bg-red-50" },
      { key: "active", label: "Active", color: "text-green-600", bgColor: "bg-green-50" },
      { key: "verified", label: "Verified", color: "text-blue-600", bgColor: "bg-blue-50" },
    ]
  },
};

export const ServiceStatistics: React.FC<ServiceStatisticsProps> = ({
  serviceName,
  className = "",
}) => {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = serviceConfig[serviceName as keyof typeof serviceConfig];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await statisticsAPI.getServiceStatistics(serviceName);
        
        if (result.success && result.data) {
          setStatistics(result.data.data);
        } else {
          setError(result.message || "Failed to fetch statistics");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching service statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [serviceName]);

  if (!config) {
    return null;
  }

  if (error) {
    return (
      <div className={`bg-red-500/20 border border-red-400/30 rounded-lg p-4 ${className}`}>
        <p className="text-red-300 text-sm">Failed to load statistics: {error}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <config.icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <h2 className="text-lg font-semibold text-white">{config.title} Statistics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.metrics.map((metric, index) => (
          <StatisticsCard
            key={metric.key}
            title={metric.label}
            value={statistics?.[metric.key] || 0}
            icon={TrendingUp}
            color={metric.color}
            bgColor={metric.bgColor}
            isLoading={isLoading}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};
