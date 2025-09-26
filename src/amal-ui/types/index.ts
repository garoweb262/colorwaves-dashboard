import { ReactNode, ComponentProps, HTMLAttributes } from "react";
import { Variants, Transition } from "framer-motion";

// Base Component Props
export interface BaseComponentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

// Animation Types
export interface AnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: Transition;
  variants?: Variants;
}

// Button Types
export interface ButtonProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "outline"
    | "destructive"
    | "anchor";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

// Input Types
export interface InputProps
  extends Omit<
    ComponentProps<"input">,
    "size" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

// Card Types
export interface CardProps extends BaseComponentProps {
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "sm" | "md" | "lg" | "none";
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

// AlertDialog Types
export interface AlertDialogProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "info";
  size?: "sm" | "md" | "lg" | "xl";
}

// Sheet Types
export interface SheetProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: string;
  showCloseButton?: boolean;
}

// Dropdown Types
export interface DropdownProps extends BaseComponentProps {
  trigger: ReactNode;
  items: DropdownItem[];
  placement?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg";
}

export interface DropdownItem {
  label: string;
  value?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}

// Tooltip Types
export interface TooltipProps extends BaseComponentProps {
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  children: ReactNode;
}

// Popover Types
export interface PopoverProps extends Omit<BaseComponentProps, "content"> {
  trigger: ReactNode;
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
  showArrow?: boolean;
}

// Alert Types
export interface AlertProps extends BaseComponentProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  action?: ReactNode;
  onClose?: () => void;
  closable?: boolean;
}

// Toast Types
export interface ToastProps extends BaseComponentProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  duration?: number;
  action?: ReactNode;
  onClose?: () => void;
}

// Avatar Types
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  fallback?: ReactNode;
  status?: "online" | "offline" | "away" | "busy";
}

// Badge Types
export interface BadgeProps extends BaseComponentProps {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

// Progress Types
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  animated?: boolean;
  striped?: boolean;
}

// Spinner Types
export interface SpinnerProps extends BaseComponentProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
  speed?: "slow" | "normal" | "fast";
}

// Accordion Types
export interface AccordionProps extends BaseComponentProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

// Tabs Types
export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  defaultActive?: string;
  variant?: "default" | "pills" | "underline";
  size?: "sm" | "md" | "lg";
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

// Form Types
export interface FormProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onReset?: () => void;
  initialValues?: Record<string, any>;
  validationSchema?: any;
}

export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

// Select Types
export interface SelectProps extends Omit<BaseComponentProps, "onChange"> {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

// Table Types
export interface TableProps extends BaseComponentProps {
  columns: TableColumn[];
  data: any[];
  sortable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  searchable?: boolean;
}

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}

// Pagination Types
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  size?: "sm" | "md" | "lg";
}

// Breadcrumb Types
export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

// Navigation Types
export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  variant?: "horizontal" | "vertical" | "tabs";
  size?: "sm" | "md" | "lg";
}

export interface NavigationItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  description?: string;
  children?: NavigationItem[];
  downloadableContent?: Array<{
    label: string;
    type: string;
    size: string;
    icon: any;
    href: string;
  }>;
}

// Layout Types
export interface LayoutProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarCollapsible?: boolean;
}

// Container Types
export interface ContainerProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  centered?: boolean;
}

// Grid Types
export interface GridProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  columns?: number | Record<string, number>;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
}

// Flex Types
export interface FlexProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "sm" | "md" | "lg" | "xl";
}

// Stack Types
export interface StackProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  direction?: "horizontal" | "vertical";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  divider?: ReactNode;
}

// Divider Types
export interface DividerProps
  extends Omit<BaseComponentProps, "onDrag" | "onDragStart" | "onDragEnd"> {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed" | "dotted";
  size?: "sm" | "md" | "lg";
  color?: string;
}

// Text Types
export interface TextProps extends BaseComponentProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "caption"
    | "overline";
  weight?:
    | "thin"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold";
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  truncate?: boolean;
  noOfLines?: number;
}

// Heading Types
export interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Link Types
export interface LinkProps extends BaseComponentProps {
  href: string;
  external?: boolean;
  variant?: "default" | "primary" | "secondary";
  underline?: boolean;
}

// Image Types
export interface ImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  fallback?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

// Icon Types
export interface IconProps extends BaseComponentProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: string;
  weight?: "thin" | "light" | "normal" | "medium" | "semibold" | "bold";
}

// Theme Types
export interface Theme {
  colors: Record<string, any>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  zIndex: Record<string, number | string>;
  breakpoints: Record<string, string>;
  durations: Record<string, string>;
  easings: Record<string, string>;
}

// Animation Hook Types
export interface UseAnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: Transition;
  variants?: Variants;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
}

// Responsive Types
export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}

// Utility Types
export type ColorScheme = "light" | "dark";
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Variant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error";
export type Placement = "top" | "bottom" | "left" | "right";
export type Direction = "horizontal" | "vertical";
export type Alignment = "start" | "center" | "end" | "stretch" | "baseline";
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

// Hero Types
export interface HeroProps extends BaseComponentProps {
  variant?:
    | "level1"
    | "level2"
    | "level3"
    | "blog"
    | "product"
    | "solution"
    | "career";
  title: string;
  subtitle?: string;
  description?: string;
  tagline?: string;
  cta?: {
    text: string;
    href: string;
    variant?: "primary" | "secondary" | "outline";
    icon?: ReactNode;
  };
  secondaryCta?: {
    text: string;
    href: string;
    variant?: "primary" | "secondary" | "outline";
    icon?: ReactNode;
  };
  background?: {
    type: "image" | "gradient" | "solid" | "video";
    src?: string;
    alt?: string;
    gradient?: string;
    color?: string;
    overlay?: boolean;
    overlayColor?: string;
  };
  layout?: "left" | "center" | "right" | "split";
  size?: "sm" | "md" | "lg" | "xl";
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "none";
  animationDelay?: number;
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{
    name: string;
    href: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
    icon?: ReactNode;
  }>;
  className?: string;
}
