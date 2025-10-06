import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Global logout function - will be set by the app
let globalLogoutHandler: ((message?: string) => void) | null = null;

export const setGlobalLogoutHandler = (handler: (message?: string) => void) => {
  globalLogoutHandler = handler;
};

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9004/api/v1';
// console.log('API_BASE_URL:', API_BASE_URL);

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
    // console.log('API Request:', {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   hasToken: !!token
    // });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('API Response:', {
    //   url: response.config.url,
    //   status: response.status,
    //   data: response.data
    // });
    return response;
  },
  (error) => {
    // console.error('API Error:', {
    //   url: error.config?.url,
    //   status: error.response?.status,
    //   message: error.message,
    //   data: error.response?.data
    // });
    
    if (error.response?.status === 401) {
      // Check if it's the specific 401 response format
      const responseData = error.response?.data;
      if (responseData?.message === "Invalid or expired token" && 
          responseData?.error === "Unauthorized" && 
          responseData?.statusCode === 401) {
        // Use global logout handler if available
        if (globalLogoutHandler) {
          globalLogoutHandler(responseData.message);
        } else {
          // Fallback to old behavior
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/';
          }
        }
      } else {
        // Handle other 401 responses
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/';
        }
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
      [key: string]: any; // Allow additional query parameters
    }
  ): Promise<{
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> => {
    // Build query parameters
    const queryParams: Record<string, any> = {};
    
    // Add pagination params
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    
    // Add search param
    if (params?.search) queryParams.search = params.search;
    
    // Add sorting params
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    
    // Add filters
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams[key] = value;
        }
      });
    }
    
    // Add any additional query parameters
    Object.entries(params || {}).forEach(([key, value]) => {
      if (!['page', 'limit', 'search', 'sortBy', 'sortOrder', 'filters'].includes(key) && 
          value !== null && value !== undefined && value !== '') {
        queryParams[key] = value;
      }
    });

    const response = await api.get(endpoint, { params: queryParams });
    
    // Helper function to transform _id to id
    const transformId = (item: any) => {
      if (item && item._id && !item.id) {
        return { ...item, id: item._id };
      }
      return item;
    };

    // Handle different response formats
    if (response.data && typeof response.data === 'object') {
      // If response has pagination metadata
      if (response.data.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data.map(transformId),
          total: response.data.total || response.data.data.length,
          page: response.data.page || params?.page || 1,
          limit: response.data.limit || params?.limit || 10,
          totalPages: response.data.totalPages || Math.ceil((response.data.total || response.data.data.length) / (response.data.limit || params?.limit || 10)),
          hasNextPage: response.data.hasNextPage || false,
          hasPrevPage: response.data.hasPrevPage || false
        };
      }
      
      // If response is an array directly
      if (Array.isArray(response.data)) {
        const total = response.data.length;
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const totalPages = Math.ceil(total / limit);
        
        return {
          success: true,
          data: response.data.map(transformId),
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        };
      }
    }
    
    // Fallback for unexpected response format
    return {
      success: true,
      data: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    };
  },

  // Get single item
  getItem: async <T>(endpoint: string, id: string): Promise<{ success: boolean; data: T }> => {
    const response = await api.get(`${endpoint}/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Get item by slug
  getItemBySlug: async <T>(endpoint: string, slug: string): Promise<{ success: boolean; data: T }> => {
    const url = `${endpoint}/slug/${slug}`;
    console.log('API getItemBySlug URL:', url);
    const response = await api.get(url);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create item
  createItem: async <T>(endpoint: string, data: Partial<T>): Promise<{ success: boolean; data: T }> => {
    const response = await api.post(endpoint, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update item
  updateItem: async <T>(
    endpoint: string,
    id: string,
    data: Partial<T>
  ): Promise<{ success: boolean; data: T }> => {
    // Use PATCH for all endpoints
    const response = await api.patch(`${endpoint}/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
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
    // All endpoints now use consistent { status: string } format
    const payload = { status };
    
    const response = await api.patch(`${endpoint}/${id}/status`, payload);
    return { success: true, data: response.data };
  },

  // Get items by slug (for multiple items with same slug pattern)
  getItemsBySlug: async <T>(endpoint: string, slug: string): Promise<{ success: boolean; data: T[] }> => {
    const response = await api.get(`${endpoint}/slug/${slug}`);
    const data = response.data;
    // Transform _id to id for each item if needed
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item && item._id && !item.id) {
          item.id = item._id;
        }
      });
    }
    return { success: true, data };
  }
};

// Newsletter API
export const newsletterAPI = {
  // Public endpoints
  subscribe: async (email: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/newsletter/subscribe', { email });
    return { success: true, data: response.data };
  },

  unsubscribe: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return { success: true, message: response.data.message };
  },

  // Admin endpoints
  getSubscribers: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/newsletter/subscribers');
    const data = response.data;
    // Transform _id to id for each item if needed
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item && item._id && !item.id) {
          item.id = item._id;
        }
      });
    }
    return { success: true, data };
  },

  getActiveSubscribers: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/newsletter/subscribers/active');
    const data = response.data;
    // Transform _id to id for each item if needed
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item && item._id && !item.id) {
          item.id = item._id;
        }
      });
    }
    return { success: true, data };
  },

  getStats: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get('/newsletter/subscribers/stats');
    return { success: true, data: response.data };
  },

  getSubscriber: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/newsletter/subscribers/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  updateSubscriber: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/newsletter/subscribers/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  deleteSubscriber: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/newsletter/subscribers/${id}`);
    return { success: true, message: "Subscriber deleted successfully" };
  },

  // Campaign management
  createCampaign: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/newsletter/campaigns', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  getCampaigns: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/newsletter/campaigns');
    const data = response.data;
    // Transform _id to id for each item if needed
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item && item._id && !item.id) {
          item.id = item._id;
        }
      });
    }
    return { success: true, data };
  },

  getCampaign: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/newsletter/campaigns/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  updateCampaign: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/newsletter/campaigns/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  deleteCampaign: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/newsletter/campaigns/${id}`);
    return { success: true, message: "Campaign deleted successfully" };
  },

  // Send newsletter
  sendNewsletter: async (data: { subject: string; messageContent: string; fileUrls?: string[] }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/newsletter/send', data);
    return { success: true, data: response.data };
  }
};

// Export the axios instance for custom requests
export default api;
