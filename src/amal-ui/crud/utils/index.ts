import { CRUDEntity, CRUDColumn, CRUDFilter, CRUDFormField } from '../types';

/**
 * Utility function to create a basic CRUD column
 */
export function createColumn(
  key: string,
  title: string,
  options?: Partial<CRUDColumn>
): CRUDColumn {
  return {
    key,
    title,
    sortable: true,
    align: 'left',
    ...options,
  };
}

/**
 * Utility function to create a text filter
 */
export function createTextFilter(
  key: string,
  label: string,
  placeholder?: string
): CRUDFilter {
  return {
    key,
    label,
    type: 'text',
    placeholder: placeholder || `Filter by ${label}`,
  };
}

/**
 * Utility function to create a select filter
 */
export function createSelectFilter(
  key: string,
  label: string,
  options: Array<{ value: string; label: string }>,
  placeholder?: string
): CRUDFilter {
  return {
    key,
    label,
    type: 'select',
    options,
    placeholder: placeholder || `All ${label}`,
  };
}

/**
 * Utility function to create a boolean filter
 */
export function createBooleanFilter(
  key: string,
  label: string
): CRUDFilter {
  return {
    key,
    label,
    type: 'boolean',
  };
}

/**
 * Utility function to create a form field
 */
export function createFormField(
  key: string,
  label: string,
  type: CRUDFormField['type'],
  options?: Partial<CRUDFormField>
): CRUDFormField {
  return {
    key,
    label,
    type,
    required: false,
    ...options,
  };
}

/**
 * Utility function to create status options
 */
export function createStatusOptions(
  statuses: Array<{ value: string; label: string; color: string }>
) {
  return statuses;
}

// Format functions are imported from utilities to avoid conflicts

/**
 * Utility function to get status color
 */
export function getStatusColor(status: string, statusOptions?: Array<{ value: string; color: string }>): string {
  if (!statusOptions) return 'gray';
  
  const option = statusOptions.find(opt => opt.value === status);
  return option?.color || 'gray';
}

/**
 * Utility function to get status label
 */
export function getStatusLabel(status: string, statusOptions?: Array<{ value: string; label: string }>): string {
  if (!statusOptions) return status;
  
  const option = statusOptions.find(opt => opt.value === status);
  return option?.label || status;
}

// Validation functions are imported from utilities to avoid conflicts

/**
 * Utility function to generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Performance functions are imported from utilities to avoid conflicts

/**
 * Utility function to deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Utility function to merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  
  return result;
}

/**
 * Utility function to get nested property value
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Utility function to set nested property value
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}
