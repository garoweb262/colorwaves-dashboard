"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@/amal-ui";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { BackgroundGridLines } from "@/amal-ui/components/BackgroundGridLines";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Grid Lines */}
      <BackgroundGridLines />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2"
            >
              AmalTech
            </motion.div>
            <p className="text-gray-600 text-sm">Content Management System</p>
          </div>

          {/* Demo Accounts Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Accounts:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Super Admin: admin@mail.com / 1234</div>
              <div>• Brand Manager: brand@mail.com / 1234</div>
              <div>• Sales Manager: sales@mail.com / 1234</div>
            </div>
          </motion.div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-700">{errorMessage}</p>
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
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
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
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="group"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            <p>
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Contact administrator
              </a>
            </p>
          </motion.div>
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
        className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60"
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
        className="absolute bottom-20 right-20 w-3 h-3 bg-orange-400 rounded-full opacity-60"
      />
    </div>
  );
}
