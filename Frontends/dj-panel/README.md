# DJ Panel - React Frontend Application

The DJ Panel is the primary web interface for the DJ Beat Blaster platform, built with React 19 and TypeScript.

## 📋 Overview

DJ Panel provides a comprehensive user interface for:

- User authentication and profile management
- Music library browsing and management
- Event booking and management
- Client relationship management
- Equipment inventory tracking
- Document generation and management
- Email campaign management
- Analytics and reporting dashboards

## 🏗️ Technology Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript 5.9
- **Build Tool**: Webpack 5
- **HTTP Client**: Axios 1.12
- **Routing**: React Router DOM 7
- **Icons**: React Icons 5.5
- **State Management**: React Context API
- **Authentication**: JWT with jwt-decode
- **Styling**: CSS Modules

## 📁 Project Structure

```
dj-panel/
├── public/                  # Static assets
│   ├── index.html          # HTML template
│   └── favicon.ico         # Favicon
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── layout/        # Layout components
│   │   └── features/      # Feature-specific components
│   ├── pages/             # Page components
│   │   ├── Auth/          # Authentication pages
│   │   ├── Dashboard/     # Dashboard pages
│   │   ├── Music/         # Music management pages
│   │   ├── Events/        # Event management pages
│   │   ├── Clients/       # Client management pages
│   │   ├── Equipment/     # Equipment pages
│   │   └── Settings/      # Settings pages
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   │   ├── api.ts        # Base API configuration
│   │   ├── auth.service.ts
│   │   ├── music.service.ts
│   │   └── events.service.ts
│   ├── models/            # TypeScript interfaces
│   │   ├── api/          # Auto-generated API models
│   │   └── strapi/       # Strapi CMS models
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.tsx            # Root component
│   └── index.tsx          # Entry point
├── scripts/               # Build and utility scripts
│   ├── map-api.js        # Generate API types
│   └── map-strapi.js     # Generate Strapi types
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Backend services running (or accessible)

### Installation

1. **Install dependencies**:
   ```bash
   cd Frontends/dj-panel
   npm install
   ```

2. **Environment configuration**:
   Create `.env` file:
   ```env
   REACT_APP_API_GATEWAY=http://localhost:5000
   REACT_APP_API_SECURE_KEY=YourSecureAPIKeyHere
   REACT_APP_STRAPI_URL=http://localhost:1337
   ```

3. **Generate API types** (optional):
   ```bash
   npm run map:api
   npm run map:strapi
   ```

### Development

```bash
# Start development server (port 3080)
npm run dev

# Start with live reload (port 3000)
npm run start:live

# Build for development
npm run build:dev
```

### Production

```bash
# Build for production
npm run build

# Serve production build
npm run build:start
```

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Fix formatting
npm run format:fix
```

## 🔌 API Integration

### API Service Configuration

Base API configuration in `src/services/api.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_GATEWAY,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.REACT_APP_API_SECURE_KEY,
  },
});

// Request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Examples

#### Authentication Service

```typescript
import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/identity/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post('/identity/api/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    await api.post('/identity/api/auth/logout');
    localStorage.removeItem('token');
  },
};
```

#### Events Service

```typescript
import api from './api';

export const eventsService = {
  getEvents: async (params?: EventQueryParams) => {
    const response = await api.get('/party/api/events', { params });
    return response.data;
  },

  getEvent: async (id: string) => {
    const response = await api.get(`/party/api/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: CreateEventData) => {
    const response = await api.post('/party/api/events', eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: UpdateEventData) => {
    const response = await api.put(`/party/api/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    await api.delete(`/party/api/events/${id}`);
  },
};
```

## 🔐 Authentication Flow

### Auth Context

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUser(decoded.user);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Protected Routes

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## 🎨 Component Examples

### Event List Component

```typescript
import React, { useEffect, useState } from 'react';
import { eventsService } from '../../services/events.service';
import { Event } from '../../models/Event';
import styles from './EventList.module.css';

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsService.getEvents();
      setEvents(data.items);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.eventList}>
      <h2>Upcoming Events</h2>
      {events.map((event) => (
        <div key={event.id} className={styles.eventCard}>
          <h3>{event.name}</h3>
          <p>{event.eventType}</p>
          <p>{new Date(event.eventDate).toLocaleDateString()}</p>
          <span className={styles.status}>{event.status}</span>
        </div>
      ))}
    </div>
  );
};
```

## 🎨 Styling

### CSS Modules

Component-specific styles using CSS Modules:

```css
/* EventList.module.css */
.eventList {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.eventCard {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.eventCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
```

## 🔧 Configuration

### Webpack Configuration

Key webpack settings in `webpack.config.js`:

- **Development Server**: Hot reload, proxy configuration
- **Production Build**: Minification, tree shaking
- **TypeScript**: ts-loader for TypeScript compilation
- **CSS**: CSS modules with PostCSS
- **Environment Variables**: DotenvWebpackPlugin

### TypeScript Configuration

`tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@pages/*": ["pages/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

## 🧪 Testing

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { EventList } from './EventList';

describe('EventList', () => {
  it('renders event list', async () => {
    render(<EventList />);
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microfrontend.Dockerfile \
  --build-arg MICROFRONTEND_NAME=dj-panel \
  --build-arg REACT_APP_API_GATEWAY=https://api.djbeatblaster.com \
  -t djbeatblaster/dj-panel:latest \
  ../..
```

### Environment Variables

Production environment variables:

```env
REACT_APP_API_GATEWAY=https://api.djbeatblaster.com
REACT_APP_API_SECURE_KEY=ProductionSecureKey
REACT_APP_STRAPI_URL=https://cms.djbeatblaster.com
NODE_ENV=production
```

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [API Gateway Documentation](../../Services/DJHostGateway/README.md)
- [All Service READMEs](../../Services/)

## 🐛 Troubleshooting

### API requests fail with CORS error
- Check API Gateway CORS configuration
- Verify allowed origins include frontend URL
- Check browser console for specific error

### Authentication token expires quickly
- Check JWT expiry settings in IdentityAPI
- Implement token refresh mechanism
- Store refresh token securely

### Build fails with TypeScript errors
- Run `npm run map:api` to regenerate types
- Check for missing dependencies
- Verify TypeScript configuration

### Hot reload not working
- Check webpack dev server configuration
- Verify port 3080/3000 is not in use
- Restart development server

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
