"use client";

import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, useToast } from "@/amal-ui";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface User {
  _id?: string; // Backend uses _id
  id: string; // Required for useCRUD
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  password?: string; // For form data
}

interface UserFormModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export function UserFormModal({ user, isOpen, onClose, onSave }: UserFormModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        role: user.role || "content-manager",
        password: "",
        confirmPassword: ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "content-manager",
        password: "",
        confirmPassword: ""
      });
    }
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [user, isOpen]);


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // For creating new user, only send the required fields
      const userData = isEditing ? {
        // For editing, only send the fields allowed by UpdateUserDto
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role
      } : {
        // For creating, only send the fields the API expects
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      };

      // Call the onSave callback with the properly formatted data
      onSave(userData as User);
      
      // Show success toast
      addToast({
        variant: "success",
        title: isEditing ? "User Updated" : "User Created",
        description: isEditing 
          ? `User ${formData.firstName} ${formData.lastName} has been updated successfully.`
          : `User ${formData.firstName} ${formData.lastName} has been created successfully.`,
        duration: 4000
      });
    } catch (error) {
      console.error("Error saving user:", error);
      
      // Show error toast
      addToast({
        variant: "error",
        title: isEditing ? "Update Failed" : "Creation Failed",
        description: isEditing 
          ? "Failed to update user. Please try again."
          : "Failed to create user. Please try again.",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "support", label: "Support" },
    { value: "content-manager", label: "Content Manager" },
    { value: "brand", label: "Brand" },
    { value: "sales", label: "Sales" }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEditing ? "Edit User" : "Add New User"}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter first name"
                leftIcon={<User className="h-4 w-4" />}
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
                required
                fullWidth
              />

              <Input
                label="Last Name"
                placeholder="Enter last name"
                leftIcon={<User className="h-4 w-4" />}
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
                required
                fullWidth
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              leftIcon={<Mail className="h-4 w-4" />}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
              fullWidth
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
              Role & Permissions
            </h3>
            
            <Select
              label="Role"
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              options={roleOptions}
              placeholder="Select a role"
              fullWidth
            />
          </div>

          {/* Password Section - Only for new users */}
          {!isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">
                Set Password
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/60 hover:text-white/80"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  error={errors.password}
                  required
                  fullWidth
                />

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-white/60 hover:text-white/80"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  required
                  fullWidth
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
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
              disabled={isLoading}
              className="bg-palette-violet hover:bg-palette-violet/90 text-white"
            >
              {isLoading ? "Saving..." : isEditing ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}