import { ReactNode } from "react";
import { ComponentProps } from "react";

// Solutions-specific components
export const SolutionsMDXComponents = {
  h1: ({ children, className, ...props }: ComponentProps<"h1">) => (
    <h1
      className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-4 mt-8 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={`text-xl lg:text-2xl font-semibold text-gray-900 mb-3 mt-6 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, className, ...props }: ComponentProps<"p">) => (
    <p
      className={`text-gray-700 leading-relaxed mb-4 ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={`list-disc list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={`list-decimal list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: ComponentProps<"li">) => (
    <li className={`text-gray-700 ${className || ""}`} {...props}>
      {children}
    </li>
  ),
  strong: ({ children, className, ...props }: ComponentProps<"strong">) => (
    <strong
      className={`font-semibold text-blue-600 ${className || ""}`}
      {...props}
    >
      {children}
    </strong>
  ),
  code: ({ children, className, ...props }: ComponentProps<"code">) => (
    <code
      className={`bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm font-mono ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({
    children,
    className,
    ...props
  }: ComponentProps<"blockquote">) => (
    <blockquote
      className={`border-l-4 border-blue-200 bg-blue-50 pl-4 py-2 mb-4 italic text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </blockquote>
  ),
};

// Products-specific components
export const ProductsMDXComponents = {
  h1: ({ children, className, ...props }: ComponentProps<"h1">) => (
    <h1
      className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-4 mt-8 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={`text-xl lg:text-2xl font-semibold text-gray-900 mb-3 mt-6 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, className, ...props }: ComponentProps<"p">) => (
    <p
      className={`text-gray-700 leading-relaxed mb-4 ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={`list-disc list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={`list-decimal list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: ComponentProps<"li">) => (
    <li className={`text-gray-700 ${className || ""}`} {...props}>
      {children}
    </li>
  ),
  strong: ({ children, className, ...props }: ComponentProps<"strong">) => (
    <strong
      className={`font-semibold text-purple-600 ${className || ""}`}
      {...props}
    >
      {children}
    </strong>
  ),
  code: ({ children, className, ...props }: ComponentProps<"code">) => (
    <code
      className={`bg-purple-50 text-purple-800 px-2 py-1 rounded text-sm font-mono ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({
    children,
    className,
    ...props
  }: ComponentProps<"blockquote">) => (
    <blockquote
      className={`border-l-4 border-purple-200 bg-purple-50 pl-4 py-2 mb-4 italic text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </blockquote>
  ),
};

// Newsroom-specific components
export const NewsroomMDXComponents = {
  h1: ({ children, className, ...props }: ComponentProps<"h1">) => (
    <h1
      className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-serif ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-4 mt-8 font-serif ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={`text-xl lg:text-2xl font-semibold text-gray-900 mb-3 mt-6 font-serif ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, className, ...props }: ComponentProps<"p">) => (
    <p
      className={`text-gray-700 leading-relaxed mb-4 text-lg ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={`list-disc list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={`list-decimal list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: ComponentProps<"li">) => (
    <li className={`text-gray-700 ${className || ""}`} {...props}>
      {children}
    </li>
  ),
  strong: ({ children, className, ...props }: ComponentProps<"strong">) => (
    <strong
      className={`font-semibold text-emerald-600 ${className || ""}`}
      {...props}
    >
      {children}
    </strong>
  ),
  code: ({ children, className, ...props }: ComponentProps<"code">) => (
    <code
      className={`bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-sm font-mono ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({
    children,
    className,
    ...props
  }: ComponentProps<"blockquote">) => (
    <blockquote
      className={`border-l-4 border-emerald-300 bg-emerald-50 pl-6 py-4 rounded-r italic text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </blockquote>
  ),
};

// Careers-specific components
export const CareersMDXComponents = {
  h1: ({ children, className, ...props }: ComponentProps<"h1">) => (
    <h1
      className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-4 mt-8 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={`text-xl lg:text-2xl font-semibold text-gray-900 mb-3 mt-6 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, className, ...props }: ComponentProps<"p">) => (
    <p
      className={`text-gray-700 leading-relaxed mb-4 ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={`list-disc list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={`list-decimal list-inside space-y-2 mb-4 text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: ComponentProps<"li">) => (
    <li className={`text-gray-700 ${className || ""}`} {...props}>
      {children}
    </li>
  ),
  strong: ({ children, className, ...props }: ComponentProps<"strong">) => (
    <strong
      className={`font-semibold text-orange-600 ${className || ""}`}
      {...props}
    >
      {children}
    </strong>
  ),
  code: ({ children, className, ...props }: ComponentProps<"code">) => (
    <code
      className={`bg-orange-50 text-orange-800 px-2 py-1 rounded text-sm font-mono ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: ({
    children,
    className,
    ...props
  }: ComponentProps<"blockquote">) => (
    <blockquote
      className={`border-l-4 border-orange-200 bg-orange-50 pl-4 py-2 mb-4 italic text-gray-700 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </blockquote>
  ),
};
