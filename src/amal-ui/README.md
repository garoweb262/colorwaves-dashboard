# Amal UI Design System

A comprehensive, scalable, and maintainable design system built with React, TypeScript, Framer Motion, and Tailwind CSS. Designed with security, scalability, and modern UX principles in mind.

## 🎨 Design Philosophy

- **Spring-based animations** for smooth, natural interactions
- **Consistent motion patterns** inspired by Material UI and modern Webflow animations
- **Modular architecture** for easy maintenance and scalability
- **Type-safe components** with comprehensive TypeScript support
- **Accessibility-first** design with proper ARIA attributes and keyboard navigation

## 🚀 Features

- **Unified Animation System**: Consistent spring-based transitions across all components
- **Comprehensive Component Library**: From basic form elements to complex interactive components
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Dark Mode Ready**: Built with dark mode support in mind
- **Performance Optimized**: Efficient rendering and minimal bundle size
- **Developer Experience**: Excellent TypeScript support and comprehensive documentation

## 📦 Installation

```bash
# The design system is included in the project
# No additional installation required
```

## 🎯 Quick Start

```tsx
import { Button, Input, Card, Modal } from '@/amal-ui';

function MyComponent() {
  return (
    <Card>
      <Input label="Email" placeholder="Enter your email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## 🧩 Components

### Form Components

- **Button**: Multiple variants, sizes, and states with loading and icon support
- **Input**: Text inputs with labels, validation, and icon support
- **Select**: Dropdown select with search and multi-select capabilities
- **Checkbox**: Accessible checkbox with custom styling
- **Textarea**: Multi-line text input with validation

### Layout Components

- **Card**: Flexible card component with header, content, and footer
- **Container**: Responsive container with max-width constraints
- **Grid**: CSS Grid wrapper with responsive columns
- **Flex**: Flexbox wrapper with alignment utilities
- **Stack**: Vertical or horizontal stacking with consistent spacing
- **Divider**: Horizontal or vertical dividers

### Interactive Components

- **Modal**: Overlay modal with backdrop and keyboard support
- **Sheet**: Slide-out panels from any side
- **Dropdown**: Contextual menus with custom triggers
- **Tooltip**: Informational tooltips with multiple placements
- **Alert**: Status messages with variants and actions
- **Badge**: Small status indicators with variants
- **Avatar**: User avatars with fallbacks and status indicators
- **Progress**: Progress bars with variants and animations
- **Spinner**: Loading indicators with multiple sizes
- **Accordion**: Collapsible content sections
- **Tabs**: Tabbed interface with multiple variants

### Navigation Components

- **NavigationMenu**: Main navigation with dropdown support
- **MobileNavigation**: Mobile-optimized navigation
- **Search**: Search input with suggestions
- **ActionButtons**: Call-to-action button groups

## 🎨 Animation System

All components use a unified animation system based on Framer Motion with spring physics:

```tsx
// Consistent spring configuration
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};
```

### Motion Hooks

- `useMotionGradient`: Creates animated gradient backgrounds
- `useMotionState`: Manages motion state for hover effects

## 🎯 Usage Examples

### Button Variants

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>
```

### Form with Validation

```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  error="Please enter a valid email"
  helperText="We'll never share your email"
/>
```

### Interactive Modal

```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
  <div className="flex justify-end gap-2">
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm}>
      Confirm
    </Button>
  </div>
</Modal>
```

### Data Display

```tsx
<Card>
  <CardHeader>
    <CardTitle>Project Status</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span>Development</span>
        <Badge variant="success">Complete</Badge>
      </div>
      <Progress value={75} variant="success" />
    </div>
  </CardContent>
</Card>
```

## 🎨 Theming

The design system uses a token-based approach for consistent theming:

### Color Tokens

```css
/* Primary colors */
--color-primary: #f97316; /* Orange */
--color-secondary: #8b5cf6; /* Purple */
--color-accent: #06b6d4; /* Cyan */

/* Semantic colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
```

### Spacing Tokens

```css
/* Consistent spacing scale */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

## 🔧 Customization

### Extending Components

```tsx
import { Button } from '@/amal-ui';

// Custom button with additional styling
const CustomButton = ({ children, ...props }) => (
  <Button
    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    {...props}
  >
    {children}
  </Button>
);
```

### Creating Custom Variants

```tsx
// Extend the Button component with custom variants
const CustomButton = ({ variant, ...props }) => {
  const customVariants = {
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
    // ... other variants
  };
  
  return <Button className={customVariants[variant]} {...props} />;
};
```

## 📱 Responsive Design

All components are built with responsive design in mind:

```tsx
// Responsive grid layout
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap="md">
  <Card>Content 1</Card>
  <Card>Content 2</Card>
  <Card>Content 3</Card>
</Grid>
```

## ♿ Accessibility

- **ARIA attributes** on all interactive components
- **Keyboard navigation** support
- **Focus management** in modals and overlays
- **Screen reader** compatibility
- **Color contrast** compliance

## 🧪 Testing

```tsx
// Example test for Button component
import { render, screen } from '@testing-library/react';
import { Button } from '@/amal-ui';

test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

## 📚 Documentation

- **Component API**: Detailed props and usage examples
- **Design Tokens**: Color, spacing, and typography guidelines
- **Animation Guidelines**: Motion principles and best practices
- **Accessibility Guide**: WCAG compliance and testing

## 🤝 Contributing

1. Follow the established patterns and conventions
2. Ensure all components are type-safe
3. Include proper accessibility attributes
4. Add comprehensive tests
5. Update documentation

## 📄 License

This design system is part of the Amal Technologies project and follows the same licensing terms.

---

Built with ❤️ by the Amal Technologies team 