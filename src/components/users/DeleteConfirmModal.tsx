"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Modal, Button } from "@/amal-ui";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface User {
  _id?: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  password?: string;
}

interface DeleteConfirmModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}

export function DeleteConfirmModal({ user, isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConfirm(user.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title=""
    >
      <div className="text-center space-y-6">
        {/* Warning Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete User
          </h3>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* User Details */}
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900">{user.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${user.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            leftIcon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isLoading}
            leftIcon={<Trash2 className="h-4 w-4" />}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
}
