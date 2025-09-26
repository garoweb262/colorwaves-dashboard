"use client";

import { useState } from "react";
import { Grip, X, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "../amal-ui/components/overlay/Sheet";

interface ContactSheetProps {
  locale: string;
}

export function ContactSheet({ locale }: ContactSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button className="group p-3 relative hidden right-0 top-0 h-full min-w-24 bg-amaltech-blue text-white transition-all duration-300 hover:bg-amaltech-orange focus:outline-none focus:ring-0 lg:flex items-center justify-center justify-items-center">
          <Grip
            className="h-10 w-10 text-white transition-colors duration-300"
            strokeWidth={1}
            fill="currentColor"
          />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[580px] bg-white">
        <div className="relative">
          {/* Header Graphic/Logo */}
          <div className="flex justify-center mb-8 pt-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl"></div>
            </div>
          </div>

          {/* Section Heading */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm font-medium">/ Contact us</p>
          </div>

          {/* Company Name */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              AMAL TECHNOLOGIES
            </h2>
          </div>

          {/* Contact Information */}
          <div className="max-w-md mx-auto space-y-4 mb-8">
            <div className="text-center">
              <p className="text-gray-700 text-lg leading-relaxed">
                123 Innovation Drive
                <br />
                Tech City, TC 12345
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-700 text-lg">
                <a
                  href="mailto:info@amaltech.com"
                  className="hover:text-orange-500 transition-colors"
                >
                  info@amaltech.com
                </a>
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-700 text-lg">
                <a
                  href="tel:+1234567890"
                  className="hover:text-orange-500 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center">
            <button className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center mx-auto space-x-2">
              <span className="font-semibold text-lg">GET IN TOUCH</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
