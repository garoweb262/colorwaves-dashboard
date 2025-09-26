# AmalTech CMS Dashboard

A modern, feature-rich content management system built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🎨 Modern Design
- **Dark Theme Sidebar**: Elegant dark sidebar with smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Professional UI**: Clean, modern interface following design best practices

### 🧭 Smart Navigation
- **Collapsible Sidebar**: Dynamic width adjustment (70px collapsed, 280px expanded)
- **Role-Based Access Control**: Menu items filtered by user permissions
- **Dropdown Menus**: Hierarchical navigation with expandable submenus
- **Breadcrumb Navigation**: Clear page hierarchy and navigation paths

### 🔐 Role-Based Access Control
- **5 User Roles**: Super Administrator, Administrator, Content Manager, Editor, Viewer
- **Dynamic Menu Filtering**: Menu items automatically filtered by user role
- **Role Switcher**: Easy testing of different permission levels
- **Secure Access**: Protected routes based on user authentication

### 📊 Dashboard Components
- **Metrics Cards**: Beautiful stat displays with icons and trends
- **Chart Visualizations**: Placeholder charts for data representation
- **Responsive Grids**: Adaptive layouts for different screen sizes
- **Interactive Elements**: Hover effects and smooth transitions

### 🛠️ Technical Features
- **Next.js 14 App Router**: Latest Next.js with modern routing
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Professional animations and transitions
- **Context API**: Global state management for user authentication

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Amal-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard page
│   ├── content/           # Content management
│   ├── analytics/         # Analytics and reports
│   ├── users/             # User management
│   ├── demo/              # Feature demonstrations
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable React components
│   ├── ui/               # UI components (tables, modals, etc.)
│   ├── Sidebar.tsx       # Collapsible sidebar component
│   ├── TopNavbar.tsx     # Top navigation bar
│   ├── Breadcrumb.tsx    # Navigation breadcrumbs
│   ├── DashboardLayout.tsx # Main dashboard wrapper
│   └── RoleSwitcher.tsx  # Role testing component
├── contexts/              # React Context providers
│   └── UserContext.tsx   # User authentication and role management
├── lib/                   # Utility functions and configurations
│   ├── menuConfig.ts     # Menu structure and role permissions
│   └── utils.ts          # Utility functions
└── amal-ui/              # Custom UI component library
```

## Usage

### Sidebar Navigation
- **Toggle Sidebar**: Click the chevron button to collapse/expand
- **Menu Navigation**: Click menu items to navigate between pages
- **Dropdown Menus**: Click items with arrows to expand submenus
- **Role Testing**: Use the role switcher in the sidebar footer

### Breadcrumbs
- **Automatic Generation**: Breadcrumbs automatically generated for each page
- **Navigation**: Click breadcrumb items to navigate to parent pages
- **Current Page**: Last item shows current page (non-clickable)

### Table Features
- **Search**: Global search across all visible columns
- **Filtering**: Column-specific filters for precise data filtering
- **Sorting**: Click column headers to sort data
- **Pagination**: Navigate through large datasets
- **Row Selection**: Select individual or all rows
- **Bulk Actions**: Perform operations on multiple selected items
- **Column Management**: Show/hide columns and configure properties
- **Export Options**: Export data in CSV, Excel, or PDF formats

### Modal System
- **Flexible Modals**: Different sizes (sm, md, lg, xl, full)
- **Specialized Components**: ConfirmModal, FormModal for common use cases
- **Customizable**: Full control over content, styling, and behavior
- **Accessibility**: Keyboard navigation and screen reader support

## Available Pages

- **Dashboard** (`/dashboard`): Main dashboard with metrics and charts
- **Content** (`/content`): Website content management
- **Analytics** (`/analytics`): Data analytics and reports
- **Users** (`/users`): User management with advanced table features
- **Demo** (`/demo/table`): Table features demonstration

## Customization

### Adding New Menu Items
Edit `src/lib/menuConfig.ts` to add new menu items:
```typescript
{
  title: "New Section",
  href: "/new-section",
  icon: <NewIcon className="h-5 w-5" />,
  roles: ["admin", "content_manager"],
  children: [
    { title: "Sub Item", href: "/new-section/sub", icon: <SubIcon className="h-4 w-4" />, roles: ["admin"] }
  ]
}
```

### Styling
- **Tailwind CSS**: Use Tailwind classes for custom styling
- **CSS Variables**: Customize colors and spacing in `globals.css`
- **Component Props**: Most components accept `className` for custom styling

### Adding New Roles
Extend the roles array in `src/lib/menuConfig.ts`:
```typescript
export const roles: Role[] = [
  // ... existing roles
  { id: "new_role", name: "New Role", description: "Description here" }
];
```

## Components

### DashboardLayout
Main wrapper component that provides:
- Sidebar navigation
- Top navbar
- Breadcrumb navigation
- Responsive layout management

### Sidebar
Collapsible sidebar with:
- Role-based menu filtering
- Smooth animations
- User information display
- Role switcher for testing

### TopNavbar
Top navigation bar featuring:
- Breadcrumb display
- Search functionality
- User menu
- Dark mode toggle
- Mobile responsiveness

### Breadcrumb
Navigation component that:
- Shows current page hierarchy
- Provides clickable navigation
- Automatically adapts to page structure

### RoleSwitcher
Testing component that:
- Allows switching between user roles
- Shows available permissions
- Helps test role-based access control

### DataTable
Advanced table component with:
- **Search & Filtering**: Global search and column filters
- **Sorting**: Click column headers to sort
- **Pagination**: Navigate through large datasets
- **Row Selection**: Select individual or all rows
- **Bulk Actions**: Perform operations on multiple items
- **Column Management**: Show/hide columns dynamically
- **Export Options**: CSV, Excel, PDF export
- **Custom Actions**: Row-level action buttons
- **Responsive Design**: Works on all screen sizes

### Modal System
Comprehensive modal components:
- **Modal**: Base modal with full customization
- **ConfirmModal**: Confirmation dialogs
- **FormModal**: Form-based modals with validation
- **Size Variants**: sm, md, lg, xl, full
- **Accessibility**: Keyboard navigation and screen reader support

### TableOptions
Advanced table configuration:
- **Column Visibility**: Show/hide columns
- **Column Properties**: Configure sorting and filtering
- **Custom Filters**: Add custom filter components
- **Export Options**: Multiple export formats
- **Reset Functionality**: Restore default settings

## State Management

The application uses React Context API for global state:
- **UserContext**: Manages user authentication and roles
- **Local State**: Component-level state for UI interactions
- **No External State**: Lightweight and performant

## Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Responsive breakpoints for all screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Adaptive Layout**: Sidebar automatically collapses on mobile

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Core functionality works without JavaScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.

