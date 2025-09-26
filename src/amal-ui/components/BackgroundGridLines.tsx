import React from "react";

export function BackgroundGridLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Mobile Layout: Single grid line with 88% width, centered, min-width 350px */}
      <div className="block md:hidden w-full h-full">
        <div className="layout-grid-mobile h-full">
          {/* Left border line */}
          <div className="grid-line-border left-0"></div>
          {/* Right border line */}
          <div className="grid-line-border right-0"></div>
        </div>
      </div>

      {/* Tablet Layout: Three grid lines with 88% width, centered */}
      <div className="hidden md:block xl:hidden w-full h-full">
        <div className="layout-grid-tablet h-full">
          {/* Grid lines container */}
          <div className="grid grid-cols-3 gap-0 w-full h-full relative">
            {/* Left border line */}
            <div className="grid-line-border left-0"></div>

            {/* First grid line */}
            <div className="grid-line-inner left-1/3"></div>

            {/* Second grid line */}
            <div className="grid-line-inner left-2/3"></div>

            {/* Right border line */}
            <div className="grid-line-border right-0"></div>
          </div>
        </div>
      </div>

      {/* Desktop and above Layout: Three grid lines with fixed max-width 1150px, centered */}
      <div className="hidden xl:block w-full h-full">
        <div className="layout-grid-desktop h-full">
          {/* Grid lines container */}
          <div className="grid grid-cols-3 gap-0 w-full h-full relative">
            {/* Left border line */}
            <div className="grid-line-border left-0"></div>

            {/* First grid line */}
            <div className="grid-line-inner left-1/3"></div>

            {/* Second grid line */}
            <div className="grid-line-inner left-2/3"></div>

            {/* Right border line */}
            <div className="grid-line-border right-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
