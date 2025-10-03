import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// File Upload API Types
export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    originalName: string;
    fileName: string;
    fileUrl: string;
    size: number;
    mimeType: string;
  };
}

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    originalName: string;
    fileName: string;
    fileUrl: string;
    size: number;
    mimeType: string;
  };
}

export interface MultipleFileUploadResponse {
  success: boolean;
  message: string;
  data: Array<{
    originalName: string;
    fileName: string;
    fileUrl: string;
    size: number;
    mimeType: string;
  }>;
}

// File Upload API Functions
export const uploadAPI = {
  // Upload single file
  uploadFile: async (file: File, folder?: string): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Upload single image
  uploadImage: async (image: File, folder?: string): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', image);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Upload multiple images
  uploadImages: async (images: File[], folder?: string): Promise<MultipleFileUploadResponse> => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Upload multiple files
  uploadFiles: async (files: File[], folder?: string): Promise<MultipleFileUploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await api.post('/upload/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Delete file
  deleteFile: async (fileName: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/upload/file/${fileName}`);
    return response.data;
  },
};

// Generic API functions for CRUD operations
export const crudAPI = {
  // Get items with pagination and filters
  getItems: async <T>(
    endpoint: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      filters?: Record<string, any>;
    }
  ): Promise<{
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await api.get(endpoint, { params });
    // Backend returns array directly, so we need to wrap it
    return {
      success: true,
      data: Array.isArray(response.data) ? response.data : [],
      total: Array.isArray(response.data) ? response.data.length : 0,
      page: 1,
      limit: params?.limit || 10,
      totalPages: 1
    };
  },

  // Get single item
  getItem: async <T>(endpoint: string, id: string): Promise<{ success: boolean; data: T }> => {
    const response = await api.get(`${endpoint}/${id}`);
    return { success: true, data: response.data };
  },

  // Create item
  createItem: async <T>(endpoint: string, data: Partial<T>): Promise<{ success: boolean; data: T }> => {
    const response = await api.post(endpoint, data);
    return { success: true, data: response.data };
  },

  // Update item
  updateItem: async <T>(
    endpoint: string,
    id: string,
    data: Partial<T>
  ): Promise<{ success: boolean; data: T }> => {
    const response = await api.put(`${endpoint}/${id}`, data);
    return { success: true, data: response.data };
  },

  // Delete item
  deleteItem: async (endpoint: string, id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`${endpoint}/${id}`);
    return { success: true, message: "Item deleted successfully" };
  },

  // Bulk delete items
  bulkDelete: async (endpoint: string, ids: string[]): Promise<{ success: boolean; message: string }> => {
    // Since backend doesn't have bulk delete, we'll delete one by one
    for (const id of ids) {
      await api.delete(`${endpoint}/${id}`);
    }
    return { success: true, message: "Items deleted successfully" };
  },

  // Update status
  updateStatus: async (
    endpoint: string,
    id: string,
    status: string
  ): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`${endpoint}/${id}`, { status });
    return { success: true, data: response.data };
  },
};

// Export the axios instance for custom requests
export default api;
