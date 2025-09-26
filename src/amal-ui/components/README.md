# Hero Component

A highly configurable and reusable hero section component with multiple variants for different page types.

## Features

- **Multiple Variants**: Level 1 (super hero), Level 2, Level 3, Blog, Product, Solution, Career
- **Flexible Layouts**: Left, Center, Right, Split layouts
- **Background Options**: Image, Gradient, Solid color, Video backgrounds
- **Animation Support**: Multiple animation types with configurable delays
- **Responsive Design**: Mobile-first responsive design
- **Internationalization**: Full i18n support
- **TypeScript**: Fully typed with comprehensive interfaces

## Variants

### Level 1 (Super Hero)
- Full-screen height
- Two-column layout (content + visual)
- Large typography
- Decorative elements
- Perfect for homepage hero sections

### Level 2-3 (Standard Hero)
- Standard padding
- Centered or left-aligned content
- Breadcrumb support
- Stats display option
- Ideal for product, solution, and career pages

### Blog/Product/Solution/Career
- Specialized layouts for specific content types
- Breadcrumb navigation
- Category tags
- Optimized for content-heavy pages

## Usage

### Basic Usage

```tsx
import { Hero } from "@/amal-ui/components";

<Hero
  variant="level1"
  title="Your Hero Title"
  subtitle="Your Hero Subtitle"
  description="Your hero description text"
  tagline="Optional tagline"
  cta={{
    text: "Get Started",
    href: "/get-started",
    variant: "primary"
  }}
  secondaryCta={{
    text: "Learn More",
    href: "/learn-more",
    variant: "outline"
  }}
/>
```

### Homepage Super Hero

```tsx
<Hero
  variant="level1"
  title="WE ARE BUILDING THE FUTURE OF STEEL"
  subtitle="Leading the transformation of steel manufacturing through innovative technology solutions"
  description="From smart meters to industrial automation, we're building the technology that powers tomorrow's steel industries."
  tagline="Founded in 1995"
  cta={{
    text: "LEARN MORE",
    href: "/about",
    variant: "primary"
  }}
  secondaryCta={{
    text: "Explore Solutions",
    href: "/solutions",
    variant: "outline"
  }}
  background={{
    type: "gradient",
    gradient: "bg-gradient-to-br from-orange-400 via-red-500 to-orange-600"
  }}
  stats={[
    { value: "25+", label: "Years of Innovation" },
    { value: "100+", label: "Steel Projects" },
    { value: "15+", label: "Countries Served" },
    { value: "ISO", label: "Quality Certified" }
  ]}
  animation="fadeIn"
  animationDelay={0.2}
/>
```

### Product Page Hero

```tsx
<Hero
  variant="level2"
  title="Smart Steel Monitoring System"
  subtitle="Real-time monitoring and analytics for steel manufacturing"
  description="Advanced IoT sensors and AI-powered analytics for optimal steel production efficiency."
  tagline="IoT Solutions"
  cta={{
    text: "Get Quote",
    href: "/quote",
    variant: "primary"
  }}
  background={{
    type: "image",
    src: "/images/products/steel-monitoring.jpg",
    alt: "Steel monitoring system",
    overlay: true
  }}
  showBreadcrumbs={true}
  breadcrumbs={[
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Smart Steel Monitoring", href: "/products/steel-monitoring" }
  ]}
  layout="left"
  size="lg"
/>
```

### Blog Post Hero

```tsx
<Hero
  variant="blog"
  title="The Future of Steel Manufacturing in 2024"
  subtitle="How AI and IoT are revolutionizing the steel industry"
  tagline="Industry Insights"
  cta={{
    text: "Read Full Article",
    href: "#content",
    variant: "primary"
  }}
  background={{
    type: "image",
    src: "/images/blog/steel-future.jpg",
    alt: "Future of steel manufacturing",
    overlay: true,
    overlayColor: "bg-black/50"
  }}
  showBreadcrumbs={true}
  breadcrumbs={[
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Industry Insights", href: "/blog/industry-insights" }
  ]}
  layout="center"
  size="md"
/>
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"level1" \| "level2" \| "level3" \| "blog" \| "product" \| "solution" \| "career"` | `"level1"` | Hero variant type |
| `title` | `string` | **Required** | Main hero title |
| `subtitle` | `string` | - | Hero subtitle |
| `description` | `string` | - | Hero description |
| `tagline` | `string` | - | Small tagline text |

### CTA Props

| Prop | Type | Description |
|------|------|-------------|
| `cta` | `{ text: string; href: string; variant?: "primary" \| "secondary" \| "outline"; icon?: ReactNode }` | Primary call-to-action button |
| `secondaryCta` | `{ text: string; href: string; variant?: "primary" \| "secondary" \| "outline"; icon?: ReactNode }` | Secondary call-to-action button |

### Background Props

| Prop | Type | Description |
|------|------|-------------|
| `background.type` | `"image" \| "gradient" \| "solid" \| "video"` | Background type |
| `background.src` | `string` | Image/video source URL |
| `background.gradient` | `string` | Tailwind gradient classes |
| `background.color` | `string` | Solid color (CSS color value) |
| `background.overlay` | `boolean` | Show overlay on background |
| `background.overlayColor` | `string` | Overlay color classes |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `"left" \| "center" \| "right" \| "split"` | `"left"` | Content alignment |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"lg"` | Section padding size |
| `animation` | `"fadeIn" \| "slideUp" \| "slideLeft" \| "slideRight" \| "zoomIn" \| "none"` | `"fadeIn"` | Animation type |
| `animationDelay` | `number` | `0` | Animation delay in seconds |

### Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showBreadcrumbs` | `boolean` | `false` | Show breadcrumb navigation |
| `breadcrumbs` | `Array<{name: string; href: string}>` | `[]` | Breadcrumb items |

### Stats Props

| Prop | Type | Description |
|------|------|-------------|
| `stats` | `Array<{value: string; label: string; icon?: ReactNode}>` | Statistics to display |

## Content Structure

The component expects content to be structured in JSON format for easy management:

```json
{
  "hero": {
    "title": "Main Title",
    "subtitle": "Subtitle text",
    "description": "Description text",
    "tagline": "Tagline text",
    "cta": {
      "text": "Button Text",
      "href": "/link",
      "variant": "primary"
    },
    "secondaryCta": {
      "text": "Secondary Button",
      "href": "/secondary-link",
      "variant": "outline"
    },
    "background": {
      "type": "gradient",
      "gradient": "bg-gradient-to-br from-blue-600 to-purple-600"
    },
    "stats": [
      {
        "value": "25+",
        "label": "Years of Innovation"
      }
    ]
  }
}
```

## Styling

The component uses Tailwind CSS classes and can be customized with:

- **Custom className**: Pass additional CSS classes
- **Background variants**: Multiple background types and overlay options
- **Responsive design**: Mobile-first responsive breakpoints
- **Animation customization**: Configurable animation types and delays

## Best Practices

1. **Use appropriate variants** for different page types
2. **Keep titles concise** but impactful
3. **Use high-quality images** for image backgrounds
4. **Ensure proper contrast** between text and background
5. **Test on mobile devices** for responsive behavior
6. **Optimize images** for web performance
7. **Use meaningful CTAs** with clear action verbs

## Examples

See the homepage implementation in `src/app/[locale]/page.tsx` for a complete example of the Level 1 variant.

