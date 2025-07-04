import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { organizationService, Organization as ApiOrganization } from '../services/organizationService';

export interface Organization {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  role?: 'owner' | 'admin' | 'member';
  avatar?: string;
  memberCount?: number;
  plan?: 'starter' | 'professional' | 'enterprise';
  created_at?: string;
  updated_at?: string;
}

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  setCurrentOrganization: (org: Organization) => void;
  addOrganization: (org: Organization) => void;
  updateOrganization: (org: Organization) => void;
  removeOrganization: (id: number) => void;
  loadUserOrganization: () => Promise<void>;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate avatar from organization name
  const generateAvatar = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Convert API organization to context organization
  const convertApiOrganization = (apiOrg: ApiOrganization): Organization => {
    return {
      ...apiOrg,
      avatar: generateAvatar(apiOrg.name),
      role: 'member', // Default role, could be determined from user data
      memberCount: 1, // Default, would need to be fetched from API
      plan: 'professional', // Default, would need to be fetched from API
    };
  };

  // Load user's organization based on their organisation_id
  const loadUserOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = authService.getStoredUser();
      if (!user || !user.organisation_id) {
        setCurrentOrganizationState(null);
        setOrganizations([]);
        return;
      }

      // Fetch the user's organization
      const apiOrganization = await organizationService.getOrganization(user.organisation_id);
      const organization = convertApiOrganization(apiOrganization);
      
      setCurrentOrganizationState(organization);
      setOrganizations([organization]);
      
      // Store in localStorage
      localStorage.setItem('gdpilia-current-organization', JSON.stringify(organization));
      localStorage.setItem('gdpilia-organizations', JSON.stringify([organization]));
      
    } catch (err) {
      console.error('Failed to load user organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to load organization');
      setCurrentOrganizationState(null);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh organizations list
  const refreshOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await organizationService.getOrganizations();
      if (response.success && response.data) {
        const convertedOrgs = response.data.map(convertApiOrganization);
        setOrganizations(convertedOrgs);
        localStorage.setItem('gdpilia-organizations', JSON.stringify(convertedOrgs));
      }
    } catch (err) {
      console.error('Failed to refresh organizations:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh organizations');
    } finally {
      setLoading(false);
    }
  };

  const setCurrentOrganization = (org: Organization) => {
    setCurrentOrganizationState(org);
    localStorage.setItem('gdpilia-current-organization', JSON.stringify(org));
  };

  const addOrganization = (org: Organization) => {
    const newOrganizations = [...organizations, org];
    setOrganizations(newOrganizations);
    localStorage.setItem('gdpilia-organizations', JSON.stringify(newOrganizations));
  };

  const updateOrganization = (updatedOrg: Organization) => {
    const newOrganizations = organizations.map(org => 
      org.id === updatedOrg.id ? updatedOrg : org
    );
    setOrganizations(newOrganizations);
    localStorage.setItem('gdpilia-organizations', JSON.stringify(newOrganizations));
    
    // Update current organization if it's the one being updated
    if (currentOrganization?.id === updatedOrg.id) {
      setCurrentOrganization(updatedOrg);
    }
  };

  const removeOrganization = (id: number) => {
    const newOrganizations = organizations.filter(org => org.id !== id);
    setOrganizations(newOrganizations);
    localStorage.setItem('gdpilia-organizations', JSON.stringify(newOrganizations));
    
    // Clear current organization if it's the one being removed
    if (currentOrganization?.id === id) {
      setCurrentOrganizationState(null);
      localStorage.removeItem('gdpilia-current-organization');
    }
  };

  // Load organization on mount and when user changes
  useEffect(() => {
    const user = authService.getStoredUser();
    if (user && user.organisation_id) {
      loadUserOrganization();
    } else {
      // Try to load from localStorage if no user
      const saved = localStorage.getItem('gdpilia-current-organization');
      if (saved) {
        try {
          const savedOrg = JSON.parse(saved);
          setCurrentOrganizationState(savedOrg);
        } catch (error) {
          console.error('Failed to parse saved organization:', error);
        }
      }
    }
  }, []);

  return (
    <OrganizationContext.Provider value={{
      currentOrganization,
      organizations,
      loading,
      error,
      setCurrentOrganization,
      addOrganization,
      updateOrganization,
      removeOrganization,
      loadUserOrganization,
      refreshOrganizations,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};