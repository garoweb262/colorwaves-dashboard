"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { Button } from "@/amal-ui";
import { BarChart3, TrendingUp, Users, Eye, Download } from "lucide-react";

export default function AnalyticsPage() {
  const breadcrumbs = [
    { label: "Analytics", href: "/analytics" }
  ];

  return (
    <DashboardRouteGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into your website performance and user behavior.
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export Report
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Total Pageviews</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">2.4M</p>
                <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Unique Visitors</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">847K</p>
                <p className="text-sm text-green-600 mt-2">+8.2% from last month</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">3.2%</p>
                <p className="text-sm text-green-600 mt-2">+0.5% from last month</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Bounce Rate</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">42.1%</p>
                <p className="text-sm text-red-600 mt-2">+2.1% from last month</p>
              </div>
            </motion.div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Traffic Overview
                </h3>
                <p className="text-gray-600 text-sm">
                  Daily traffic patterns over the last 30 days
                </p>
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            </motion.div>

            {/* User Demographics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Demographics
                </h3>
                <p className="text-gray-600 text-sm">
                  Geographic distribution of your users
                </p>
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Demographics chart would go here</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
