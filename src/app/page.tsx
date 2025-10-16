"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@/amal-ui";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { BackgroundGridLines } from "@/amal-ui/components/BackgroundGridLines";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, isAuthenticated } = useUser();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Login successful - redirect will happen automatically via useEffect
        console.log("Login successful:", result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--dashboard-background)' }}>
      {/* Background Grid Lines */}
      <BackgroundGridLines />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-palette-violet/5 via-white to-palette-blue/5" />
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo and Header */}
          <div className="flex justify-center items-center  mb-8">
            <Image alt="colorwaves-logo" width={120} height={120} src="/images/logo/ColorWaves_Logo Vertical Black.png" priority />
          </div>

          {/* Demo Accounts Info */}
         

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-palette-red/10 border border-palette-red/20 rounded-lg"
            >
              <p className="text-sm text-palette-red">{errorMessage}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4" />}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                fullWidth
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                fullWidth
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-palette-violet focus:ring-palette-violet"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <div
                onClick={() => router.push("/forgot-password")}
                className="text-palette-violet hover:text-palette-indigo transition-colors cursor-pointer"
              >
                Forgot password?
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              
                className="group"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>
          </form>

         
        </div>
      </motion.div>

      {/* Floating elements for visual appeal */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-2 h-2 bg-palette-blue rounded-full opacity-60"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-3 h-3 bg-palette-violet rounded-full opacity-60"
      />
    </div>
  );
}
