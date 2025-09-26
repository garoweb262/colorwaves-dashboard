"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { Button } from "@/amal-ui";
import { FileText, Plus, Search } from "lucide-react";

export default function ContentPage() {
  const breadcrumbs = [
    { label: "Website Content", href: "/content" }
  ];

  return (
    <DashboardRouteGuard>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Website Content</h1>
              <p className="text-gray-600 mt-2">
                Manage your website pages, posts, and media content.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Content
            </Button>
          </div>

          {/* Content Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Total Pages</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
                <p className="text-sm text-green-600 mt-2">+2 this week</p>
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
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Blog Posts</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">156</p>
                <p className="text-sm text-green-600 mt-2">+8 this month</p>
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
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">Media Files</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">1,247</p>
                <p className="text-sm text-green-600 mt-2">+23 this week</p>
              </div>
            </motion.div>
          </div>

          {/* Content List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Content</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Sample Content {item}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last updated 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
