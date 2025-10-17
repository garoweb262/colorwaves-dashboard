"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TableProps, TableColumn } from "../types";
import { cn } from "../utilities";

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      className,
      columns,
      data,
      sortable = false,
      selectable = false,
      pagination = false,
      searchable = false,
      ...props
    },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter data based on search term
    const filteredData = useMemo(() => {
      if (!searchable || !searchTerm) return data;

      return data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, [data, searchTerm, searchable]);

    // Sort data
    const sortedData = useMemo(() => {
      if (!sortable || !sortConfig) return filteredData;

      return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }, [filteredData, sortConfig, sortable]);

    // Paginate data
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;

      const startIndex = (currentPage - 1) * itemsPerPage;
      return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, pagination]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (key: string) => {
      if (!sortable) return;

      setSortConfig((prev) => {
        if (prev?.key === key) {
          return {
            key,
            direction: prev.direction === "asc" ? "desc" : "asc",
          };
        }
        return { key, direction: "asc" };
      });
    };

    const handleSelectAll = () => {
      if (!selectable) return;

      if (selectedRows.size === paginatedData.length) {
        setSelectedRows(new Set());
      } else {
        setSelectedRows(
          new Set(paginatedData.map((row, index) => String(index)))
        );
      }
    };

    const handleSelectRow = (index: string) => {
      if (!selectable) return;

      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    };

    const SortIcon = ({ column }: { column: TableColumn }) => {
      if (!sortable || !column.sortable) return null;

      const isSorted = sortConfig?.key === column.key;
      const isAsc = sortConfig?.direction === "asc";

      return (
        <motion.svg
          className="w-4 h-4 ml-1"
          animate={{ rotate: isSorted && isAsc ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </motion.svg>
      );
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* Search */}
        {searchable && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto glass-table">
          <table className="w-full border-collapse">
            <thead>
              <tr className="glass-table-header">
                {selectable && (
                  <th className="px-4 py-3 text-left glass-table-header-cell">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.size === paginatedData.length &&
                        paginatedData.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-white/30 text-white/70 focus:ring-white/50 bg-white/10"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-left font-medium glass-table-header-cell",
                      sortable &&
                        column.sortable &&
                        "cursor-pointer hover:bg-white/10"
                    )}
                    onClick={() => handleSort(column.key)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center">
                      {column.title}
                      <SortIcon column={column} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  className="glass-table-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: rowIndex * 0.05,
                  }}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(String(rowIndex))}
                        onChange={() => handleSelectRow(String(rowIndex))}
                        className="rounded border-white/30 text-white/70 focus:ring-white/50 bg-white/10"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 glass-table-cell"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] || "")}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
              {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "px-3 py-1 border rounded-md",
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = "Table";
