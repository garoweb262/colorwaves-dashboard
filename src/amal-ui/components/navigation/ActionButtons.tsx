"use client";

import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "../forms/Button";
import { Tooltip } from "../Tooltip";

interface ActionButtonsProps {
  onSearchToggle: (isOpen: boolean) => void;
  isSearchOpen: boolean;
}

export function ActionButtons({
  onSearchToggle,
  isSearchOpen,
}: ActionButtonsProps) {
  const handleBasketClick = () => {
    // Redirect to external store
    window.open("https://store.amaltech.com", "_blank");
  };

  const handleUserClick = () => {
    // Redirect to external partners login
    window.open("https://partners.amaltech.com", "_blank");
  };

  const handleSearchClick = () => {
    onSearchToggle(!isSearchOpen);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Search Button */}
      <Tooltip content="Search" position="bottom">
        <Button
          variant="anchor"
          size="sm"
          onClick={handleSearchClick}
          className="p-2 rounded-lg transition-colors"
        >
          <Search className="h-5 w-5 text-gray-600" strokeWidth={1} />
        </Button>
      </Tooltip>

      {/* Basket Button */}
      <Tooltip content="Shopping Cart" position="bottom">
        <Button
          variant="anchor"
          size="sm"
          onClick={handleBasketClick}
          className="p-2 rounded-lg transition-colors relative"
        >
          <ShoppingCart className="h-5 w-5 text-gray-600" strokeWidth={1} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>
      </Tooltip>

      {/* User Button */}
      <Tooltip content="User Account" position="bottom">
        <Button
          variant="anchor"
          size="sm"
          onClick={handleUserClick}
          className="p-2 rounded-lg transition-colors"
        >
          <User className="h-5 w-5 text-gray-600" strokeWidth={1} />
        </Button>
      </Tooltip>
    </div>
  );
}
