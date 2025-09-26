"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { Button } from "@/amal-ui";
import {
  Eye,
  DollarSign,
  Package,
  FileText,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// Mock data for the dashboard
const metrics = [
  {
    title: "Total Pageviews",
    value: "45,231",
    change: "+20.1%",
    changeType: "positive",
    icon: <Eye className="h-6 w-6 text-blue-600" />,
    color: "bg-blue-50",
  },
  {
    title: "Today's Sales",
    value: "$23,450",
    change: "+15.3%",
    changeType: "positive",
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    color: "bg-green-50",
  },
  {
    title: "Pending Orders",
    value: "17",
    change: "+3 since this morning",
    changeType: "negative",
    icon: <Package className="h-6 w-6 text-orange-600" />,
    color: "bg-orange-50",
  },
  {
    title: "New Form Submissions",
    value: "73",
    change: "+12 from last week",
    changeType: "negative",
    icon: <FileText className="h-6 w-6 text-purple-600" />,
    color: "bg-purple-50",
  },
];

// Mock data for the weekly pageviews chart
const weeklyPageviews = [
  { day: "Mon", value: 2000 },
  { day: "Tue", value: 1000 },
  { day: "Wed", value: 9500 },
  { day: "Thu", value: 3500 },
  { day: "Fri", value: 4800 },
  { day: "Sat", value: 3500 },
  { day: "Sun", value: 4200 },
];

// Mock data for revenue breakdown
const revenueBreakdown = [
  { category: "Product Sales", value: 65, color: "bg-purple-500" },
  { category: "Services", value: 25, color: "bg-green-400" },
  { category: "Subscriptions", value: 10, color: "bg-yellow-400" },
];

export default function DashboardPage() {
  const breadcrumbs = [{ label: "Dashboard" }];

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
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<BarChart3 className="h-4 w-4" />}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              View Full Report
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                  <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    {metric.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {metric.value}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      metric.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Pageviews Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Weekly Pageviews
                </h3>
                <p className="text-gray-600 text-sm">
                  Your website traffic over the last 7 days
                </p>
                </div>
              
              {/* Chart Container */}
              <div className="h-64 flex items-end justify-between space-x-2">
                {weeklyPageviews.map((item, index) => {
                  const maxValue = Math.max(...weeklyPageviews.map(w => w.value));
                  const height = (item.value / maxValue) * 100;
                  
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t-lg relative">
                        <div
                          className="bg-purple-500 rounded-t-lg transition-all duration-500 ease-out"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 mt-2">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Y-axis labels */}
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0</span>
                <span>2,500</span>
                <span>5,000</span>
                <span>7,500</span>
                <span>10,000</span>
                </div>
            </motion.div>

            {/* Revenue Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Revenue Breakdown
                </h3>
                <p className="text-gray-600 text-sm">
                  Sales by category this month
                </p>
              </div>
              
              {/* Donut Chart */}
              <div className="flex items-center justify-center h-64">
                <div className="relative w-32 h-32">
                  {/* Donut chart segments */}
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-gray-200"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-purple-500"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - 0.65)}`}
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-green-400"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - 0.9)}`}
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-yellow-400"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - 1)}`}
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">$45.2K</div>
                      <div className="text-xs text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                </div>
                        </div>
              
              {/* Legend */}
              <div className="mt-6 space-y-3">
                {revenueBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}%
                    </span>
                    </div>
                  ))}
                </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
