// API Configuration Constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    AVATAR: '/auth/avatar',
  },
  
  // Contacts
  CONTACTS: {
    BASE: '/contacts',
    BY_ID: (id: string) => `/contacts/${id}`,
    PIN: (id: string) => `/contacts/${id}/pin`,
    STATUS: (id: string) => `/contacts/${id}/status`,
    TAGS: '/contacts/tags',
    ADD_TAGS: (id: string) => `/contacts/${id}/tags`,
    REMOVE_TAGS: (id: string) => `/contacts/${id}/tags/remove`,
    STATS: '/contacts/stats',
    SEARCH: '/contacts/search',
    RECENT: '/contacts/recent',
    IMPORT: '/contacts/import',
    EXPORT: '/contacts/export',
  },
  
  // Opportunities
  OPPORTUNITIES: {
    BASE: '/opportunities',
    BY_ID: (id: string) => `/opportunities/${id}`,
    STAGE: (id: string) => `/opportunities/${id}/stage`,
    PROBABILITY: (id: string) => `/opportunities/${id}/probability`,
    TAGS: '/opportunities/tags',
    ADD_TAGS: (id: string) => `/opportunities/${id}/tags`,
    REMOVE_TAGS: (id: string) => `/opportunities/${id}/tags/remove`,
    STATS: '/opportunities/stats',
    PIPELINE: '/opportunities/pipeline',
    SEARCH: '/opportunities/search',
    BY_CONTACT: (contactId: string) => `/opportunities/contact/${contactId}`,
    RECENT: '/opportunities/recent',
    CLOSING_SOON: '/opportunities/closing-soon',
    EXPORT: '/opportunities/export',
  },
  
  // Tasks
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    STATUS: (id: string) => `/tasks/${id}/status`,
    PRIORITY: (id: string) => `/tasks/${id}/priority`,
    ASSIGN: (id: string) => `/tasks/${id}/assign`,
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    REOPEN: (id: string) => `/tasks/${id}/reopen`,
    TAGS: '/tasks/tags',
    ADD_TAGS: (id: string) => `/tasks/${id}/tags`,
    REMOVE_TAGS: (id: string) => `/tasks/${id}/tags/remove`,
    STATS: '/tasks/stats',
    SEARCH: '/tasks/search',
    BY_ASSIGNEE: (assigneeId: string) => `/tasks/assignee/${assigneeId}`,
    OVERDUE: '/tasks/overdue',
    DUE_TODAY: '/tasks/due-today',
    RECENT: '/tasks/recent',
    EXPORT: '/tasks/export',
  },
  
  // Calendar/Appointments
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: string) => `/appointments/${id}`,
    STATUS: (id: string) => `/appointments/${id}/status`,
    STATS: '/appointments/stats',
    SEARCH: '/appointments/search',
    UPCOMING: '/appointments/upcoming',
    TODAY: '/appointments/today',
    WEEK: '/appointments/week',
    MONTH: '/appointments/month',
    EXPORT: '/appointments/export',
  },
  
  // Email Campaigns
  EMAIL: {
    CAMPAIGNS: '/email/campaigns',
    CAMPAIGN_BY_ID: (id: string) => `/email/campaigns/${id}`,
    SEND: (id: string) => `/email/campaigns/${id}/send`,
    STATS: (id: string) => `/email/campaigns/${id}/stats`,
    TEMPLATES: '/email/templates',
    TEMPLATE_BY_ID: (id: string) => `/email/templates/${id}`,
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    CONTACTS: '/analytics/contacts',
    OPPORTUNITIES: '/analytics/opportunities',
    TASKS: '/analytics/tasks',
    REVENUE: '/analytics/revenue',
    PERFORMANCE: '/analytics/performance',
    EXPORT: '/analytics/export',
  },
  
  // Organizations
  ORGANIZATIONS: {
    BASE: '/organizations',
    BY_ID: (id: string) => `/organizations/${id}`,
    MEMBERS: (id: string) => `/organizations/${id}/members`,
    INVITE: (id: string) => `/organizations/${id}/invite`,
    JOIN_REQUESTS: (id: string) => `/organizations/${id}/join-requests`,
    PUBLIC: '/organizations/public',
    SEARCH: '/organizations/search',
  },
  
  // Integrations
  INTEGRATIONS: {
    BASE: '/integrations',
    BY_ID: (id: string) => `/integrations/${id}`,
    CONNECT: (id: string) => `/integrations/${id}/connect`,
    DISCONNECT: (id: string) => `/integrations/${id}/disconnect`,
    SYNC: (id: string) => `/integrations/${id}/sync`,
    STATUS: '/integrations/status',
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    UNREAD_COUNT: '/notifications/unread-count',
    SETTINGS: '/notifications/settings',
  },
  
  // File Upload
  FILES: {
    UPLOAD: '/files/upload',
    BY_ID: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`,
  },
} as const;

// Application Constants
export const APP_CONFIG = {
  NAME: 'GDPilia',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-Powered CRM Platform',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  
  // Date Formats
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',
  DISPLAY_DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  
  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'gdpilia-auth-token',
    REFRESH_TOKEN: 'gdpilia-refresh-token',
    USER_PREFERENCES: 'gdpilia-user-preferences',
    LANGUAGE: 'gdpilia-language',
    THEME: 'gdpilia-theme',
    ORGANIZATIONS: 'gdpilia-organizations',
    CURRENT_ORGANIZATION: 'gdpilia-current-organization',
  },
  
  // API Configuration
  API: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Validation Rules
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 1000,
    TITLE_MAX_LENGTH: 100,
  },
  
  // UI Constants
  UI: {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 80,
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    DESKTOP_BREAKPOINT: 1280,
  },
  
  // Status Options
  CONTACT_STATUSES: ['hot', 'warm', 'cold'] as const,
  OPPORTUNITY_STAGES: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'] as const,
  TASK_STATUSES: ['pending', 'in-progress', 'completed'] as const,
  TASK_PRIORITIES: ['low', 'medium', 'high', 'urgent'] as const,
  TASK_TYPES: ['call', 'email', 'meeting', 'follow-up', 'other'] as const,
  
  // Organization Roles
  ORGANIZATION_ROLES: ['owner', 'admin', 'member'] as const,
  ORGANIZATION_PLANS: ['starter', 'professional', 'enterprise'] as const,
  
  // Notification Types
  NOTIFICATION_TYPES: ['info', 'success', 'warning', 'error', 'reminder'] as const,
  NOTIFICATION_CATEGORIES: ['task', 'appointment', 'opportunity', 'contact', 'system', 'reminder'] as const,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
  PASSWORD_EXPIRED: 'Your password has expired. Please reset your password.',
  
  // Validation
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${APP_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} characters long.`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
  
  // File Upload
  FILE_TOO_LARGE: `File size must be less than ${APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file format.',
  
  // API
  API_ERROR: 'An error occurred while communicating with the server.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  SAVED: 'Successfully saved.',
  
  // Authentication
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  REGISTRATION_SUCCESS: 'Account created successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  EMAIL_VERIFIED: 'Email verified successfully.',
  
  // Data Operations
  CONTACT_CREATED: 'Contact created successfully.',
  CONTACT_UPDATED: 'Contact updated successfully.',
  CONTACT_DELETED: 'Contact deleted successfully.',
  
  OPPORTUNITY_CREATED: 'Opportunity created successfully.',
  OPPORTUNITY_UPDATED: 'Opportunity updated successfully.',
  OPPORTUNITY_DELETED: 'Opportunity deleted successfully.',
  
  TASK_CREATED: 'Task created successfully.',
  TASK_UPDATED: 'Task updated successfully.',
  TASK_DELETED: 'Task deleted successfully.',
  TASK_COMPLETED: 'Task completed successfully.',
  
  // File Operations
  FILE_UPLOADED: 'File uploaded successfully.',
  FILE_DELETED: 'File deleted successfully.',
  
  // Import/Export
  DATA_IMPORTED: 'Data imported successfully.',
  DATA_EXPORTED: 'Data exported successfully.',
} as const;

// Export types for TypeScript
export type ContactStatus = typeof APP_CONFIG.CONTACT_STATUSES[number];
export type OpportunityStage = typeof APP_CONFIG.OPPORTUNITY_STAGES[number];
export type TaskStatus = typeof APP_CONFIG.TASK_STATUSES[number];
export type TaskPriority = typeof APP_CONFIG.TASK_PRIORITIES[number];
export type TaskType = typeof APP_CONFIG.TASK_TYPES[number];
export type OrganizationRole = typeof APP_CONFIG.ORGANIZATION_ROLES[number];
export type OrganizationPlan = typeof APP_CONFIG.ORGANIZATION_PLANS[number];
export type NotificationType = typeof APP_CONFIG.NOTIFICATION_TYPES[number];
export type NotificationCategory = typeof APP_CONFIG.NOTIFICATION_CATEGORIES[number];