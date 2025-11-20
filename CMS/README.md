# DJ Beat Blaster CMS - Strapi Headless CMS

This is the content management system for the DJ Beat Blaster platform, built with Strapi v5. It provides a powerful headless CMS for managing content across the DJ platform, including DJ profiles, event management, music metadata, and administrative content.

## 📋 Overview

The CMS serves as the central content management hub for:

- **DJ Profiles**: Biography, photos, social links, and professional information
- **Event Content**: Event descriptions, promotional materials, and documentation
- **Music Metadata**: Track information, playlists, and music library management
- **Blog & News**: Platform announcements, DJ spotlights, and industry news
- **Media Assets**: Images, videos, and audio files
- **Legal Content**: Terms of service, privacy policy, and documentation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Strapi CMS                           │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │   Admin Panel   │    │   REST API      │            │
│  │  (React SPA)    │    │   GraphQL       │            │
│  └─────────────────┘    └─────────────────┘            │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │ Content Types   │    │   Media Library │            │
│  │   & Models      │    │   & Storage     │            │
│  └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL                             │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │   Content Data  │    │   Media Files   │            │
│  │   & Relations   │    │   Metadata      │            │
│  └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
CMS/
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── favicon.png              # CMS favicon
├── README.md               # This documentation
├── config/                 # Strapi configuration
│   ├── admin.ts            # Admin panel configuration
│   ├── api.ts              # API configuration
│   ├── database.ts         # Database connection settings
│   ├── middlewares.ts      # Middleware configuration
│   ├── plugins.ts          # Plugin configuration
│   └── server.ts           # Server configuration
├── database/               # Database management
│   └── migrations/         # Database migrations
├── public/                 # Static assets
│   ├── robots.txt          # SEO robots file
│   └── uploads/            # User uploaded files
├── src/                    # Source code
│   ├── index.ts           # Application entry point
│   ├── admin/             # Admin customizations
│   ├── api/               # Content type definitions
│   ├── components/        # Reusable components
│   └── extensions/        # Strapi extensions
└── types/                    # TypeScript definitions
    └── generated/           # Auto-generated types
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14.x or higher

### Installation

1. **Install Dependencies**

   ```bash
   cd CMS
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Configure database connection in .env
   ```

3. **Database Setup**

   ```bash
   # Create PostgreSQL database
   createdb strapi_djbeatblaster

   # Run database migrations
   npm run strapi build
   npm run develop
   ```

### Development Commands

```bash
# Start development server (with auto-reload)
npm run develop          # Runs on http://localhost:1337

# Build for production
npm run build           # Creates optimized build

# Start production server
npm run start           # Serves production build

# Strapi CLI commands
npm run strapi          # Access Strapi CLI
npm run strapi generate # Generate content types
npm run strapi console  # Open Strapi console
```

## 📊 Content Types

The CMS includes the following content types for managing DJ platform content:

### DJ Profile

- Personal and professional information
- Profile photos and galleries
- Social media links
- Availability and rates
- Equipment and specialties

### Event

- Event details and scheduling
- Venue information
- DJ assignments
- Photo galleries
- Status tracking

### Music Track

- Track metadata and files
- Genre and BPM information
- Play counts and popularity
- Artist and album data

### Playlist

- Track collections
- DJ-curated playlists
- Category organization
- Duration calculations

### Blog Post

- News and announcements
- DJ spotlights and interviews
- SEO optimization
- Rich text content

## 🔧 Configuration

### Database Configuration

The CMS uses PostgreSQL for content storage. Configuration is managed in `config/database.ts` with support for:

- Connection pooling
- SSL/TLS encryption
- Environment-based settings
- Migration management

### Admin Panel

The admin interface is customized for DJ Beat Blaster branding with:

- Custom theme colors
- DJ-focused navigation
- Media-rich content editing
- Role-based permissions

### API Configuration

Both REST and GraphQL APIs are available with:

- JWT authentication
- Role-based access control
- Content filtering and sorting
- Media file serving

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permission levels for users
- **Content Security Policy**: Protection against XSS attacks
- **Rate Limiting**: API request throttling
- **Input Validation**: Sanitized content input

## 🚀 Deployment

### Environment Variables

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://cms.djbeatblaster.com

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres-service
DATABASE_PORT=5432
DATABASE_NAME=strapi_production
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=secure_password

# Security
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=admin-jwt-secret
API_TOKEN_SALT=api-token-salt
JWT_SECRET=jwt-secret
```

### Production Build

```bash
# Build optimized version
npm run build

# Start production server
NODE_ENV=production npm start
```

### Docker Deployment

The CMS can be containerized using the Docker configuration in the `../Docker/` directory. See [Docker documentation](../Docker/README.md) for details.

## 📚 API Usage

### REST API Examples

#### Get DJ Profiles

```http
GET /api/dj-profiles?populate=*
Authorization: Bearer your-jwt-token
```

#### Create New Event

```http
POST /api/events
Authorization: Bearer your-jwt-token
Content-Type: application/json

{
  "data": {
    "title": "Summer Beach Party",
    "description": "Annual summer celebration...",
    "eventType": "party",
    "date": "2024-07-15"
  }
}
```

### GraphQL API

GraphQL endpoint available at `/graphql` with full schema introspection and playground interface.

## 🔄 Content Management

### Import/Export

```bash
# Export content
npm run strapi export --no-encrypt --file backup.tar

# Import content
npm run strapi import --file backup.tar
```

### Migrations

Database schema changes are managed through Strapi's migration system with version control integration.

## 🚨 Troubleshooting

### Common Issues

#### Database Connection

```bash
# Test PostgreSQL connection
psql -h localhost -U strapi -d strapi_djbeatblaster
```

#### Permission Issues

```bash
# Reset admin cache
rm -rf .cache
npm run build
```

#### Media Upload Issues

```bash
# Check upload directory permissions
chmod 755 public/uploads
```

## 🚀 Bootstrap Tasks

### Overview

The CMS includes bootstrap tasks that run automatically when Strapi starts up. These tasks set up essential content and configurations.

### Task Organization

Bootstrap tasks are organized in `src/extensions/bootstrap/tasks/` into focused, single-purpose files:

**Content Type Seeders:**
- `seed-hero-blocks.ts` - Seeds hero blocks
- `seed-feature-sections.ts` - Seeds feature sections
- `seed-article-blocks.ts` - Seeds article blocks
- `seed-steps-containers.ts` - Seeds steps containers
- `seed-contact-info.ts` - Seeds contact info entries
- `seed-contact-sections.ts` - Seeds contact sections

**Page Seeders:**
- `seed-login-page.ts` - Seeds the Login page
- `seed-forgot-password-page.ts` - Seeds the Forgot Password page
- `seed-home-page.ts` - Seeds the Home page (references content blocks)
- `seed-about-page.ts` - Seeds the About page (references content blocks)

**Content Seeders:**
- `seed-articles.ts` - Seeds DJ articles
- `seed-footer.ts` - Seeds the footer

**Orchestrators:**
- `seed-content-types.ts` - Orchestrates all content type seeding
- `seed-pages.ts` - Orchestrates all page seeding tasks

### Main Tasks

**Content Types Seeder** (`seed-content-types.ts`)

Coordinates seeding of all reusable content types created first and referenced by pages:

1. Hero Blocks - "Welcome to DJ Beat Blaster" with CTAs
2. Feature Sections - 6 DJ business features (Music Library, Events, Clients, Equipment, Contracts, Email Marketing)
3. Article Blocks - "Latest DJ Tips & Guides" container
4. Steps Containers - "Get Started in 3 Simple Steps"
5. Contact Info - Email, Phone, Location entries
6. Contact Sections - About page content with contact details

**Pages Seeder** (`seed-pages.ts`)

Main entry point that coordinates seeding of all standard pages:

1. Gets or creates default configuration
2. Seeds Login page
3. Seeds Forgot Password page
4. Seeds Home page (uses Hero Block, Feature Section, Article Block, Steps Container)
5. Seeds About page (uses Contact Section)

### Adding New Tasks

1. **Create task file** in `src/extensions/bootstrap/tasks/`:
   ```typescript
   // seed-my-task.ts
   export default async function seedMyTask({ strapi }: { strapi: any }) {
     console.info('[SEED][MY_TASK] Starting...');
     // Your seeding logic here
     console.info('[SEED][MY_TASK] Done!');
   }
   ```

2. **Register task** in `run-bootstrap.ts`:
   ```typescript
   const TASKS = {
     // ... existing tasks
     myTask: ['./tasks/seed-my-task', './seed-my-task'] as const,
   } as const;

   export default async function runBootstrap({ strapi }: { strapi: StrapiAny }) {
     // ... existing tasks
     await runTask(strapi, 'seed-my-task', TASKS.myTask);
   }
   ```

## 📖 Learn More

- [Strapi Documentation](https://docs.strapi.io) - Official Strapi documentation
- [Dynamic Content Building Guide](DYNAMIC_CONTENT_GUIDE.md) - How to create pages without code changes
- [Main Project README](../README.md) - DJ Beat Blaster platform overview
- [Docker Setup](../Docker/README.md) - Container deployment guide
- [API Documentation](../Services/README.md) - Microservices integration

---

**Developed by PSPTorchinim**
