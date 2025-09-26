"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "../forms/Button";
import { useMotionGradient, useMotionState } from "../../utilities/motion";

interface SearchProps {
  onClose: () => void;
  isOpen: boolean;
}

export function Search({ onClose, isOpen }: SearchProps) {
  const [query, setQuery] = useState("");
  const { handleMouseMove, background } = useMotionGradient({
    radius: 100,
    color: "#f97316", // Orange accent color
  });
  const { visible, setVisible } = useMotionState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", query);
  };

  const BottomGradient = () => {
    return (
      <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/search:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/search:opacity-100" />
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-x-0 top-0 z-50 bg-white shadow-sm border-b h-[75px] lg:h-[95px]"
        >
          <div className="container mx-auto py-4 px-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-4"
            >
              <motion.div
                style={{
                  background: visible ? background : "transparent",
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className="flex-1 group/search relative p-[2px] transition duration-300"
              >
                <motion.div
                  className="relative"
                  initial={false}
                  animate={{ scale: 1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                >
                  <SearchIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10"
                    strokeWidth={1}
                  />
                  <input
                    type="text"
                    placeholder="Search for solutions, products, news..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="shadow-input dark:placeholder-text-neutral-600 flex w-full border-none bg-white pl-10 pr-4 py-3 text-sm text-black transition duration-400 group-hover/search:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-orange-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-orange-600 border border-gray-200"
                    autoFocus
                  />
                  <BottomGradient />
                </motion.div>
              </motion.div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="px-6"
              >
                Search
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="px-4"
              >
                <X className="h-4 w-4" strokeWidth={1} />
              </Button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
