import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 2;
          }
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
    },
  },
});

// Query Keys Factory
export const queryKeys = {
  // Generic CRUD keys
  all: (entity: string) => [entity] as const,
  lists: (entity: string) => [entity, 'list'] as const,
  list: (entity: string, filters?: Record<string, any>) => [entity, 'list', { filters }] as const,
  details: (entity: string) => [entity, 'detail'] as const,
  detail: (entity: string, id: string) => [entity, 'detail', id] as const,

  // Specific entity keys
  products: {
    all: ['products'] as const,
    lists: ['products', 'list'] as const,
    list: (filters?: Record<string, any>) => ['products', 'list', { filters }] as const,
    details: ['products', 'detail'] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  services: {
    all: ['services'] as const,
    lists: ['services', 'list'] as const,
    list: (filters?: Record<string, any>) => ['services', 'list', { filters }] as const,
    details: ['services', 'detail'] as const,
    detail: (id: string) => ['services', 'detail', id] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    lists: ['testimonials', 'list'] as const,
    list: (filters?: Record<string, any>) => ['testimonials', 'list', { filters }] as const,
    details: ['testimonials', 'detail'] as const,
    detail: (id: string) => ['testimonials', 'detail', id] as const,
  },
  applications: {
    all: ['applications'] as const,
    lists: ['applications', 'list'] as const,
    list: (filters?: Record<string, any>) => ['applications', 'list', { filters }] as const,
    details: ['applications', 'detail'] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
  },
  partnershipRequests: {
    all: ['partnership-requests'] as const,
    lists: ['partnership-requests', 'list'] as const,
    list: (filters?: Record<string, any>) => ['partnership-requests', 'list', { filters }] as const,
    details: ['partnership-requests', 'detail'] as const,
    detail: (id: string) => ['partnership-requests', 'detail', id] as const,
  },
  projectRequests: {
    all: ['project-requests'] as const,
    lists: ['project-requests', 'list'] as const,
    list: (filters?: Record<string, any>) => ['project-requests', 'list', { filters }] as const,
    details: ['project-requests', 'detail'] as const,
    detail: (id: string) => ['project-requests', 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    lists: ['users', 'list'] as const,
    list: (filters?: Record<string, any>) => ['users', 'list', { filters }] as const,
    details: ['users', 'detail'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
};
