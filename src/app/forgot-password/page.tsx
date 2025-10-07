"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/amal-ui";
import { Mail, ArrowLeft } from "lucide-react";
import { authAPI } from "@/lib/api";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authAPI.forgotPassword(email);
      
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/");
  };

  const handleContinueToOtp = () => {
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a 6-digit OTP to your email address
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
              <p className="text-sm">
                <strong>OTP sent to:</strong> {email}
              </p>
              <p className="text-sm mt-1">
                The OTP will expire in 10 minutes. Please check your email and enter the code to continue.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleContinueToOtp}
                variant="primary"
                className="w-full bg-palette-violet hover:bg-palette-violet/90 text-white"
              >
                Enter OTP Code
              </Button>
              
              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
        <div className="flex justify-center items-center  mb-8">
            <Image alt="colorwaves-logo" width={120} height={120} src="/images/logo/ColorWaves_Logo Vertical Black.png" priority />
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a verification code
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              leftIcon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              error={error}
              required
              fullWidth
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full bg-palette-violet hover:bg-palette-violet/90 text-white"
            >
              {isLoading ? "Sending OTP..." : "Send Verification Code"}
            </Button>
            
            <Button
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
