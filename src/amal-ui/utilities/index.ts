import { tokens } from "../tokens";

// Class name utility (similar to clsx/cn)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Token getter utilities
export function getColor(color: string): string {
  const [category, shade] = color.split(".");
  return (tokens.colors as any)[category]?.[shade] || color;
}

export function getSpacing(size: keyof typeof tokens.spacing): string {
  return tokens.spacing[size];
}

export function getTypography(
  variant: keyof typeof tokens.typography.fontSize
): string {
  return tokens.typography.fontSize[variant];
}

export function getBorderRadius(
  size: keyof typeof tokens.borderRadius
): string {
  return tokens.borderRadius[size];
}

export function getShadow(size: keyof typeof tokens.shadows): string {
  return tokens.shadows[size];
}

// Responsive utilities
export function getResponsiveValue<T>(
  value: T | ResponsiveValue<T>,
  breakpoint: keyof ResponsiveValue<T>
): T | undefined {
  if (typeof value === "object" && value !== null) {
    return (value as ResponsiveValue<T>)[breakpoint];
  }
  return value as T;
}

// Animation utilities
export function createAnimation(
  type: "fade" | "slide" | "scale" | "rotate",
  direction?: "up" | "down" | "left" | "right",
  distance: number = 20
) {
  const base = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  switch (type) {
    case "fade":
      return base;
    case "slide":
      const axis = direction === "left" || direction === "right" ? "x" : "y";
      const value =
        direction === "left" || direction === "up" ? -distance : distance;
      return {
        initial: { opacity: 0, [axis]: value },
        animate: { opacity: 1, [axis]: 0 },
        exit: { opacity: 0, [axis]: value },
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      };
    case "rotate":
      return {
        initial: { opacity: 0, rotate: -180 },
        animate: { opacity: 1, rotate: 0 },
        exit: { opacity: 0, rotate: 180 },
      };
    default:
      return base;
  }
}

// Color utilities
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));

  return rgbToHex(newR, newG, newB);
}

// Spacing utilities
export function createSpacing(multiplier: number): string {
  return `${multiplier * 0.25}rem`;
}

// Typography utilities
export function getFontSize(
  size: keyof typeof tokens.typography.fontSize
): string {
  return tokens.typography.fontSize[size];
}

export function getFontWeight(
  weight: keyof typeof tokens.typography.fontWeight
): string {
  return tokens.typography.fontWeight[weight];
}

export function getLineHeight(
  height: keyof typeof tokens.typography.lineHeight
): string {
  return tokens.typography.lineHeight[height];
}

// Breakpoint utilities
export function getBreakpoint(
  breakpoint: keyof typeof tokens.breakpoints
): string {
  return tokens.breakpoints[breakpoint];
}

export function isMobile(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export function isTablet(): boolean {
  return (
    typeof window !== "undefined" &&
    window.innerWidth >= 768 &&
    window.innerWidth < 1024
  );
}

export function isDesktop(): boolean {
  return typeof window !== "undefined" && window.innerWidth >= 1024;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Format utilities
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}

export function formatNumber(
  num: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", options).format(num);
}

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Array utilities
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Object utilities
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage utilities
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error("Error getting localStorage:", error);
    return defaultValue || null;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage:", error);
  }
}

// Session storage utilities
export function setSessionStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting sessionStorage:", error);
  }
}

export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error("Error getting sessionStorage:", error);
    return defaultValue || null;
  }
}

export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing sessionStorage:", error);
  }
}

// Type for responsive values
export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}
