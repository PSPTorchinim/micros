# DJ Panel - React Frontend Application

## 📋 Overview

The DJ Panel is the primary frontend application for the DJ Beat Blaster platform. Built with React 19 and TypeScript, it provides a modern, responsive user interface for managing all aspects of DJ business operations.

**Port**: 3000 (development), 3080 (alternative dev port)  
**Framework**: React 19.1.1 + TypeScript  
**Bundler**: Webpack 5

## 🎯 Purpose

The DJ Panel provides comprehensive UI for:

- User authentication and profile management
- Music library browsing and playlist creation
- Event and booking management
- Client and brand management
- Equipment inventory tracking
- Document generation and management
- Email campaign creation
- Analytics and reporting dashboards

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DJ Panel (React)                       │
├─────────────────────────────────────────────────────────┤
│  Components                                             │
│  ├─ Pages (Routes)                                      │
│  ├─ Layouts                                             │
│  ├─ UI Components                                       │
│  └─ Forms                                               │
├─────────────────────────────────────────────────────────┤
│  State Management                                       │
│  ├─ Context API                                         │
│  ├─ Custom Hooks                                        │
│  └─ Local State                                         │
├─────────────────────────────────────────────────────────┤
│  Services                                               │
│  ├─ API Client (Axios)                                  │
│  ├─ Authentication Service                              │
│  └─ Data Services                                       │
├─────────────────────────────────────────────────────────┤
│  Routing                                                │
│  └─ React Router DOM 7                                  │
└─────────────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│              DJHostGateway (API Gateway)                │
│                    Port 5000                            │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Core

- **React 19.1.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **Webpack 5** - Module bundler
- **Babel** - JavaScript transpiler

### Routing & State

- **React Router DOM 7** - Client-side routing
- **React Context API** - State management
- **Custom Hooks** - Reusable logic

### HTTP & Data

- **Axios** - HTTP client
- **React Query** (optional) - Server state management

### Styling

- **CSS Modules** - Scoped styling
- **React Icons** - Icon library

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **React Testing Library** - Component testing

## 📁 Directory Structure

```
dj-panel/
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── webpack.config.js        # Webpack configuration
├── .eslintrc.js             # ESLint rules
├── .prettierrc              # Prettier configuration
├── public/                  # Static assets
│   ├── index.html
│   └── favicon.ico
├── src/                     # Source code
│   ├── index.tsx           # Application entry point
│   ├── App.tsx             # Root component
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   │   ├── Dashboard/
│   │   ├── Music/
│   │   ├── Events/
│   │   ├── Clients/
│   │   └── Equipment/
│   ├── services/           # API services
│   │   ├── api.ts          # API client configuration
│   │   ├── auth.service.ts
│   │   └── [service].service.ts
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── models/             # TypeScript interfaces
│   │   ├── api/            # API models (auto-generated)
│   │   └── strapi/         # Strapi models (auto-generated)
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
└── scripts/                # Build and utility scripts
    ├── map-api.js          # API model generator
    └── map-strapi.js       # Strapi model generator
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- Backend services running (DJHostGateway on port 5000)

### Installation

1. **Install Dependencies**

   ```bash
   cd Frontends/dj-panel
   npm install
   ```

2. **Configure Environment**

   Create `.env` file:

   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_STRAPI_URL=http://localhost:1337
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   # or
   npm run start:live
   ```

4. **Access Application**

   Navigate to: http://localhost:3000

## 📜 Available Scripts

### Development

```bash
# Start development server on port 3080
npm run dev

# Start development server on port 3000 with live reload
npm run start:live

# Start production build server
npm run prod

# Start staging build server
npm run staging
```

### Building

```bash
# Build for production
npm run build

# Build for development (unminified)
npm run build:dev

# Serve built files
npm run build:start
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Format and fix code
npm run format:fix
```

### Testing

```bash
# Run tests
npm test
```

### Code Generation

```bash
# Generate API models from backend
npm run map:api

# Generate Strapi models from CMS
npm run map:strapi
```

## 🎨 Features

### Dashboard

- Overview of key metrics
- Recent events and bookings
- Music library statistics
- Quick actions and shortcuts

### Music Management

- Browse music library
- Create and manage playlists
- Search and filter tracks
- Upload new music files
- Edit track metadata

### Event Management

- View event calendar
- Create and edit events
- Manage bookings
- Assign equipment and playlists
- Track event status

### Client Management

- Client database (CRM)
- Client profiles and history
- Communication logs
- Service packages

### Equipment Management

- Equipment inventory
- Availability tracking
- Maintenance scheduling
- Equipment assignments

### Document Management

- Contract templates
- Document generation
- Invoice creation
- PDF downloads

### Email Campaigns

- Email template editor
- Campaign creation
- Mailing list management
- Campaign analytics

## 🔐 Authentication

The application uses JWT-based authentication:

1. User logs in via IdentityAPI
2. JWT token stored in localStorage/sessionStorage
3. Token included in all API requests
4. Automatic token refresh
5. Protected routes and role-based access

### Protected Routes

```typescript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

## 📡 API Integration

### API Client Configuration

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Service Example

```typescript
// services/music.service.ts
export const MusicService = {
  getTracks: async (params) => {
    const response = await apiClient.get('/music/api/tracks', { params });
    return response.data;
  },
  
  createPlaylist: async (data) => {
    const response = await apiClient.post('/music/api/playlists', data);
    return response.data;
  },
};
```

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders dashboard', () => {
  render(<Dashboard />);
  const heading = screen.getByText(/Dashboard/i);
  expect(heading).toBeInTheDocument();
});
```

## 🎯 Code Style

The project enforces code style with:

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### ESLint Configuration

Configured to:
- Enforce React best practices
- TypeScript strict mode
- No unused variables
- Consistent code style

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory with optimized bundle

### Environment Variables

```env
# API Configuration
REACT_APP_API_URL=https://api.djbeatblaster.com
REACT_APP_STRAPI_URL=https://cms.djbeatblaster.com

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

### Docker Deployment

```bash
# Build image
docker build -t dj-panel:latest .

# Run container
docker run -d -p 3000:3000 \
  -e REACT_APP_API_URL=http://gateway:5000 \
  dj-panel:latest
```

## 🔧 Configuration

### Webpack Configuration

The application uses a custom Webpack configuration with:

- Hot Module Replacement (HMR)
- Code splitting
- CSS Modules
- TypeScript support
- Development and production modes

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [DJHostGateway](../../Services/DJHostGateway/README.md) - API Gateway
- [Services Overview](../../Services/README.md) - Backend services

## 🤝 Integration

The DJ Panel integrates with:

- **DJHostGateway** - All API requests through gateway
- **Strapi CMS** - Content and media management
- **IdentityAPI** - User authentication
- All other backend services via gateway

## 🎯 Future Enhancements

- Progressive Web App (PWA) support
- Offline functionality
- Real-time updates (WebSockets/SignalR)
- Advanced analytics dashboards
- Mobile responsive improvements
- Accessibility (WCAG 2.1 AA compliance)
- Internationalization (i18n)
- Dark mode theme

## 📞 Support

For issues related to the DJ Panel frontend, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
