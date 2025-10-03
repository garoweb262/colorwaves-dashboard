"use client";

import React from "react";
import { Button } from "@/amal-ui";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  totalItems,
  pageSize,
  className = "",
}: PaginationProps) {
  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  const startIndex = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : 0;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-between px-6 py-4 border-t border-gray-200", className)}>
      {/* Info */}
      {showInfo && totalItems && pageSize && (
        <div className="text-sm text-gray-700">
          Showing {startIndex} to {endIndex} of {totalItems} results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-8 h-8 text-gray-500"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "w-8 h-8 p-0",
                  isCurrentPage && "bg-palette-violet text-white hover:bg-palette-violet/90"
                )}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
