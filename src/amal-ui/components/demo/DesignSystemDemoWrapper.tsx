"use client";

import React from "react";
import { ToastProvider } from "../ToastProvider";
import { DesignSystemDemo } from "./DesignSystemDemo";

export const DesignSystemDemoWrapper = () => {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <DesignSystemDemo />
    </ToastProvider>
  );
};
