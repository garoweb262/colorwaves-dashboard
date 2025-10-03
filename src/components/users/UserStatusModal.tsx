"use client";

import React, { useState, useEffect } from "react";
import { Modal, Select, Button } from "@/amal-ui";
import { UserCheck, AlertTriangle } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserStatusModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (userId: string, status: string) => void;
}

export function UserStatusModal({ user, isOpen, onClose, onUpdateStatus }: UserStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedStatus(user.isActive ? "active" : "inactive");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedStatus) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onUpdateStatus(user.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "suspended", label: "Suspended" }
  ];

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "active":
        return "User can access the system and perform all allowed actions.";
      case "inactive":
        return "User account is disabled and cannot access the system.";
      case "suspended":
        return "User account is temporarily suspended due to policy violations.";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case "inactive":
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
      case "suspended":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Update User Status"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              placeholder="Select status"
              fullWidth
            />
          </div>

          {/* Status Description */}
          {selectedStatus && (
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(selectedStatus)}
              <div>
                <p className="text-sm text-gray-700">
                  {getStatusDescription(selectedStatus)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !selectedStatus}
            className="bg-palette-violet hover:bg-palette-violet/90 text-white"
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
