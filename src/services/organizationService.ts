import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';

// Organization related types
export interface Organization {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrganizationData {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface OrganizationFilters {
  search?: string;
  name?: string;
  email?: string;
}

// Organization service class
class OrganizationService {
  /**
   * Get all organizations with pagination and filters
   */
  async getOrganizations(
    page: number = 1,
    limit: number = 20,
    filters?: OrganizationFilters
  ): Promise<PaginatedResponse<Organization>> {
    try {
      const params = apiUtils.createPaginationParams(page, limit, filters?.search);
      
      // Add filter parameters
      if (filters) {
        if (filters.name) params.name = filters.name;
        if (filters.email) params.email = filters.email;
      }

      const response = await httpClient.get<Organization[]>('/organisations', apiUtils.formatParams(params));
      
      if (response.success) {
        return response as PaginatedResponse<Organization>;
      }
      
      throw new Error(response.message || 'Failed to fetch organizations');
    } catch (error) {
      console.error('Get organizations error:', error);
      throw error;
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganization(id: number): Promise<Organization> {
    try {
      const response = await httpClient.get<Organization>(`/organisations/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch organization');
    } catch (error) {
      console.error('Get organization error:', error);
      throw error;
    }
  }

  /**
   * Create new organization
   */
  async createOrganization(organizationData: CreateOrganizationData): Promise<Organization> {
    try {
      const response = await httpClient.post<Organization>('/organisations', organizationData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create organization');
    } catch (error) {
      console.error('Create organization error:', error);
      throw error;
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(id: number, organizationData: UpdateOrganizationData): Promise<Organization> {
    try {
      const response = await httpClient.put<Organization>(`/organisations/${id}`, organizationData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update organization');
    } catch (error) {
      console.error('Update organization error:', error);
      throw error;
    }
  }

  /**
   * Delete organization
   */
  async deleteOrganization(id: number): Promise<void> {
    try {
      const response = await httpClient.delete(`/organisations/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Delete organization error:', error);
      throw error;
    }
  }

  /**
   * Search organizations
   */
  async searchOrganizations(query: string, limit: number = 10): Promise<Organization[]> {
    try {
      const response = await httpClient.get<Organization[]>('/organisations/search', {
        q: query,
        limit: limit.toString(),
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search organizations');
    } catch (error) {
      console.error('Search organizations error:', error);
      throw error;
    }
  }

  /**
   * Get current user's organization
   */
  async getCurrentUserOrganization(): Promise<Organization | null> {
    try {
      // This would typically be called after login to get the user's organization details
      const response = await httpClient.get<Organization>('/user/organisation');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user organization error:', error);
      return null;
    }
  }
}

// Create and export service instance
export const organizationService = new OrganizationService();

// Export for convenience
export default organizationService;