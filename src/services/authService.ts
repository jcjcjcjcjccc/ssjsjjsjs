import { httpClient, TokenManager, ApiResponse } from './api';

// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  first_time_login: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  organisation_id: number;
  first_time_login: number;
  refresh_token: string;
}

export interface Organization {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Authentication service class
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>('/login', credentials);
      
      if (response.success && response.data) {
        // Store tokens and user data
        TokenManager.setToken(response.data.token);
        TokenManager.setRefreshToken(response.data.refreshToken);
        TokenManager.setFirstTimeLogin(response.data.first_time_login === 1);
        TokenManager.setUser(response.data.user);
        
        console.log('Login successful:', {
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          firstTimeLogin: response.data.first_time_login,
          user: response.data.user
        });
        
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>('/register', userData);
      
      if (response.success && response.data) {
        // Store tokens and user data
        TokenManager.setToken(response.data.token);
        TokenManager.setRefreshToken(response.data.refreshToken);
        TokenManager.setFirstTimeLogin(response.data.first_time_login === 1);
        TokenManager.setUser(response.data.user);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await httpClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server call fails
    } finally {
      // Clear local tokens
      TokenManager.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      // First try to get from local storage
      const localUser = TokenManager.getUser();
      if (localUser) {
        return localUser;
      }

      // If not in local storage, fetch from server
      const response = await httpClient.get<User>('/user');
      
      if (response.success && response.data) {
        TokenManager.setUser(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get user profile');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Get user's organization information
   */
  async getUserOrganization(): Promise<Organization | null> {
    try {
      const user = this.getStoredUser();
      if (!user || !user.organisation_id) {
        return null;
      }

      const response = await httpClient.get<Organization>(`/organisations/${user.organisation_id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get user organization error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await httpClient.put<User>('/user/profile', userData);
      
      if (response.success && response.data) {
        TokenManager.setUser(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update profile');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      const response = await httpClient.post('/user/change-password', passwordData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    try {
      const response = await httpClient.post('/password/forgot', data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to request password reset');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: PasswordReset): Promise<void> {
    try {
      const response = await httpClient.post('/password/reset', data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await httpClient.post('/email/verify', { token });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to verify email');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<void> {
    try {
      const response = await httpClient.post('/email/resend');
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await httpClient.post<LoginResponse>('/token/refresh', {
        refresh_token: refreshToken,
      });
      
      if (response.success && response.data) {
        // Update stored tokens
        TokenManager.setToken(response.data.token);
        TokenManager.setRefreshToken(response.data.refreshToken);
        TokenManager.setUser(response.data.user);
        
        return response.data;
      }
      
      throw new Error(response.message || 'Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = TokenManager.getToken();
    return token !== null && !TokenManager.isTokenExpired(token);
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return TokenManager.getToken();
  }

  /**
   * Check if this is user's first time login
   */
  isFirstTimeLogin(): boolean {
    return TokenManager.getFirstTimeLogin();
  }

  /**
   * Get current user from local storage
   */
  getStoredUser(): User | null {
    return TokenManager.getUser();
  }

  /**
   * Get user display name (fallback to email if name not available)
   */
  getUserDisplayName(): string {
    const user = this.getStoredUser();
    if (!user) return 'User';
    return user.name || user.email || 'User';
  }

  /**
   * Get user initials for avatar
   */
  getUserInitials(): string {
    const user = this.getStoredUser();
    if (!user) return 'U';
    
    if (user.name) {
      return user.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    
    return user.email.charAt(0).toUpperCase();
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<User> {
    try {
      const response = await httpClient.upload<User>('/user/avatar', file);
      
      if (response.success && response.data) {
        TokenManager.setUser(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to upload avatar');
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }
}

// Create and export service instance
export const authService = new AuthService();

// Export for convenience
export default authService;