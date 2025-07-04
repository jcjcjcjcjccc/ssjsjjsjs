// API Configuration and Service Layer
// This file provides a centralized way to manage API calls and configuration

// API Configuration
export const API_CONFIG = {
  // Base URL for your backend API - use Vite's import.meta.env instead of process.env
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  
  // API Version
  VERSION: '',
  
  // Timeout for requests (in milliseconds)
  TIMEOUT: 30000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Authentication token management
class TokenManager {
  private static readonly TOKEN_KEY = 'gdpilia-auth-token';
  private static readonly REFRESH_TOKEN_KEY = 'gdpilia-refresh-token';
  private static readonly FIRST_TIME_LOGIN_KEY = 'gdpilia-first-time-login';
  private static readonly USER_KEY = 'gdpilia-user';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static getFirstTimeLogin(): boolean {
    return localStorage.getItem(this.FIRST_TIME_LOGIN_KEY) === '1';
  }

  static setFirstTimeLogin(isFirstTime: boolean): void {
    localStorage.setItem(this.FIRST_TIME_LOGIN_KEY, isFirstTime ? '1' : '0');
  }

  static getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.FIRST_TIME_LOGIN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// HTTP Client class
class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    // Prepare headers
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token && !TokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    };

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle different response types
      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = {
          success: response.ok,
          message: response.ok ? 'Success' : 'Request failed',
        };
      }

      // Handle authentication errors
      if (response.status === 401) {
        await this.handleUnauthorized();
        throw new Error('Authentication required');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // For successful responses, wrap in our standard format if not already wrapped
      if (!data.hasOwnProperty('success')) {
        return {
          success: true,
          data: data,
        };
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Network error occurred');
    }
  }

  private async handleUnauthorized(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (refreshToken) {
      try {
        const response = await this.post<{ token: string; refreshToken: string }>('/token/refresh', {
          refresh_token: refreshToken,
        });
        
        if (response.success && response.data) {
          TokenManager.setToken(response.data.token);
          TokenManager.setRefreshToken(response.data.refreshToken);
          return;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
    
    // Clear tokens and redirect to login
    TokenManager.clearTokens();
    window.location.href = '/';
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const token = TokenManager.getToken();
    const headers: Record<string, string> = {};
    
    if (token && !TokenManager.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

// Create and export HTTP client instance
export const httpClient = new HttpClient();

// Export token manager for external use
export { TokenManager };

// Utility functions for common API patterns
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Format query parameters
  formatParams: (params: Record<string, any>): Record<string, string> => {
    const formatted: Record<string, string> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formatted[key] = String(value);
      }
    });
    
    return formatted;
  },

  // Create pagination parameters
  createPaginationParams: (page: number = 1, limit: number = 10, search?: string) => {
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    return params;
  },
};