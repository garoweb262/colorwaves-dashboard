// Design System Exports
export * from "./tokens";
export * from "./types";
export * from "./utilities";
export * from "./animations";

// Re-export ResponsiveValue from types to avoid conflict
export type { ResponsiveValue } from "./types";

// Component Exports
export * from "./components/layout";
export * from "./components/navigation";
export * from "./components/overlay";
export * from "./components/data";
export * from "./components";

// CRUD System
export * from "./crud";

// Re-export commonly used utilities
export {
  cn,
  getColor,
  getSpacing,
  getTypography,
  getBorderRadius,
  getShadow,
} from "./utilities";
export {
  animationPresets,
  componentAnimations,
  pageTransitions,
  scrollAnimations,
} from "./animations";

// Export design system configuration
export const designSystem = {
  name: "ColorWaves UI",
  version: "1.0.0",
  description: "Modern design system for ColorWaves",
  tokens: {
    colors: {
      primary: "#3b82f6",
      secondary: "#d946ef",
      accent: "#f97316",
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    typography: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      base: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
  },
  animations: {
    spring: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
    smooth: {
      type: "tween",
      ease: [0.4, 0, 0.2, 1],
      duration: 0.3,
    },
    snap: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  breakpoints: {
    xs: "0px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Export component categories for organization
export const componentCategories = {
  layout: ["Container", "Grid", "Flex", "Stack", "Divider", "Layout"],
  navigation: ["Navigation", "Breadcrumb", "Pagination", "Tabs", "Accordion"],
  forms: ["Input", "Select", "Button", "Form", "FormField"],
  feedback: ["Alert", "Toast", "Progress", "Spinner", "Badge"],
  overlay: ["Modal", "Sheet", "Popover", "Tooltip", "Dropdown"],
  data: ["Table", "Card", "Avatar", "Image", "Icon", "DataTable", "SearchFilter", "Sorting", "Pagination"],
  typography: ["Text", "Heading", "Link"],
  crud: ["CRUDTable", "CRUDFormModal", "CRUDViewModal", "CRUDDeleteModal", "StatusUpdateModal"],
} as const;

// Export animation categories
export const animationCategories = {
  page: ["fadeIn", "slideUp", "slideIn", "scaleIn"],
  component: [
    "button",
    "card",
    "modal",
    "sheet",
    "dropdown",
    "listItem",
    "fadeIn",
    "scale",
  ],
  scroll: ["fadeInUp", "fadeInLeft", "fadeInRight", "scaleIn"],
  hover: ["lift", "glow", "pulse"],
  svg: ["draw", "morph", "rotate"],
} as const;

// Export utility categories
export const utilityCategories = {
  tokens: [
    "getColor",
    "getSpacing",
    "getTypography",
    "getBorderRadius",
    "getShadow",
  ],
  responsive: ["getResponsiveValue", "isMobile", "isTablet", "isDesktop"],
  animation: [
    "createAnimation",
    "createStaggerAnimation",
    "createScrollAnimation",
  ],
  color: ["hexToRgb", "rgbToHex", "adjustBrightness"],
  validation: ["isValidEmail", "isValidUrl", "isValidPhone"],
  format: ["formatCurrency", "formatDate", "formatNumber"],
  string: ["capitalize", "truncate", "slugify"],
  array: ["chunk", "unique", "shuffle"],
  object: ["pick", "omit"],
  performance: ["debounce", "throttle"],
  storage: [
    "setLocalStorage",
    "getLocalStorage",
    "removeLocalStorage",
    "setSessionStorage",
    "getSessionStorage",
    "removeSessionStorage",
  ],
  crud: [
    "createColumn",
    "createTextFilter",
    "createSelectFilter",
    "createBooleanFilter",
    "createFormField",
    "createStatusOptions",
    "getStatusColor",
    "getStatusLabel",
    "generateId",
    "deepClone",
    "deepMerge",
    "getNestedValue",
    "setNestedValue",
  ],
} as const;
