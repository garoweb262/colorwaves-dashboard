"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { roles, type Role } from "@/lib/menuConfig";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentRole: Role | undefined;
  switchRole: (roleId: string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Predefined admin accounts
const ADMIN_ACCOUNTS = [
  {
    id: "1",
    name: "Super Admin",
    email: "admin@mail.com",
    password: "1234",
    role: "admin",
    avatar: "SA"
  },
  {
    id: "2",
    name: "Brand Manager",
    email: "brand@mail.com",
    password: "1234",
    role: "brand",
    avatar: "BM"
  },
  {
    id: "3",
    name: "Sales Manager",
    email: "sales@mail.com",
    password: "1234",
    role: "sales",
    avatar: "SM"
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const currentRole = roles.find(role => role.id === user?.role);

  const switchRole = (roleId: string) => {
    if (user) {
      setUser({ ...user, role: roleId });
    }
  };

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find matching account
    const account = ADMIN_ACCOUNTS.find(acc => 
      acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
    );
    
    if (account) {
      const userData: User = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        avatar: account.avatar
      };
      
      setUser(userData);
      return { success: true, message: "Login successful" };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: UserContextType = {
    user,
    setUser,
    currentRole,
    switchRole,
    isAuthenticated,
    login,
    logout
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
