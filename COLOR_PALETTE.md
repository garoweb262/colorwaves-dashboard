# Color Palette Reference

This document provides a comprehensive reference for the color palette used in the Amal CMS dashboard.

## Primary Colors

### Violet (Main Primary Color)
- **Main**: `#70369D` - Used as the primary brand color
- **Shades**: Available from `palette-violet-50` to `palette-violet-900`
- **Usage**: Primary buttons, links, brand elements, main CTAs
- **Tailwind**: `bg-primary`, `text-primary`, `border-primary`

### Indigo (Secondary)
- **Main**: `#4B369D` - Used as secondary brand color
- **Shades**: Available from `palette-indigo-50` to `palette-indigo-900`
- **Usage**: Secondary buttons, accents, supporting elements
- **Tailwind**: `bg-secondary`, `text-secondary`, `border-secondary`

## Accent Colors

### Blue
- **Main**: `#487DE7` - Royal blue for accents
- **Shades**: Available from `palette-blue-50` to `palette-blue-900`
- **Usage**: Information elements, links, highlights
- **Tailwind**: `bg-accent`, `text-accent`, `border-accent`

### Green (Success)
- **Main**: `#79C214` - Lime green for success states
- **Shades**: Available from `palette-green-50` to `palette-green-900`
- **Usage**: Success messages, positive indicators, confirmations

### Yellow (Warning)
- **Main**: `#F9EA36` - Bright yellow for warnings
- **Shades**: Available from `palette-yellow-50` to `palette-yellow-900`
- **Usage**: Warning messages, caution indicators, alerts

### Red (Error/Destructive)
- **Main**: `#E81416` - Bright red for errors
- **Shades**: Available from `palette-red-50` to `palette-red-900`
- **Usage**: Error messages, destructive actions, critical alerts
- **Tailwind**: `bg-destructive`, `text-destructive`, `border-destructive`

## Additional Palette Colors

### Coral
- **Main**: `#FF6F61` - Vibrant coral
- **Shades**: Available from `palette-coral-50` to `palette-coral-900`
- **Usage**: Special highlights, decorative elements

### Gold
- **Main**: `#FFD700` - Bright gold
- **Shades**: Available from `palette-gold-50` to `palette-gold-900`
- **Usage**: Premium features, special offers, luxury elements

### Lime
- **Main**: `#A2D63A` - Vivid lime green
- **Shades**: Available from `palette-lime-50` to `palette-lime-900`
- **Usage**: Fresh content, new features, growth indicators

### Sky Blue
- **Main**: `#2E86C1` - Clear sky blue
- **Shades**: Available from `palette-sky-50` to `palette-sky-900`
- **Usage**: Trust elements, professional content, calm interfaces

## Usage Examples

### Tailwind Classes

```html
<!-- Primary violet button -->
<button class="bg-primary hover:bg-primary-600 text-primary-foreground">
  Primary Action
</button>

<!-- Secondary indigo button -->
<button class="bg-secondary hover:bg-secondary-600 text-secondary-foreground">
  Secondary Action
</button>

<!-- Accent blue button -->
<button class="bg-accent hover:bg-accent-600 text-accent-foreground">
  Accent Action
</button>

<!-- Destructive red button -->
<button class="bg-destructive hover:bg-destructive-600 text-destructive-foreground">
  Delete
</button>

<!-- Success message -->
<div class="bg-palette-green-50 border border-palette-green-200 text-palette-green-800">
  Success message
</div>

<!-- Warning message -->
<div class="bg-palette-yellow-50 border border-palette-yellow-200 text-palette-yellow-800">
  Warning message
</div>

<!-- Error message -->
<div class="bg-palette-red-50 border border-palette-red-200 text-palette-red-800">
  Error message
</div>
```

### ShadCN/UI Integration

The color palette is integrated with ShadCN/UI components:

```tsx
// Button component with primary color
<Button variant="default" className="bg-primary text-primary-foreground">
  Primary Button
</Button>

// Card component with accent color
<Card className="border-accent">
  <CardContent>
    <p className="text-accent">Accent content</p>
  </CardContent>
</Card>

// Alert component with success color
<Alert className="border-palette-green-200 bg-palette-green-50">
  <CheckCircle className="h-4 w-4 text-palette-green-600" />
  <AlertDescription className="text-palette-green-800">
    Success message
  </AlertDescription>
</Alert>
```

## Color Accessibility

All colors have been tested for accessibility compliance:

- **Contrast Ratios**: Meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Color Blindness**: Tested for protanopia, deuteranopia, and tritanopia
- **Readability**: Ensures text remains readable on all background combinations
- **Dark Mode**: Compatible with dark mode implementations

## Design Guidelines

1. **Primary Usage**: Use violet (`#70369D`) for main brand elements and primary actions
2. **Secondary Usage**: Use indigo (`#4B369D`) for secondary actions and supporting elements
3. **Accent Usage**: Use blue (`#487DE7`) for information and highlights
4. **State Colors**: Use green for success, yellow for warnings, red for errors
5. **Consistency**: Maintain consistent color usage across all dashboard pages and components
6. **Dark Mode**: Ensure colors work well in both light and dark themes

## Implementation Notes

- All colors are available as Tailwind CSS classes
- Each color has 10 shades (50-900) for flexibility
- Colors are defined in `tailwind.config.js`
- Use the `palette-` prefix for new color usage
- Primary, secondary, accent, and destructive colors are integrated with ShadCN/UI
- Legacy AmalTech colors are maintained for backward compatibility

## AmalTech Legacy Colors

For backward compatibility, the following legacy colors are still available:

- `amaltech-orange`: `#F26B1D`
- `amaltech-blue`: `#00274D`
- `amaltech-white`: `#FFFFFF`
- `amaltech-gray-*`: Gray scale from 50 to 900
