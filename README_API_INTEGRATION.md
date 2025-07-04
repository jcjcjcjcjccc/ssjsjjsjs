# API Integration Guide for GDPilia CRM

This guide will help you integrate your backend APIs with the GDPilia frontend application.

## 🚀 Quick Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following key variables:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_API_VERSION=v1
```

### 2. API Service Structure

The application uses a modular service architecture:

```
src/services/
├── api.ts              # Core HTTP client and configuration
├── authService.ts      # Authentication endpoints
├── contactService.ts   # Contact management
├── opportunityService.ts # Sales opportunities
├── taskService.ts      # Task management
└── ...
```

### 3. Basic Usage Example

```typescript
import { contactService } from '../services/contactService';

// Get contacts with pagination
const contacts = await contactService.getContacts(1, 20, {
  status: 'hot',
  search: 'john'
});

// Create a new contact
const newContact = await contactService.createContact({
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp'
});
```

## 🔧 Configuration

### API Client Configuration

Update `src/services/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_BASE_URL || 'https://your-api.com/api',
  VERSION: 'v1',
  TIMEOUT: 30000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

### Authentication Token Management

The app automatically handles:
- JWT token storage
- Token refresh
- Automatic logout on token expiration
- Authorization headers

## 📡 API Endpoints

### Expected Backend Endpoints

#### Authentication
```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
PUT  /api/v1/auth/profile
```

#### Contacts
```
GET    /api/v1/contacts
POST   /api/v1/contacts
GET    /api/v1/contacts/:id
PUT    /api/v1/contacts/:id
DELETE /api/v1/contacts/:id
PATCH  /api/v1/contacts/:id/pin
GET    /api/v1/contacts/stats
```

#### Opportunities
```
GET    /api/v1/opportunities
POST   /api/v1/opportunities
GET    /api/v1/opportunities/:id
PUT    /api/v1/opportunities/:id
DELETE /api/v1/opportunities/:id
GET    /api/v1/opportunities/pipeline
```

#### Tasks
```
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PUT    /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/status
```

### Complete endpoint list available in `src/utils/constants.ts`

## 📋 Expected API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Your data here
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🔐 Authentication Flow

### Login Process
1. User submits credentials
2. Frontend calls `POST /auth/login`
3. Backend returns JWT token and refresh token
4. Frontend stores tokens securely
5. All subsequent requests include Authorization header

### Token Refresh
- Automatic refresh when token expires
- Fallback to login if refresh fails
- Seamless user experience

## 📊 Data Models

### Contact Model
```typescript
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  location?: string;
  status: 'hot' | 'warm' | 'cold';
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
```

### Opportunity Model
```typescript
interface Opportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  closeDate: string;
  contactId?: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
```

### Task Model
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assigneeId?: string;
  relatedTo?: string;
  type: 'call' | 'email' | 'meeting' | 'follow-up' | 'other';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
```

## 🛠 Custom Hooks

### useApi Hook
```typescript
import { useApi } from '../hooks/useApi';
import { contactService } from '../services/contactService';

function ContactList() {
  const { data, loading, error, execute } = useApi(
    () => contactService.getContacts(),
    { immediate: true }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.map(contact => (
        <div key={contact.id}>{contact.name}</div>
      ))}
    </div>
  );
}
```

### usePaginatedApi Hook
```typescript
import { usePaginatedApi } from '../hooks/useApi';

function PaginatedContacts() {
  const {
    data,
    loading,
    page,
    totalPages,
    nextPage,
    prevPage
  } = usePaginatedApi(
    (page, limit) => contactService.getContacts(page, limit),
    { immediate: true }
  );

  return (
    <div>
      {/* Render contacts */}
      <button onClick={prevPage} disabled={page === 1}>
        Previous
      </button>
      <button onClick={nextPage} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
```

## 🔄 Error Handling

### Global Error Handling
The API client automatically handles:
- Network errors
- Authentication errors
- Server errors
- Timeout errors

### Custom Error Handling
```typescript
try {
  const contact = await contactService.createContact(data);
  // Success handling
} catch (error) {
  // Error is already formatted by the service
  console.error('Failed to create contact:', error.message);
}
```

## 📁 File Upload

### Upload Example
```typescript
import { httpClient } from '../services/api';

async function uploadAvatar(file: File) {
  try {
    const response = await httpClient.upload('/auth/avatar', file);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

## 🔍 Search and Filtering

### Search Implementation
```typescript
// Search contacts
const results = await contactService.searchContacts('john doe', 10);

// Filter contacts
const filteredContacts = await contactService.getContacts(1, 20, {
  status: 'hot',
  company: 'Acme Corp',
  tags: ['vip', 'enterprise']
});
```

## 📈 Real-time Updates

### WebSocket Integration (Optional)
```typescript
// Add to your service files for real-time updates
const ws = new WebSocket('wss://your-api.com/ws');

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle real-time updates
};
```

## 🧪 Testing API Integration

### Test API Endpoints
```bash
# Test authentication
curl -X POST https://your-api.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test protected endpoint
curl -X GET https://your-api.com/api/v1/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment Considerations

### Environment Variables
```env
# Production
VITE_API_BASE_URL=https://api.yourdomain.com/api

# Staging
VITE_API_BASE_URL=https://staging-api.yourdomain.com/api

# Development
VITE_API_BASE_URL=http://localhost:3000/api
```

### CORS Configuration
Ensure your backend allows requests from your frontend domain:
```javascript
// Express.js example
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:5173'],
  credentials: true
}));
```

## 📞 Support

If you need help integrating your APIs:

1. Check the service files in `src/services/`
2. Review the constants in `src/utils/constants.ts`
3. Look at the hook examples in `src/hooks/useApi.ts`
4. Test with the provided API client

The frontend is designed to be API-agnostic and should work with any REST API that follows the expected response format.