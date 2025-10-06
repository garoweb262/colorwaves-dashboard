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
  token: string | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
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
          // Token is invalid, remove it and logout
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      } else {
        // No token found, ensure user is logged out
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Check for token on page visibility change (when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken && user) {
          // Token was removed while tab was hidden, logout user
          setUser(null);
          setToken(null);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // Listen for storage changes (when token is removed in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && e.newValue === null && user) {
        // Token was removed in another tab, logout user
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const currentRole = roles.find(role => role.id === user?.role);

  const switchRole = (roleId: string) => {
    if (user) {
      setUser({ ...user, role: roleId });
    }
  };

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // console.log('Login attempt:', { email, baseURL: api.defaults.baseURL });
      const response = await api.post('/auth/login', { email, password });
      // console.log('Login response:', response.data);
      const data: LoginResponse = response.data;
      
      // Store token
      localStorage.setItem('authToken', data.access_token);
      setToken(data.access_token);
      
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
    // Clear all localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setUser(null);
    setToken(null);
  };

  // Role-based access control functions
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: UserContextType = {
    user,
    setUser,
    currentRole,
    switchRole,
    isAuthenticated,
    login,
    logout,
    isLoading,
    token,
    hasRole,
    hasAnyRole
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
