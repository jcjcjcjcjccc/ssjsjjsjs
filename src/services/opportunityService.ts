import { httpClient, ApiResponse, PaginatedResponse, apiUtils } from './api';
import { authService } from './authService';

// Opportunity related types based on your API
export interface Opportunity {
  id: number;
  organisation_id: number;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  close_date: string;
  contact: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOpportunityData {
  organisation_id: number;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  close_date: string;
  contact: string;
  description: string;
}

export interface UpdateOpportunityData extends Partial<CreateOpportunityData> {}

export interface OpportunityFilters {
  stage?: string;
  company?: string;
  contact?: string;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  maxProbability?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OpportunityStats {
  total: number;
  totalValue: number;
  averageValue: number;
  averageProbability: number;
  byStage: Record<string, { count: number; value: number }>;
  conversionRate: number;
  wonDeals: number;
  lostDeals: number;
}

// Opportunity service class
class OpportunityService {
  /**
   * Get opportunities by organization ID
   */
  async getOpportunitiesByOrganization(
    organizationId: number,
    page: number = 1,
    limit: number = 20,
    filters?: OpportunityFilters
  ): Promise<Opportunity[]> {
    try {
      const params = apiUtils.createPaginationParams(page, limit, filters?.search);
      
      // Add filter parameters
      if (filters) {
        if (filters.stage) params.stage = filters.stage;
        if (filters.company) params.company = filters.company;
        if (filters.contact) params.contact = filters.contact;
        if (filters.minValue) params.minValue = filters.minValue;
        if (filters.maxValue) params.maxValue = filters.maxValue;
        if (filters.minProbability) params.minProbability = filters.minProbability;
        if (filters.maxProbability) params.maxProbability = filters.maxProbability;
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
      }

      const response = await httpClient.get<Opportunity[]>(
        `/organisations/${organizationId}/opportunities`, 
        apiUtils.formatParams(params)
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunities');
    } catch (error) {
      console.error('Get opportunities by organization error:', error);
      throw error;
    }
  }

  /**
   * Get opportunities for current user's organization
   */
  async getOpportunities(
    page: number = 1,
    limit: number = 20,
    filters?: OpportunityFilters
  ): Promise<Opportunity[]> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser || !currentUser.organisation_id) {
        throw new Error('User not authenticated or no organization');
      }

      return await this.getOpportunitiesByOrganization(
        currentUser.organisation_id,
        page,
        limit,
        filters
      );
    } catch (error) {
      console.error('Get opportunities error:', error);
      throw error;
    }
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunity(id: number): Promise<Opportunity> {
    try {
      const response = await httpClient.get<Opportunity>(`/opportunities/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch opportunity');
    } catch (error) {
      console.error('Get opportunity error:', error);
      throw error;
    }
  }

  /**
   * Create new opportunity
   */
  async createOpportunity(opportunityData: Omit<CreateOpportunityData, 'organisation_id'>): Promise<Opportunity> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser || !currentUser.organisation_id) {
        throw new Error('User not authenticated or no organization');
      }

      const payload: CreateOpportunityData = {
        ...opportunityData,
        organisation_id: currentUser.organisation_id,
      };

      const response = await httpClient.post<Opportunity>('/opportunities', payload);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to create opportunity');
    } catch (error) {
      console.error('Create opportunity error:', error);
      throw error;
    }
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(id: number, opportunityData: UpdateOpportunityData): Promise<Opportunity> {
    try {
      const currentUser = authService.getStoredUser();
      if (!currentUser || !currentUser.organisation_id) {
        throw new Error('User not authenticated or no organization');
      }

      // Ensure the opportunity belongs to the user's organization
      const payload: UpdateOpportunityData = {
        ...opportunityData,
        organisation_id: currentUser.organisation_id,
      };

      const response = await httpClient.put<Opportunity>(`/opportunities/${id}`, payload);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update opportunity');
    } catch (error) {
      console.error('Update opportunity error:', error);
      throw error;
    }
  }

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id: number): Promise<void> {
    try {
      const response = await httpClient.delete(`/opportunities/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete opportunity');
      }
    } catch (error) {
      console.error('Delete opportunity error:', error);
      throw error;
    }
  }

  /**
   * Search opportunities within user's organization
   */
  async searchOpportunities(query: string, limit: number = 10): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getOpportunities(1, limit, { search: query });
      return opportunities;
    } catch (error) {
      console.error('Search opportunities error:', error);
      throw error;
    }
  }

  /**
   * Get opportunity statistics for user's organization
   */
  async getOpportunityStats(): Promise<OpportunityStats> {
    try {
      const opportunities = await this.getOpportunities(1, 1000); // Get all opportunities for stats
      
      const stats: OpportunityStats = {
        total: opportunities.length,
        totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
        averageValue: opportunities.length > 0 ? opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length : 0,
        averageProbability: opportunities.length > 0 ? opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length : 0,
        byStage: opportunities.reduce((acc, opportunity) => {
          if (!acc[opportunity.stage]) {
            acc[opportunity.stage] = { count: 0, value: 0 };
          }
          acc[opportunity.stage].count += 1;
          acc[opportunity.stage].value += opportunity.value;
          return acc;
        }, {} as Record<string, { count: number; value: number }>),
        wonDeals: opportunities.filter(o => o.stage.toLowerCase().includes('won') || o.stage.toLowerCase().includes('closed-won')).length,
        lostDeals: opportunities.filter(o => o.stage.toLowerCase().includes('lost') || o.stage.toLowerCase().includes('closed-lost')).length,
        conversionRate: 0, // Will be calculated based on won/total
      };
      
      // Calculate conversion rate
      if (stats.total > 0) {
        stats.conversionRate = (stats.wonDeals / stats.total) * 100;
      }
      
      return stats;
    } catch (error) {
      console.error('Get opportunity stats error:', error);
      throw error;
    }
  }

  /**
   * Get recent opportunities
   */
  async getRecentOpportunities(limit: number = 5): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getOpportunities(1, limit);
      return opportunities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Get recent opportunities error:', error);
      throw error;
    }
  }

  /**
   * Filter opportunities locally
   */
  filterOpportunities(opportunities: Opportunity[], filters: OpportunityFilters): Opportunity[] {
    return opportunities.filter(opportunity => {
      if (filters.stage && opportunity.stage !== filters.stage) return false;
      if (filters.company && !opportunity.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
      if (filters.contact && !opportunity.contact.toLowerCase().includes(filters.contact.toLowerCase())) return false;
      if (filters.minValue && opportunity.value < filters.minValue) return false;
      if (filters.maxValue && opportunity.value > filters.maxValue) return false;
      if (filters.minProbability && opportunity.probability < filters.minProbability) return false;
      if (filters.maxProbability && opportunity.probability > filters.maxProbability) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!opportunity.title.toLowerCase().includes(searchLower) &&
            !opportunity.company.toLowerCase().includes(searchLower) &&
            !opportunity.contact.toLowerCase().includes(searchLower) &&
            !opportunity.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.dateFrom && new Date(opportunity.close_date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(opportunity.close_date) > new Date(filters.dateTo)) return false;
      
      return true;
    });
  }
}

// Create and export service instance
export const opportunityService = new OpportunityService();

// Export for convenience
export default opportunityService;