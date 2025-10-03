export interface CRUDEntity {
  id: string;
  [key: string]: any;
}

export interface CRUDColumn {
  key: string;
  title: string;
  render?: (item: CRUDEntity) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface CRUDFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface CRUDFormField {
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

export interface CRUDConfig {
  entityName: string;
  entityNamePlural: string;
  basePath: string;
  columns: CRUDColumn[];
  filters?: CRUDFilter[];
  formFields: CRUDFormField[];
  statusField?: string;
  statusOptions?: Array<{ value: string; label: string; color: string }>;
  searchFields?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
  showActions?: boolean;
  showStatusUpdate?: boolean;
  showBulkActions?: boolean;
  permissions?: {
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
  };
}

export interface CRUDState {
  items: CRUDEntity[];
  filteredItems: CRUDEntity[];
  selectedItems: string[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  searchTerm: string;
  filters: Record<string, any>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  selectedItem: CRUDEntity | null;
  isViewModalOpen: boolean;
  isFormModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isStatusModalOpen: boolean;
  editingItem: CRUDEntity | null;
}

export interface CRUDActions {
  // Data operations
  fetchItems: () => Promise<void>;
  createItem: (data: Partial<CRUDEntity>) => Promise<CRUDEntity>;
  updateItem: (id: string, data: Partial<CRUDEntity>) => Promise<CRUDEntity>;
  deleteItem: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  
  // UI operations
  setSearchTerm: (term: string) => void;
  setFilter: (key: string, value: any) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  selectItem: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  
  // Modal operations
  openViewModal: (item: CRUDEntity) => void;
  openFormModal: (item?: CRUDEntity) => void;
  openDeleteModal: (item: CRUDEntity) => void;
  openStatusModal: (item: CRUDEntity) => void;
  closeModals: () => void;
  
  // Bulk operations
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: string) => Promise<void>;
}

export interface CRUDHookReturn {
  state: CRUDState;
  actions: CRUDActions;
  config: CRUDConfig;
}

export interface CRUDTableProps {
  config: CRUDConfig;
  state: CRUDState;
  actions: CRUDActions;
  className?: string;
}

export interface CRUDFormModalProps {
  config: CRUDConfig;
  item: CRUDEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CRUDEntity) => void;
  isLoading?: boolean;
}

export interface CRUDViewModalProps {
  config: CRUDConfig;
  item: CRUDEntity;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface CRUDDeleteModalProps {
  config: CRUDConfig;
  item: CRUDEntity;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export interface StatusUpdateModalProps {
  config: CRUDConfig;
  item: CRUDEntity;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, status: string) => void;
  isLoading?: boolean;
}
