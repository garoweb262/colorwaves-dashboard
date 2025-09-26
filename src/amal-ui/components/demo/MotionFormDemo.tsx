"use client";

import React, { useState } from "react";
import { Button, Input, Select, Checkbox, Textarea } from "../forms";
import { motion } from "framer-motion";

export function MotionFormDemo() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    twitterPassword: "",
    category: "",
    message: "",
    agree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const categoryOptions = [
    { value: "solutions", label: "Solutions" },
    { value: "products", label: "Products" },
    { value: "services", label: "Services" },
    { value: "support", label: "Support" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-bold text-neutral-800 dark:text-neutral-200"
      >
        Welcome to AmalTech
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300"
      >
        Experience our advanced motion animations across all form components
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        className="my-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <Input
            label="First name"
            placeholder="Tyler"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            fullWidth
          />
          <Input
            label="Last name"
            placeholder="Durden"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            fullWidth
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="projectmayhem@fc.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          fullWidth
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          fullWidth
        />

        <Input
          label="Your twitter password"
          type="password"
          placeholder="••••••••"
          value={formData.twitterPassword}
          onChange={(e) => handleInputChange("twitterPassword", e.target.value)}
          fullWidth
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleInputChange("category", value)}
          placeholder="Select a category"
          fullWidth
        />

        <Textarea
          label="Message"
          placeholder="Tell us about your project..."
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          rows={4}
          fullWidth
        />

        <Checkbox
          label="I agree to the terms and conditions"
          checked={formData.agree}
          onChange={(checked) => handleInputChange("agree", checked)}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button type="submit" variant="primary" fullWidth className="h-10">
            Sign up &rarr;
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col space-y-4"
        >
          <Button variant="outline" fullWidth className="h-10">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
          </Button>

          <Button variant="outline" fullWidth className="h-10">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
          </Button>

          <Button variant="outline" fullWidth className="h-10">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              LinkedIn
            </span>
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
