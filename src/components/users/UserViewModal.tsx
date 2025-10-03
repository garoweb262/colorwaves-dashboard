"use client";

import React from "react";
import { motion } from "framer-motion";
import { Modal, Badge, Button } from "@/amal-ui";
import { X, Mail, Calendar, Shield, Clock, User } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserViewModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export function UserViewModal({ user, isOpen, onClose }: UserViewModalProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "red";
      case "ADMIN": return "blue";
      case "SUPPORT": return "green";
      case "CONTENT_MANAGER": return "purple";
      default: return "gray";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "Super Admin";
      case "ADMIN": return "Admin";
      case "SUPPORT": return "Support";
      case "CONTENT_MANAGER": return "Content Manager";
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="User Details"
    >
      <div className="space-y-6">
        {/* User Avatar and Basic Info */}
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Role</p>
              <Badge color={getRoleBadgeColor(user.role)}>
                {getRoleDisplayName(user.role)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Status</p>
              <Badge color={user.isActive ? "green" : "gray"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          {user.lastLogin && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="font-medium text-gray-900">{formatDate(user.lastLogin)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
