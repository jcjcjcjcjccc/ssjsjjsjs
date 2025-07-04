import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';
import { authService } from './authService';

// Contact related types based on your API
export interface Contact {
  id: number;
  organisation_id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  status: string; // 'Active' or other statuses from your API
  created_at: string;
  updated_at: string;
}

export interface CreateContactData {
  organisation_id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  status?: string;
}

export interface UpdateContactData extends Partial<CreateContactData> {}

export interface ContactFilters {
  status?: string;
  company?: string;
  search?: string;
  name?: string;
  email?: string;
}

export interface ContactStats {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
  byCompany: Record<string, number>;
  byStatus: Record<string, number>;
}

// Contact service class
class ContactService {
  /**
   * Get contacts by organization ID
   */
  async getContactsByOrganization(
    organizationId: number,
    page: number = 1,
    limit: number = 20,
    filters?: ContactFilters
  ): Promise<PaginatedResponse<Contact>> {
    try {
      const params = apiUtils.createPaginationParams(page, limit, filters?.search);
      
      // Add filter parameters
      if (filters) {
        if (filters.status) params.status = filters.status;
        if (filters.company) params.company = filters.company;
        if (filters.name) params.name = filters.name;
        if (filters.email) params.email = filters.email;
      }

      const response = await httpClient.get<Contact[]>(
        `/organisations/${organizationId}/contacts`, 
        apiUtils.formatParams(params)
      );
      
      if (response.success) {
        return response as PaginatedResponse<Contact>;
      }
      
      throw new Error(response.message || 'Failed to fetch contacts');
    } catch (error) {
      console.error('Get contacts by organization error:', error);
      throw error;
    }
  }

  /**
   * Get contacts for current user's organization
   */
  async getContacts(
    page: number = 1,
    limit: number = 20,
    filters?: ContactFilters
  ): Promise<Contact[]> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser || !currentUser.organisation_id) {
        throw new Error('User not authenticated or no organization');
      }

      const response = await this.getContactsByOrganization(
        currentUser.organisation_id,
        page,
        limit,
        filters
      );
      
      return response.data || [];
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  }

  /**
   * Get contact by ID
   */
  async getContact(id: number): Promise<Contact> {
    try {
      const response = await httpClient.get<Contact>(`/contacts/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch contact');
    } catch (error) {
      console.error('Get contact error:', error);
      throw error;
    }
  }

  /**
   * Create new contact
   */
  async createContact(contactData: Omit<CreateContactData, 'organisation_id'>): Promise<Contact> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser || !currentUser.organisation_id) {
        throw new Error('User not authenticated or no organization');
      }

      const payload: CreateContactData = {
        ...contactData,
        organisation_id: currentUser.organisation_id,
        status: contactData.status || 'Active',
      };

      const response = await httpClient.post<Contact>('/contacts', payload);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create contact');
    } catch (error) {
      console.error('Create contact error:', error);
      throw error;
    }
  }

  /**
   * Update contact
   */
  async updateContact(id: number, contactData: UpdateContactData): Promise<Contact> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser || !currentUser.organisation_id) {
        throw new Error('User not authenticated or no organization');
      }

      // Ensure the contact belongs to the user's organization
      const payload: UpdateContactData = {
        ...contactData,
        organisation_id: currentUser.organisation_id,
      };

      const response = await httpClient.put<Contact>(`/contacts/${id}`, payload);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update contact');
    } catch (error) {
      console.error('Update contact error:', error);
      throw error;
    }
  }

  /**
   * Delete contact
   */
  async deleteContact(id: number): Promise<void> {
    try {
      const response = await httpClient.delete(`/contacts/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }

  /**
   * Search contacts within user's organization
   */
  async searchContacts(query: string, limit: number = 10): Promise<Contact[]> {
    try {
      const contacts = await this.getContacts(1, limit, { search: query });
      return contacts;
    } catch (error) {
      console.error('Search contacts error:', error);
      throw error;
    }
  }

  /**
   * Get contact statistics for user's organization
   */
  async getContactStats(): Promise<ContactStats> {
    try {
      const contacts = await this.getContacts(1, 1000); // Get all contacts for stats
      
      const stats: ContactStats = {
        total: contacts.length,
        active: contacts.filter(c => c.status === 'Active').length,
        inactive: contacts.filter(c => c.status !== 'Active').length,
        recentlyAdded: contacts.filter(c => {
          const createdDate = new Date(c.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate >= weekAgo;
        }).length,
        byCompany: contacts.reduce((acc, contact) => {
          const company = contact.company || 'Unknown';
          acc[company] = (acc[company] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: contacts.reduce((acc, contact) => {
          acc[contact.status] = (acc[contact.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
      
      return stats;
    } catch (error) {
      console.error('Get contact stats error:', error);
      throw error;
    }
  }

  /**
   * Get recent contacts
   */
  async getRecentContacts(limit: number = 5): Promise<Contact[]> {
    try {
      const contacts = await this.getContacts(1, limit);
      return contacts
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Get recent contacts error:', error);
      throw error;
    }
  }

  /**
   * Filter contacts locally
   */
  filterContacts(contacts: Contact[], filters: ContactFilters): Contact[] {
    return contacts.filter(contact => {
      if (filters.status && contact.status !== filters.status) return false;
      if (filters.company && contact.company !== filters.company) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!contact.name.toLowerCase().includes(searchLower) &&
            !contact.email.toLowerCase().includes(searchLower) &&
            !(contact.company || '').toLowerCase().includes(searchLower) &&
            !(contact.position || '').toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.name && !contact.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.email && !contact.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
      
      return true;
    });
  }
}

// Create and export service instance
export const contactService = new ContactService();

// Export for convenience
export default contactService;