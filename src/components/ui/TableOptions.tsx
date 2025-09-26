"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Settings, Download, Eye, EyeOff, Filter, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnOption {
  key: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface TableOptionsProps {
  columns: ColumnOption[];
  onColumnsChange: (columns: ColumnOption[]) => void;
  onExport?: (format: "csv" | "excel" | "pdf") => void;
  onReset?: () => void;
  className?: string;
  showColumnToggle?: boolean;
  showExport?: boolean;
  showReset?: boolean;
  exportFormats?: ("csv" | "excel" | "pdf")[];
  customFilters?: React.ReactNode;
}

export function TableOptions({
  columns,
  onColumnsChange,
  onExport,
  onReset,
  className,
  showColumnToggle = true,
  showExport = true,
  showReset = true,
  exportFormats = ["csv", "excel", "pdf"],
  customFilters,
}: TableOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"columns" | "filters" | "export">("columns");

  const handleColumnToggle = (key: string) => {
    const newColumns = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  const handleColumnPropertyToggle = (key: string, property: "sortable" | "filterable") => {
    const newColumns = columns.map((col) =>
      col.key === key ? { ...col, [property]: !col[property] } : col
    );
    onColumnsChange(newColumns);
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    onExport?.(format);
    setIsOpen(false);
  };

  const handleReset = () => {
    onReset?.();
    setIsOpen(false);
  };

  const visibleColumns = columns.filter((col) => col.visible);

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Options
        {visibleColumns.length !== columns.length && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
            {visibleColumns.length}/{columns.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Table Options</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {showColumnToggle && (
                <button
                  onClick={() => setActiveTab("columns")}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === "columns"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Columns3 className="h-4 w-4 inline mr-2" />
                  Columns
                </button>
              )}
              {customFilters && (
                <button
                  onClick={() => setActiveTab("filters")}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === "filters"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filters
                </button>
              )}
              {showExport && (
                <button
                  onClick={() => setActiveTab("export")}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                    activeTab === "export"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Export
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Columns Tab */}
              {activeTab === "columns" && showColumnToggle && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Column Visibility</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColumns = columns.map((col) => ({ ...col, visible: true }));
                        onColumnsChange(newColumns);
                      }}
                    >
                      Show All
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleColumnToggle(column.key)}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                          >
                            {column.visible ? (
                              <Eye className="h-4 w-4 text-blue-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            )}
                            {column.label}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {column.sortable !== undefined && (
                            <button
                              onClick={() => handleColumnPropertyToggle(column.key, "sortable")}
                              className={cn(
                                "px-2 py-1 text-xs rounded transition-colors",
                                column.sortable
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              Sort
                            </button>
                          )}
                          {column.filterable !== undefined && (
                            <button
                              onClick={() => handleColumnPropertyToggle(column.key, "filterable")}
                              className={cn(
                                "px-2 py-1 text-xs rounded transition-colors",
                                column.filterable
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              Filter
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters Tab */}
              {activeTab === "filters" && customFilters && (
                <div className="space-y-3">
                  <span className="text-sm font-medium text-gray-700">Custom Filters</span>
                  {customFilters}
                </div>
              )}

              {/* Export Tab */}
              {activeTab === "export" && showExport && (
                <div className="space-y-3">
                  <span className="text-sm font-medium text-gray-700">Export Data</span>
                  <div className="grid grid-cols-1 gap-2">
                    {exportFormats.includes("csv") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("csv")}
                        className="justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as CSV
                      </Button>
                    )}
                    {exportFormats.includes("excel") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("excel")}
                        className="justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as Excel
                      </Button>
                    )}
                    {exportFormats.includes("pdf") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("pdf")}
                        className="justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {visibleColumns.length} of {columns.length} columns visible
              </div>
              <div className="flex gap-2">
                {showReset && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                )}
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick column visibility toggle
export function ColumnToggle({
  columns,
  onColumnsChange,
  className,
}: {
  columns: ColumnOption[];
  onColumnsChange: (columns: ColumnOption[]) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key: string) => {
    const newColumns = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Columns3 className="h-4 w-4" />
        Columns
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-2 space-y-1">
              {columns.map((column) => (
                <button
                  key={column.key}
                  onClick={() => handleToggle(column.key)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                    column.visible
                      ? "text-gray-900 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {column.visible ? (
                    <Eye className="h-4 w-4 text-blue-600" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                  {column.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
