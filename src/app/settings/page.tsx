"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRouteGuard } from "@/components/DashboardRouteGuard";
import { Card } from "@/amal-ui/components/Card";
import { Button, Input, Select } from "@/amal-ui";
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Save,
  X,
  Check,
} from "lucide-react";

const settingsSections = [
  {
    id: "profile",
    title: "Profile Settings",
    icon: <User className="h-5 w-5" />,
    description: "Manage your personal information and preferences",
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: <Shield className="h-5 w-5" />,
    description: "Control your account security and privacy settings",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: <Bell className="h-5 w-5" />,
    description: "Configure how you receive notifications",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: <Palette className="h-5 w-5" />,
    description: "Customize the look and feel of your dashboard",
  },
  {
    id: "regional",
    title: "Regional",
    icon: <Globe className="h-5 w-5" />,
    description: "Set your timezone and language preferences",
  },
  {
    id: "data",
    title: "Data & Storage",
    icon: <Database className="h-5 w-5" />,
    description: "Manage your data and storage settings",
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@amaltech.com",
    phone: "+234 123 456 7890",
    timezone: "Africa/Lagos",
    language: "English",
    theme: "light",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
    console.log("Saving settings:", formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                >
                  Edit Profile
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                fullWidth
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                fullWidth
              />
            </div>

            {isEditing && (
              <div className="flex items-center space-x-3 pt-4">
                <Button onClick={handleSave} variant="primary" size="md">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" size="md">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your password regularly</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Login History</h4>
                  <p className="text-sm text-gray-600">View recent login attempts</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => handleInputChange("notifications.email", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={(e) => handleInputChange("notifications.push", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.sms}
                    onChange={(e) => handleInputChange("notifications.sms", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Appearance Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <Select
                  value={formData.theme}
                  onChange={(value: string) => handleInputChange("theme", value)}
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "auto", label: "Auto" },
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <Select
                  value={formData.language}
                  onChange={(value: string) => handleInputChange("language", value)}
                  options={[
                    { value: "English", label: "English" },
                    { value: "French", label: "French" },
                    { value: "Spanish", label: "Spanish" },
                  ]}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="primary" size="md">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        );

      case "regional":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Regional Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <Select
                  value={formData.timezone}
                  onChange={(value: string) => handleInputChange("timezone", value)}
                  options={[
                    { value: "Africa/Lagos", label: "Africa/Lagos (GMT+1)" },
                    { value: "UTC", label: "UTC (GMT+0)" },
                    { value: "America/New_York", label: "America/New_York (GMT-5)" },
                    { value: "Europe/London", label: "Europe/London (GMT+0)" },
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <Select
                  value="MM/DD/YYYY"
                  onChange={() => {}}
                  options={[
                    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                  ]}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button variant="primary" size="md">
                <Save className="h-4 w-4 mr-2" />
                Save Regional Settings
              </Button>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Data & Storage</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Storage Usage</h4>
                  <p className="text-sm text-gray-600">2.4 GB used of 10 GB</p>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Export Data</h4>
                  <p className="text-sm text-gray-600">Download all your data</p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardRouteGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <nav className="space-y-2">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={activeSection === section.id ? "text-blue-600" : "text-gray-500"}>
                          {section.icon}
                        </span>
                        <div>
                          <p className="font-medium">{section.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderSectionContent()}
                </motion.div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DashboardRouteGuard>
  );
}
