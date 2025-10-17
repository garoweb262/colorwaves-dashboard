"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  error, 
  required = false, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function GlassInput({ 
  className, 
  error = false, 
  ...props 
}: InputProps) {
  return (
    <input
      className={cn(
        "glass-input w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200",
        error && "border-red-400 focus:ring-red-400/30",
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function GlassTextarea({ 
  className, 
  error = false, 
  ...props 
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        "glass-textarea w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 resize-vertical",
        error && "border-red-400 focus:ring-red-400/30",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export function GlassSelect({ 
  className, 
  error = false, 
  options,
  ...props 
}: SelectProps) {
  return (
    <select
      className={cn(
        "glass-select w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200",
        error && "border-red-400 focus:ring-red-400/30",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
          {option.label}
        </option>
      ))}
    </select>
  );
}
