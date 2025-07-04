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
      console.log('Attempting login with credentials:', { email: credentials.email });
      
      const response = await httpClient.post<LoginResponse>('/login', credentials);
      
      console.log('Login response received:', {
        success: response.success,
        hasData: !!response.data,
        hasToken: !!(response.data?.token),
        hasRefreshToken: !!(response.data?.refreshToken),
        hasUser: !!(response.data?.user)
      });
      
      if (response.success && response.data) {
        const { token, refreshToken, user, first_time_login } = response.data;
        
        // Validate that we have the required data
        if (!token) {
          throw new Error('No authentication token received from server');
        }
        
        if (!user) {
          throw new Error('No user data received from server');
        }
        
        // Store tokens and user data
        console.log('Storing authentication data...');
        TokenManager.setToken(token);
        
        if (refreshToken) {
          TokenManager.setRefreshToken(refreshToken);
        }
        
        TokenManager.setFirstTimeLogin(first_time_login === 1);
        TokenManager.setUser(user);
        
        // Verify tokens were stored correctly
        const storedToken = TokenManager.getToken();
        const storedUser = TokenManager.getUser();
        
        console.log('Authentication data stored successfully:', {
          tokenStored: !!storedToken,
          userStored: !!storedUser,
          firstTimeLogin: first_time_login === 1
        });
        
        // Additional verification
        if (!storedToken) {
          throw new Error('Failed to store authentication token');
        }
        
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial data that might have been stored
      TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      console.log('Attempting registration with data:', { 
        email: userData.email, 
        firstName: userData.firstName,
        lastName: userData.lastName,
        company: userData.company 
      });
      
      const response = await httpClient.post<LoginResponse>('/register', userData);
      
      console.log('Registration response received:', {
        success: response.success,
        hasData: !!response.data,
        hasToken: !!(response.data?.token),
        hasUser: !!(response.data?.user)
      });
      
      if (response.success && response.data) {
        const { token, refreshToken, user, first_time_login } = response.data;
        
        // Validate that we have the required data
        if (!token) {
          throw new Error('No authentication token received from server');
        }
        
        if (!user) {
          throw new Error('No user data received from server');
        }
        
        // Store tokens and user data
        console.log('Storing registration authentication data...');
        TokenManager.setToken(token);
        
        if (refreshToken) {
          TokenManager.setRefreshToken(refreshToken);
        }
        
        TokenManager.setFirstTimeLogin(first_time_login === 1);
        TokenManager.setUser(user);
        
        // Verify tokens were stored correctly
        const storedToken = TokenManager.getToken();
        const storedUser = TokenManager.getUser();
        
        console.log('Registration authentication data stored successfully:', {
          tokenStored: !!storedToken,
          userStored: !!storedUser,
          firstTimeLogin: first_time_login === 1
        });
        
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      // Clear any partial data that might have been stored
      TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('Attempting logout...');
      // Call logout endpoint to invalidate token on server
      await httpClient.post('/logout');
      console.log('Server logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server call fails
    } finally {
      // Clear local tokens
      console.log('Clearing local authentication data...');
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
        console.log('Retrieved user from local storage');
        return localUser;
      }

      // If not in local storage, fetch from server
      console.log('Fetching user profile from server...');
      const response = await httpClient.get<User>('/user');
      
      if (response.success && response.data) {
        console.log('User profile fetched successfully');
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
        console.log('No user or organization ID found');
        return null;
      }

      console.log('Fetching organization data for ID:', user.organisation_id);
      const response = await httpClient.get<Organization>(`/organisations/${user.organisation_id}`);
      
      if (response.success && response.data) {
        console.log('Organization data fetched successfully');
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
      console.log('Updating user profile...');
      const response = await httpClient.put<User>('/user/profile', userData);
      
      if (response.success && response.data) {
        console.log('Profile updated successfully');
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
      console.log('Changing password...');
      const response = await httpClient.post('/user/change-password', passwordData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
      
      console.log('Password changed successfully');
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
      console.log('Requesting password reset for:', data.email);
      const response = await httpClient.post('/password/forgot', data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to request password reset');
      }
      
      console.log('Password reset request sent successfully');
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
      console.log('Resetting password with token...');
      const response = await httpClient.post('/password/reset', data);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }
      
      console.log('Password reset successfully');
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
      console.log('Verifying email with token...');
      const response = await httpClient.post('/email/verify', { token });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to verify email');
      }
      
      console.log('Email verified successfully');
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
      console.log('Resending email verification...');
      const response = await httpClient.post('/email/resend');
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to resend verification email');
      }
      
      console.log('Verification email sent successfully');
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

      console.log('Refreshing authentication token...');
      const response = await httpClient.post<LoginResponse>('/token/refresh', {
        refresh_token: refreshToken,
      });
      
      if (response.success && response.data) {
        console.log('Token refresh successful');
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
    const isAuth = token !== null && !TokenManager.isTokenExpired(token);
    console.log('Authentication check:', {
      hasToken: !!token,
      isAuthenticated: isAuth
    });
    return isAuth;
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
      console.log('Uploading user avatar...');
      const response = await httpClient.upload<User>('/user/avatar', file);
      
      if (response.success && response.data) {
        console.log('Avatar uploaded successfully');
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