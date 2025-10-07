"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { StatisticsCard } from "@/components/StatisticsCard";
import { Button } from "@/amal-ui";
import { statisticsAPI } from "@/lib/api";
import {
  Users,
  FileText,
  Newspaper,
  MessageSquare,
  Briefcase,
  Handshake,
  Mail,
  TrendingUp,
  BarChart3,
  Activity,
  Eye,
} from "lucide-react";


export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const breadcrumbs = [{ label: "Dashboard" }];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await statisticsAPI.getDashboardStatistics();
        
        if (result.success && result.data) {
          setDashboardStats(result.data.data);
        } else {
          setError(result.message || "Failed to fetch dashboard statistics");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching dashboard statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Key metrics for dashboard
  const keyMetrics = dashboardStats ? [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: dashboardStats.activeUsers,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Content",
      value: dashboardStats.totalBlogs + dashboardStats.totalNews,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Newsletter Subscribers",
      value: dashboardStats.totalNewsletterSubscribers,
      icon: Mail,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ] : [];

  // Request metrics
  const requestMetrics = dashboardStats ? [
    {
      title: "Contact Messages",
      value: dashboardStats.totalContactMessages,
      pending: dashboardStats.pendingContactMessages,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Project Requests",
      value: dashboardStats.totalProjectRequests,
      pending: dashboardStats.pendingProjectRequests,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Partnership Requests",
      value: dashboardStats.totalPartnershipRequests,
      pending: dashboardStats.pendingPartnershipRequests,
      icon: Handshake,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Pending",
      value: dashboardStats.pendingContactMessages + dashboardStats.pendingProjectRequests + dashboardStats.pendingPartnershipRequests,
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ] : [];

  if (error) {
    return (
      <DashboardRouteGuard>
        <DashboardLayout breadcrumbs={breadcrumbs}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </DashboardLayout>
      </DashboardRouteGuard>
    );
  }

  return (
    <DashboardRouteGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
           
          </div>

          {/* Key Metrics Cards */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <StatisticsCard
                key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  icon={metric.icon}
                  color={metric.color}
                  bgColor={metric.bgColor}
                  isLoading={isLoading}
                />
              ))}
                </div>
          </div>

          {/* Request Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requests & Messages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {requestMetrics.map((metric, index) => (
                <StatisticsCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  change={metric.pending ? `${metric.pending} pending` : undefined}
                  changeType={metric.pending > 0 ? "negative" : "neutral"}
                  icon={metric.icon}
                  color={metric.color}
                  bgColor={metric.bgColor}
                  isLoading={isLoading}
                />
                  ))}
                </div>
          </div>

        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
