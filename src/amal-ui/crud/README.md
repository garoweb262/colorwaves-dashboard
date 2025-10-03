# CRUD System

A comprehensive, reusable CRUD (Create, Read, Update, Delete) system for the dashboard application. This system provides a complete set of components, hooks, and utilities for building data management interfaces.

## Features

- **Generic CRUD Components**: Reusable table, form, view, and delete modals
- **Custom Hooks**: `useCRUD` hook for state management and API operations
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Flexible Configuration**: Highly configurable for different entity types
- **Built-in Features**: Search, filtering, sorting, pagination, bulk operations
- **Status Management**: Built-in status update functionality
- **Responsive Design**: Mobile-friendly components
- **Accessibility**: ARIA labels and keyboard navigation support

## Quick Start

### 1. Import the CRUD system

```tsx
import { useCRUD, CRUDTable, CRUDFormModal, CRUDViewModal, CRUDDeleteModal, StatusUpdateModal } from '@/amal-ui/crud';
import { CRUDConfig } from '@/amal-ui/crud/types';
import { createColumn, createTextFilter, createSelectFilter, createFormField, createStatusOptions } from '@/amal-ui/crud/utils';
```

### 2. Define your entity interface

```tsx
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}
```

### 3. Create CRUD configuration

```tsx
const productsConfig: CRUDConfig = {
  entityName: 'Product',
  entityNamePlural: 'Products',
  basePath: 'products',
  searchFields: ['name', 'description', 'category'],
  sortBy: 'createdAt',
  sortOrder: 'desc',
  pageSize: 10,
  showActions: true,
  showStatusUpdate: true,
  showBulkActions: true,
  statusField: 'status',
  statusOptions: createStatusOptions([
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'draft', label: 'Draft', color: 'yellow' },
  ]),
  columns: [
    createColumn('name', 'Product Name'),
    createColumn('price', 'Price', {
      render: (product: Product) => `$${product.price.toFixed(2)}`
    }),
    createColumn('status', 'Status'),
  ],
  filters: [
    createTextFilter('name', 'Product Name'),
    createSelectFilter('category', 'Category', [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
    ]),
  ],
  formFields: [
    createFormField('name', 'Product Name', 'text', { required: true }),
    createFormField('description', 'Description', 'textarea', { required: true }),
    createFormField('price', 'Price', 'number', { required: true }),
    createFormField('category', 'Category', 'select', {
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
      ]
    }),
  ],
};
```

### 4. Use the CRUD system in your component

```tsx
export default function ProductsPage() {
  const { state, actions, config } = useCRUD(productsConfig);

  useEffect(() => {
    actions.fetchItems();
  }, [actions]);

  const handleSave = async (item: Product) => {
    try {
      if (item.id && state.items.some(i => i.id === item.id)) {
        await actions.updateItem(item.id, item);
      } else {
        await actions.createItem(item);
      }
      actions.closeModals();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await actions.deleteItem(id);
      actions.closeModals();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <DashboardLayout>
      <CRUDTable
        config={config}
        state={state}
        actions={actions}
      />

      {/* Modals */}
      {state.selectedItem && (
        <CRUDViewModal
          config={config}
          item={state.selectedItem}
          isOpen={state.isViewModalOpen}
          onClose={actions.closeModals}
          onEdit={() => {
            actions.closeModals();
            actions.openFormModal(state.selectedItem!);
          }}
          onDelete={() => {
            actions.closeModals();
            actions.openDeleteModal(state.selectedItem!);
          }}
        />
      )}

      <CRUDFormModal
        config={config}
        item={state.editingItem}
        isOpen={state.isFormModalOpen}
        onClose={actions.closeModals}
        onSave={handleSave}
        isLoading={state.isCreating || state.isUpdating}
      />

      {state.selectedItem && (
        <CRUDDeleteModal
          config={config}
          item={state.selectedItem}
          isOpen={state.isDeleteModalOpen}
          onClose={actions.closeModals}
          onConfirm={handleDelete}
          isLoading={state.isDeleting}
        />
      )}

      {state.selectedItem && (
        <StatusUpdateModal
          config={config}
          item={state.selectedItem}
          isOpen={state.isStatusModalOpen}
          onClose={actions.closeModals}
          onUpdate={handleStatusUpdate}
          isLoading={state.isUpdating}
        />
      )}
    </DashboardLayout>
  );
}
```

## Configuration Options

### CRUDConfig

| Property | Type | Description |
|----------|------|-------------|
| `entityName` | `string` | Singular name of the entity |
| `entityNamePlural` | `string` | Plural name of the entity |
| `basePath` | `string` | API base path for CRUD operations |
| `columns` | `CRUDColumn[]` | Table column definitions |
| `filters` | `CRUDFilter[]` | Filter definitions |
| `formFields` | `CRUDFormField[]` | Form field definitions |
| `statusField` | `string` | Field name for status updates |
| `statusOptions` | `StatusOption[]` | Available status options |
| `searchFields` | `string[]` | Fields to search in |
| `sortBy` | `string` | Default sort field |
| `sortOrder` | `'asc' \| 'desc'` | Default sort order |
| `pageSize` | `number` | Items per page |
| `showActions` | `boolean` | Show action buttons |
| `showStatusUpdate` | `boolean` | Show status update button |
| `showBulkActions` | `boolean` | Show bulk action buttons |

### Column Types

```tsx
interface CRUDColumn {
  key: string;
  title: string;
  render?: (item: CRUDEntity) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}
```

### Filter Types

```tsx
interface CRUDFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}
```

### Form Field Types

```tsx
interface CRUDFormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
  dependsOn?: string;
  showWhen?: (formData: any) => boolean;
}
```

## Utility Functions

### Column Creation

```tsx
createColumn(key: string, title: string, options?: Partial<CRUDColumn>)
```

### Filter Creation

```tsx
createTextFilter(key: string, label: string, placeholder?: string)
createSelectFilter(key: string, label: string, options: Array<{ value: string; label: string }>, placeholder?: string)
createBooleanFilter(key: string, label: string)
```

### Form Field Creation

```tsx
createFormField(key: string, label: string, type: CRUDFormField['type'], options?: Partial<CRUDFormField>)
```

### Status Options

```tsx
createStatusOptions(statuses: Array<{ value: string; label: string; color: string }>)
```

## Examples

See the `examples/` directory for complete implementations:

- `ProductsExample.tsx` - Product management with pricing and inventory
- `ServicesExample.tsx` - Service management with duration and popularity

## API Integration

The CRUD system expects the following API endpoints:

- `GET /api/{basePath}` - Fetch all items
- `POST /api/{basePath}` - Create new item
- `PUT /api/{basePath}/{id}` - Update item
- `DELETE /api/{basePath}/{id}` - Delete item
- `PATCH /api/{basePath}/{id}/status` - Update item status
- `DELETE /api/{basePath}/bulk-delete` - Bulk delete items
- `PATCH /api/{basePath}/bulk-status` - Bulk update status

## Customization

### Custom Column Rendering

```tsx
createColumn('status', 'Status', {
  render: (item: Product) => (
    <Badge color={item.status === 'active' ? 'green' : 'gray'}>
      {item.status}
    </Badge>
  )
})
```

### Custom Form Fields

```tsx
createFormField('description', 'Description', 'textarea', {
  required: true,
  placeholder: 'Enter product description',
  validation: {
    min: 10,
    message: 'Description must be at least 10 characters'
  }
})
```

### Conditional Fields

```tsx
createFormField('discount', 'Discount', 'number', {
  showWhen: (formData) => formData.category === 'electronics',
  validation: {
    min: 0,
    max: 100,
    message: 'Discount must be between 0 and 100'
  }
})
```

## Best Practices

1. **Define clear entity interfaces** with proper TypeScript types
2. **Use utility functions** for creating columns, filters, and form fields
3. **Implement proper error handling** in your save/delete handlers
4. **Customize column rendering** for better UX
5. **Use status options** for consistent status management
6. **Implement proper validation** in form fields
7. **Handle loading states** appropriately
8. **Test with different screen sizes** for responsiveness

## Troubleshooting

### Common Issues

1. **Type errors**: Ensure your entity interface matches the CRUDEntity interface
2. **API errors**: Check that your API endpoints match the expected format
3. **Form validation**: Verify that validation rules are properly configured
4. **Modal not opening**: Check that the modal state is properly managed

### Debug Tips

1. Use browser dev tools to inspect the CRUD state
2. Check console for API errors
3. Verify that all required configuration options are provided
4. Test with mock data first before integrating with real APIs
