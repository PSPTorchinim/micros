# Microservices - DJ Beat Blaster Platform

This directory contains all the microservices that make up the DJ Beat Blaster platform. Each service is designed to be independent, scalable, and responsible for a specific business domain.

## 🏗️ Architecture Overview

The platform follows Domain-Driven Design (DDD) principles with each service owning its data and business logic. Services communicate via HTTP APIs through the API Gateway and use RabbitMQ for asynchronous messaging.

## 📦 Available Services

### 🔐 IdentityAPI

**Port**: 5001 | **Database**: SQL Server (IdentityDB)

Handles user authentication, authorization, and identity management.

**Key Features:**

- JWT token-based authentication
- Role-based access control (RBAC)
- User registration and management
- Password reset functionality
- Session management

**Endpoints:**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/users` - User management
- `GET /api/roles` - Role management

### 🎵 MusicAPI

**Port**: 5002 | **Database**: SQL Server (MusicDB)

Manages music libraries, playlists, and track metadata.

**Key Features:**

- Music library management
- Playlist creation and management
- Track metadata and tagging
- Search and filtering capabilities
- Music recommendation engine

**Endpoints:**

- `GET /api/tracks` - Browse music library
- `POST /api/playlists` - Create playlists
- `GET /api/playlists/{id}` - Get playlist details
- `POST /api/tracks/upload` - Upload music files
- `GET /api/tracks/search` - Search tracks

### 🎛️ EquipmentAPI (Gear)

**Port**: 5003 | **Database**: SQL Server (GearDB)

Manages DJ equipment inventory and tracking.

**Key Features:**

- Equipment inventory management
- Maintenance scheduling
- Equipment availability tracking
- Rental and booking management
- Equipment specifications and documentation

**Endpoints:**

- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Add new equipment
- `GET /api/equipment/{id}` - Get equipment details
- `PUT /api/equipment/{id}/maintenance` - Schedule maintenance
- `GET /api/equipment/availability` - Check availability

### 📄 DocumentsAPI

**Port**: 5004 | **Database**: MongoDB (DocumentsDB)

Handles document templates, contracts, and document generation.

**Key Features:**

- Contract template management
- Document generation from templates
- PDF generation and processing
- Document versioning and history
- Digital signature integration

**Endpoints:**

- `GET /api/templates` - List document templates
- `POST /api/templates` - Create new template
- `POST /api/documents/generate` - Generate document from template
- `GET /api/documents/{id}` - Get document
- `POST /api/documents/{id}/sign` - Digital signature

### 🏢 CompanyAPI (Brand)

**Port**: 5005 | **Database**: SQL Server (BrandDB)

Manages brand information, client relationships, and business data.

**Key Features:**

- Brand and company profile management
- Client relationship management (CRM)
- Business contact management
- Service packages and pricing
- Client communication history

**Endpoints:**

- `GET /api/brands` - List brands
- `POST /api/clients` - Add new client
- `GET /api/clients` - List clients
- `GET /api/packages` - Service packages
- `POST /api/clients/{id}/communication` - Log communication

### 🎉 PartyAPI

**Port**: 5006 | **Database**: SQL Server (PartyDB)

Manages events, parties, and booking system.

**Key Features:**

- Event creation and management
- Booking and scheduling system
- Event timeline and planning
- Venue and location management
- Event performance tracking

**Endpoints:**

- `GET /api/events` - List events
- `POST /api/events` - Create new event
- `GET /api/events/{id}` - Get event details
- `PUT /api/events/{id}/schedule` - Update event schedule
- `GET /api/bookings` - Booking management

### ✉️ MailingAPI

**Port**: 5007 | **Database**: MongoDB (MailingDB)

Handles email campaigns, templates, and communication management.

**Key Features:**

- Email template management
- Campaign creation and scheduling
- Mailing list management
- Email analytics and tracking
- Automated email workflows

**Endpoints:**

- `GET /api/templates` - Email templates
- `POST /api/campaigns` - Create email campaign
- `GET /api/campaigns/{id}` - Campaign details
- `POST /api/mailings/send` - Send emails
- `GET /api/analytics` - Email analytics

### 🌐 DJHostGateway (API Gateway)

**Port**: 5000 | **Database**: SQL Server (ApiGatewayDB)

Central API Gateway using YARP for routing, load balancing, and cross-cutting concerns.

**Key Features:**

- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- API documentation aggregation
- Cross-Origin Resource Sharing (CORS)

**Routing Configuration:**

- `/identity/api/*` → IdentityAPI
- `/music/api/*` → MusicAPI
- `/gear/api/*` → EquipmentAPI
- `/documents/api/*` → DocumentsAPI
- `/brand/api/*` → CompanyAPI
- `/party/api/*` → PartyAPI
- `/mailing/api/*` → MailingAPI

## 🔧 Shared Components

### Shared Library

The `Shared` project contains common functionality used across all services:

**Key Components:**

- **Database Configuration**: SQL Server and MongoDB setup
- **Authentication**: JWT token validation and middleware
- **Security**: API key validation and security middleware
- **Caching**: Redis configuration and services
- **Messaging**: RabbitMQ producer and consumer services
- **Health Checks**: Service health monitoring
- **CORS Configuration**: Cross-origin request handling
- **Swagger Configuration**: API documentation setup

### Common Patterns

**Dependency Injection:**

```csharp
builder.Services.BuildBasicServices(builder.Configuration, "ServiceName", "v1.0.0");
builder.Services.BuildScope<Program, SeedData, ServiceScope>(UseDatabase.ConfigureSqlServer<ServiceContext>);
```

**Application Setup:**

```csharp
app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<ServiceContext, Program>);
```

## 🛡️ Security

### Authentication Flow

1. User authenticates through IdentityAPI
2. JWT token issued with user claims and roles
3. API Gateway validates tokens on all requests
4. Individual services trust validated requests from gateway

### Security Features

- JWT Bearer token authentication
- Role-based authorization
- API key validation for service-to-service communication
- CORS policy configuration
- Request rate limiting
- SQL injection protection via parameterized queries

## 📊 Database Strategy

### Database per Service

Each service owns its database to ensure:

- **Data Isolation**: No cross-service database dependencies
- **Independent Scaling**: Services can scale their databases independently
- **Technology Choice**: Services can use the optimal database technology
- **Deployment Independence**: Services can be deployed without affecting others

### Database Technologies

- **SQL Server**: For relational data requiring ACID properties (Identity, Music, Equipment, Company, Party)
- **MongoDB**: For document-based data and flexible schemas (Documents, Mailing)
- **Redis**: For caching and session storage
- **PostgreSQL**: For Strapi CMS content

## 🔄 Communication Patterns

### Synchronous Communication

- HTTP REST APIs via API Gateway
- Request/Response pattern for immediate data needs
- Circuit breaker pattern for resilience

### Asynchronous Communication

- RabbitMQ message queues for event-driven communication
- Event sourcing for audit trails
- Saga pattern for distributed transactions

### Communication Matrix

| From Service | To Service   | Method   | Purpose             |
| ------------ | ------------ | -------- | ------------------- |
| Gateway      | All Services | HTTP     | Request routing     |
| All Services | IdentityAPI  | HTTP     | User validation     |
| PartyAPI     | MailingAPI   | RabbitMQ | Event notifications |
| DocumentsAPI | All Services | RabbitMQ | Document events     |

## 🏃‍♂️ Running Services

### Development Mode

```bash
# Start infrastructure
docker-compose -f ../Docker/dj-panel-composer.yml up -d sqlserver mongodb redis rabbitmq

# Run individual service
cd IdentityAPI
dotnet run --launch-profile "Local Development"
```

### Visual Studio

1. Open `Micros.sln`
2. Set multiple startup projects
3. Select "Local Development" profile for each service
4. Press F5 to start debugging

### Docker Mode

```bash
cd ../Docker
docker-compose -f dj-panel-composer.yml up -d
```

## 📝 API Documentation

Each service exposes Swagger documentation at:

- Individual Service: `http://localhost:500X/swagger`
- API Gateway (Aggregated): `http://localhost:5000/swagger`

### OpenAPI Specifications

All services follow OpenAPI 3.0 specifications with:

- Detailed endpoint documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses

## 🔍 Monitoring & Observability

### Health Checks

All services implement health checks accessible at:

- Individual: `/healthz/live`
- Aggregated: Available through API Gateway

### Logging

- Structured logging with Serilog
- Centralized log aggregation
- Request/response logging
- Performance metrics

### Metrics

- Application performance monitoring
- Database connection monitoring
- Message queue health
- Custom business metrics

## 🧪 Testing Strategy

### Unit Tests

Each service includes comprehensive unit tests:

```bash
cd ServiceName.Tests
dotnet test
```

### Integration Tests

API integration tests for each service:

```bash
dotnet test --filter Category=Integration
```

### Load Testing

Performance and load testing for critical endpoints:

```bash
dotnet test --filter Category=Load
```

## 🔧 Development Guidelines

### Code Standards

- Follow C# coding conventions
- Use dependency injection for all dependencies
- Implement proper error handling and logging
- Write unit tests for all business logic
- Document all public APIs

### Database Migrations

- Use Entity Framework migrations for SQL Server
- Version control all migration files
- Test migrations in development before production
- Always create rollback plans

### API Versioning

- Use URL path versioning (`/v1/api/...`)
- Maintain backward compatibility
- Deprecate old versions gradually
- Document breaking changes

## 📦 Deployment

### Environment Configuration

- Development: Local development with local databases
- Staging: Docker containers with shared databases
- Production: Kubernetes with distributed databases

### CI/CD Pipeline

- Automated builds on commits
- Unit and integration tests
- Security vulnerability scanning
- Automated deployment to staging
- Manual approval for production deployment

For detailed deployment instructions, see the [Docker README](../Docker/README.md) and [Kubernetes configurations](../k8s/README.md).

## 📖 Individual Service Documentation

Each microservice has its own detailed README with specific implementation details, API endpoints, and configuration:

- **[IdentityAPI](./IdentityAPI/README.md)** - Authentication & User Management Service
- **[MusicAPI](./MusicAPI/README.md)** - Music Library Management Service
- **[EquipmentAPI](./EquipmentAPI/README.md)** - DJ Equipment Management Service (GearAPI)
- **[DocumentsAPI](./DocumentsAPI/README.md)** - Document & Template Management Service
- **[CompanyAPI](./CompanyAPI/README.md)** - Brand & Client Management Service (BrandAPI)
- **[PartyAPI](./PartyAPI/README.md)** - Event & Booking Management Service
- **[MailingAPI](./MailingAPI/README.md)** - Email Campaign & Communication Service
- **[DJHostGateway](./DJHostGateway/README.md)** - API Gateway Service (YARP)

Each service README includes:
- Detailed API endpoint documentation
- Local development setup instructions
- Configuration examples
- Testing guidelines
- Docker deployment instructions
- Integration information
