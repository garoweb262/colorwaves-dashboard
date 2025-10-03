"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { roles, type Role } from "@/lib/menuConfig";
import api from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentRole: Role | undefined;
  switchRole: (roleId: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          if (response.data) {
            const userData: User = {
              id: response.data.id,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
              role: response.data.role,
              avatar: `${response.data.firstName[0]}${response.data.lastName[0]}`
            };
            setUser(userData);
          }
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const currentRole = roles.find(role => role.id === user?.role);

  const switchRole = (roleId: string) => {
    if (user) {
      setUser({ ...user, role: roleId });
    }
  };

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const data: LoginResponse = response.data;
      
      // Store token
      localStorage.setItem('authToken', data.access_token);
      
      // Set user data
      const userData: User = {
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role,
        avatar: `${data.user.firstName[0]}${data.user.lastName[0]}`
      };
      
      setUser(userData);
      return { success: true, message: "Login successful" };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    currentRole,
    switchRole,
    isAuthenticated,
    login,
    logout,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
