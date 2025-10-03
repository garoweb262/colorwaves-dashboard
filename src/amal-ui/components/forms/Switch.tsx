import React from "react";
import { cn } from "../../utilities";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  name?: string;
}

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className,
  id,
  name,
  ...props
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  const sizeClasses = {
    sm: "h-4 w-7",
    md: "h-5 w-9",
    lg: "h-6 w-11",
  };

  const thumbSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const translateClasses = {
    sm: checked ? "translate-x-3" : "translate-x-0",
    md: checked ? "translate-x-4" : "translate-x-0",
    lg: checked ? "translate-x-5" : "translate-x-0",
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "relative inline-flex cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          sizeClasses[size],
          checked
            ? "bg-primary"
            : "bg-gray-200",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <span
          className={cn(
            "inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
            thumbSizeClasses[size],
            translateClasses[size]
          )}
        />
      </label>
    </div>
  );
}
