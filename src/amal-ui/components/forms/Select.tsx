"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "../../utilities";

interface SelectOption { value: string; label: string; }

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option",
  error,
  fullWidth = true,
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => setPortalContainer(document.body), []);

  // compute position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // NOTE: check both triggerRef and menuRef on mousedown so clicks inside the portal do NOT close prematurely
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = triggerRef.current && triggerRef.current.contains(target);
      const clickedMenu = menuRef.current && menuRef.current.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("relative", fullWidth && "w-full", className)}>
      {label && <label className="block text-sm font-medium text-white mb-2">{label}</label>}

      <div
        ref={triggerRef}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg border bg-transparent text-white cursor-pointer transition-all duration-150",
          disabled ? "opacity-60 cursor-not-allowed border-gray-600" : "border-gray-600 hover:border-gray-400",
          error && "border-red-500"
        )}
        onClick={() => !disabled && setIsOpen((s) => !s)}
      >
        <span className={cn("text-sm", !value && "text-gray-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </div>

      {portalContainer &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="z-[9999] bg-[#0f1720] border border-gray-700 rounded-lg shadow-lg overflow-auto"
                style={{
                  position: "absolute",
                  top: menuPosition.top,
                  left: menuPosition.left,
                  width: menuPosition.width,
                }}
              >
                {options.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-white/60">No options</div>
                ) : (
                  options.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={(e) => {
                        // stopPropagation not strictly necessary because we check menuRef on mousedown,
                        // but it's harmless and prevents any parent click handlers.
                        e.stopPropagation();
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "px-4 py-2 text-sm cursor-pointer select-none",
                        value === opt.value ? "bg-gray-800 text-white" : "text-white/80 hover:bg-gray-700"
                      )}
                    >
                      {opt.label}
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          portalContainer
        )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
