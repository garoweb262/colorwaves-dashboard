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
    // Skip global logout for explicitly public requests
    const skipLogout = error?.config?.headers && (error.config.headers as any)['x-skip-auth-logout'] === 'true';
    if (skipLogout) {
      return Promise.reject(error);
    }
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
  sendNewsletter: async (data: { subject: string; messageContent: string; headerImageUrl?: string; fileUrls?: string[] }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/newsletter/send', data);
    return { success: true, data: response.data };
  }
};

// Contact Messages API
export const contactMessagesAPI = {
  // Get all contact messages
  getMessages: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/contacts');
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

  // Get single contact message
  getMessage: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/contacts/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create contact message
  createMessage: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/contacts', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update contact message
  updateMessage: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/contacts/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete contact message
  deleteMessage: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/contacts/${id}`);
    return { success: true, message: "Contact message deleted successfully" };
  },

  // Reply to contact message
  replyToMessage: async (id: string, replyData: { reply: string; status: string }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(`/contacts/${id}/reply`, replyData);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update message status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/contacts/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Project Requests API
export const projectRequestsAPI = {
  // Get all project requests
  getRequests: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/project-requests');
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

  // Get single project request
  getRequest: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/project-requests/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create project request
  createRequest: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/project-requests', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update project request
  updateRequest: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/project-requests/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete project request
  deleteRequest: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/project-requests/${id}`);
    return { success: true, message: "Project request deleted successfully" };
  },

  // Reply to project request
  replyToRequest: async (id: string, replyData: { reply: string; status: string }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(`/project-requests/${id}/reply`, replyData);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update request status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/project-requests/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Partnership Requests API
export const partnershipRequestsAPI = {
  // Get all partnership requests
  getRequests: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/partnership-requests');
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

  // Get single partnership request
  getRequest: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/partnership-requests/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create partnership request
  createRequest: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/partnership-requests', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update partnership request
  updateRequest: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/partnership-requests/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete partnership request
  deleteRequest: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/partnership-requests/${id}`);
    return { success: true, message: "Partnership request deleted successfully" };
  },

  // Reply to partnership request
  replyToRequest: async (id: string, replyData: { reply: string; status: string }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(`/partnership-requests/${id}/reply`, replyData);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update request status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/partnership-requests/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Blogs API
export const blogsAPI = {
  // Get all blogs (Admin)
  getBlogs: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/blogs');
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

  // Get single blog by ID (Admin)
  getBlog: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/blogs/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Get blog by slug (Admin via JWT): fetch all and match slug
  getBlogBySlug: async (slug: string): Promise<{ success: boolean; data: any }> => {
    // Use admin list with JWT, then find by slug locally
    const listRes = await api.get('/blogs', { headers: { 'x-skip-auth-logout': 'true' } });
    const items = Array.isArray(listRes.data) ? listRes.data : (listRes.data?.data || []);
    const found = items.find((b: any) => b?.slug === slug);
    if (!found) {
      throw { response: { data: { message: 'Blog not found', statusCode: 404 } } };
    }
    if (found && found._id && !found.id) found.id = found._id;
    return { success: true, data: found };
  },

  // Create blog
  createBlog: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/blogs', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update blog
  updateBlog: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/blogs/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/blogs/${id}`);
    return { success: true, message: "Blog deleted successfully" };
  },

  // Update blog status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/blogs/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update blog featured status
  updateFeatured: async (id: string, isFeatured: boolean): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/blogs/${id}/featured`, { isFeatured });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Get blog statistics
  getStats: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get('/blogs/stats');
    return { success: true, data: response.data };
  },

  // Public endpoints (using static token)
  getPublishedBlogs: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/blogs/public');
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

  getFeaturedBlogs: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/blogs/featured');
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

  getPopularBlogs: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/blogs/popular');
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

  getBlogsByCategory: async (category: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/blogs/category/${category}`);
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

  getBlogsByTag: async (tag: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/blogs/tag/${tag}`);
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

  // Increment view count (Public)
  incrementViewCount: async (slug: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/blogs/slug/${slug}/view`);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Increment like count (Public)
  incrementLikeCount: async (slug: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/blogs/slug/${slug}/like`);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Products API
export const productsAPI = {
  // Get all products (Admin)
  getProducts: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/products');
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

  // Get single product by ID (Admin)
  getProduct: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/products/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create product
  createProduct: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/products', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update product
  updateProduct: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/products/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete product
  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/products/${id}`);
    return { success: true, message: "Product deleted successfully" };
  },

  // Update product status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/products/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Projects API
export const projectsAPI = {
  // Get all projects
  getProjects: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/projects');
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

  // Get single project by ID
  getProject: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/projects/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Get project by slug
  getProjectBySlug: async (slug: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/projects/slug/${slug}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create project
  createProject: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/projects', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update project
  updateProject: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/projects/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete project
  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/projects/${id}`);
    return { success: true, message: "Project deleted successfully" };
  },

  // Update project status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/projects/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Teams API
export const teamsAPI = {
  // Get all team members
  getTeams: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/teams');
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

  // Get single team member by ID
  getTeam: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/teams/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create team member
  createTeam: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/teams', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update team member
  updateTeam: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/teams/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete team member
  deleteTeam: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/teams/${id}`);
    return { success: true, message: "Team member deleted successfully" };
  },

  // Update team member status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/teams/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Partners API
export const partnersAPI = {
  // Get all partners
  getPartners: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/partners');
    const data = response.data;
    if (Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item && item._id && !item.id) {
          item.id = item._id;
        }
      });
    }
    return { success: true, data };
  },

  // Get single partner by ID
  getPartner: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/partners/${id}`);
    const data = response.data;
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create partner
  createPartner: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/partners', data);
    const responseData = response.data;
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update partner
  updatePartner: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/partners/${id}`, data);
    const responseData = response.data;
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete partner
  deletePartner: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/partners/${id}`);
    return { success: true, message: 'Partner deleted successfully' };
  },

  // Update partner status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/partners/${id}/status`, { status });
    return { success: true, data: response.data };
  },
};

// Testimonies API
export const testimoniesAPI = {
  // Get all testimonies
  getTestimonies: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/testimonies');
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

  // Get single testimony by ID
  getTestimony: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/testimonies/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create testimony
  createTestimony: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/testimonies', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update testimony
  updateTestimony: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/testimonies/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete testimony
  deleteTestimony: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/testimonies/${id}`);
    return { success: true, message: "Testimony deleted successfully" };
  },

  // Update testimony status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/testimonies/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// FAQs API
export const faqsAPI = {
  // Get all FAQs
  getFaqs: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/faqs');
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

  // Get single FAQ by ID
  getFaq: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/faqs/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create FAQ
  createFaq: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/faqs', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update FAQ
  updateFaq: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/faqs/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete FAQ
  deleteFaq: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/faqs/${id}`);
    return { success: true, message: "FAQ deleted successfully" };
  },

  // Update FAQ status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/faqs/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// News API
export const newsAPI = {
  // Get all news (Admin)
  getNews: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/news');
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

  // Get single news item by ID (Admin)
  getNewsItem: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/news/${id}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Get news by slug (Public)
  getNewsBySlug: async (slug: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/news/slug/${slug}`);
    const data = response.data;
    // Transform _id to id if needed
    if (data && data._id && !data.id) {
      data.id = data._id;
    }
    return { success: true, data };
  },

  // Create news
  createNews: async (data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/news', data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update news
  updateNews: async (id: string, data: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/news/${id}`, data);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Delete news
  deleteNews: async (id: string): Promise<{ success: boolean; message: string }> => {
    await api.delete(`/news/${id}`);
    return { success: true, message: "News deleted successfully" };
  },

  // Update news status
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/news/${id}/status`, { status });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Update news featured status
  updateFeatured: async (id: string, isFeatured: boolean): Promise<{ success: boolean; data: any }> => {
    const response = await api.patch(`/news/${id}/featured`, { isFeatured });
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  },

  // Get news statistics
  getStats: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get('/news/stats');
    return { success: true, data: response.data };
  },

  // Public endpoints
  getPublishedNews: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/news/published');
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

  getFeaturedNews: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/news/featured');
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

  getNewsByTag: async (tag: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get(`/news/tag/${tag}`);
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

  // Increment view count (Public)
  incrementViewCount: async (slug: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`/news/slug/${slug}/view`);
    const responseData = response.data;
    // Transform _id to id if needed
    if (responseData && responseData._id && !responseData.id) {
      responseData.id = responseData._id;
    }
    return { success: true, data: responseData };
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  // Forgot Password
  forgotPassword: async (email: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send OTP' 
      };
    }
  },

  // Verify OTP
  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid OTP' 
      };
    }
  },

  // Reset Password
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password' 
      };
    }
  },

  // Get Profile
  getProfile: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.get('/auth/profile');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to get profile' 
      };
    }
  },

  // Refresh Token
  refreshToken: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/auth/refresh');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to refresh token' 
      };
    }
  }
};

// Statistics API
export const statisticsAPI = {
  // Get dashboard statistics
  getDashboardStatistics: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.get('/statistics/dashboard');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics' 
      };
    }
  },

  // Get all statistics
  getAllStatistics: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.get('/statistics');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch statistics' 
      };
    }
  },

  // Get service statistics
  getServiceStatistics: async (serviceName: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.get(`/statistics/service/${serviceName}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch service statistics' 
      };
    }
  },

  // Get overview statistics
  getOverviewStatistics: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.get('/statistics/overview');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch overview statistics' 
      };
    }
  }
};

// Export the axios instance for custom requests
export default api;
