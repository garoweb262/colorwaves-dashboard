"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../forms/Button";

const DrawerContext = React.createContext<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  isOpen: false,
  onOpenChange: () => {},
});

const useDrawerContext = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within a Drawer");
  }
  return context;
};

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Drawer = ({ open, onOpenChange, children }: DrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpenState = isControlled ? open : isOpen;
  const setIsOpenState = isControlled ? onOpenChange : setIsOpen;

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpenState) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpenState]);

  return (
    <DrawerContext.Provider
      value={{
        isOpen: isOpenState || false,
        onOpenChange: setIsOpenState || (() => {}),
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const DrawerTrigger = ({ children, asChild }: DrawerTriggerProps) => {
  const { isOpen, onOpenChange } = useDrawerContext();

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => onOpenChange(!isOpen),
    });
  }

  return <div onClick={() => onOpenChange(!isOpen)}>{children}</div>;
};

interface DrawerContentProps {
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const DrawerContent = ({
  children,
  side = "left",
  className,
}: DrawerContentProps) => {
  const { isOpen, onOpenChange } = useDrawerContext();

  const sideClasses = {
    top: "fixed top-[70px] left-0 right-0 w-full h-auto max-h-[90vh]",
    right: "fixed top-0 right-0 h-full w-auto max-w-[90vw]",
    bottom: "fixed bottom-0 left-0 right-0 w-full h-auto max-h-[90vh]",
    left: "fixed top-0 left-0 h-full w-auto max-w-[90vw]",
  };

  const sideAnimations = {
    top: {
      initial: { opacity: 0, height: 0, y: -20 },
      animate: { opacity: 1, height: "auto", y: 0 },
      exit: { opacity: 0, height: 0, y: -20 },
    },
    right: {
      initial: { opacity: 0, width: 0, x: 20 },
      animate: { opacity: 1, width: "auto", x: 0 },
      exit: { opacity: 0, width: 0, x: 20 },
    },
    bottom: {
      initial: { opacity: 0, height: 0, y: 20 },
      animate: { opacity: 1, height: "auto", y: 0 },
      exit: { opacity: 0, height: 0, y: 20 },
    },
    left: {
      initial: { opacity: 0, width: 0, x: -20 },
      animate: { opacity: 1, width: "auto", x: 0 },
      exit: { opacity: 0, width: 0, x: -20 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={sideAnimations[side].initial}
          animate={sideAnimations[side].animate}
          exit={sideAnimations[side].exit}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "bg-white shadow-xl z-40 overflow-hidden",
            sideClasses[side],
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const DrawerHeader = ({ children, className }: DrawerHeaderProps) => {
  const { onOpenChange } = useDrawerContext();

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50",
        className
      )}
    >
      {children}
      <Button
        variant="anchor"
        size="sm"
        className="p-1"
        onClick={() => onOpenChange(false)}
      >
        <X className="h-5 w-5" strokeWidth={1} />
      </Button>
    </div>
  );
};

interface DrawerTitleProps {
  children: React.ReactNode;
  className?: string;
}

const DrawerTitle = ({ children, className }: DrawerTitleProps) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
};

interface DrawerBodyProps {
  children: React.ReactNode;
  className?: string;
}

const DrawerBody = ({ children, className }: DrawerBodyProps) => {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
  );
};

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
};
