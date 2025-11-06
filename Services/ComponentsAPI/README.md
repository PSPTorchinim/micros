# ComponentsAPI - Component Stories Management Service

## 📋 Overview

The ComponentsAPI service manages component stories and documentation for the DJ Beat Blaster platform. It provides a centralized system for showcasing UI components with examples, similar to Storybook or Histoire.

**Port**: 5008  
**Database**: SQL Server (ComponentsDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides component documentation and showcase capabilities for:

- Component library management
- Story/example management for each component
- Component categorization and tagging
- Props and configuration documentation
- Code examples and previews

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│        ComponentsAPI Service        │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ ComponentsController            │
│  └─ StoriesController               │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ ComponentsService               │
│  └─ StoriesService                  │
├─────────────────────────────────────┤
│  Data Layer (EF Core)               │
│  └─ SQL Server (ComponentsDB)       │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

- **Component** - UI component definitions with metadata
- **Story** - Component usage examples and stories

## 🔌 API Endpoints

### Components Management

- `GET /api/components` - List all components
- `GET /api/components/{id}` - Get component details
- `POST /api/components` - Create new component
- `PUT /api/components/{id}` - Update component
- `DELETE /api/components/{id}` - Delete component

### Stories Management

- `GET /api/stories` - List all stories
- `GET /api/stories/{id}` - Get story details
- `GET /api/stories/component/{componentId}` - Get stories for a specific component
- `POST /api/stories` - Create new story
- `PUT /api/stories/{id}` - Update story
- `DELETE /api/stories/{id}` - Delete story

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core** - ORM for SQL Server
- **SQL Server** - Primary database
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Schema

The ComponentsDB contains the following tables:

- `Components` - Component definitions with metadata
- `Stories` - Component usage examples and stories

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server 2022 or higher
- Visual Studio 2022 or VS Code

### Local Development

1. **Configure Database Connection**

   Edit `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=ComponentsDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
     }
   }
   ```

2. **Run Database Migrations**

   ```bash
   dotnet ef database update
   ```

3. **Start the Service**

   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger Documentation**

   Navigate to: http://localhost:5008/swagger

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/ComponentsAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Token Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Granular permission system
- **HTTPS Enforcement** - Secure communication

## 🐳 Docker

### Build Docker Image

```bash
docker build -t componentsapi:latest .
```

### Run Container

```bash
docker run -d -p 5008:5008 \
  -e SQL_CONNECTION_STRING=your-connection \
  componentsapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design
- [API Gateway](../DJHostGateway/README.md) - Gateway configuration

## 🤝 Integration with Other Services

The ComponentsAPI is consumed by:

- **DJHostGateway** - API routing and authentication
- **DJ Panel Frontend** - Component documentation viewing
- **All Services** - Component library documentation

## 🔧 Development Guidelines

### Adding New Endpoints

1. Create controller method
2. Implement service logic
3. Add authorization attributes
4. Update Swagger documentation
5. Write unit tests

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

## 📞 Support

For issues related to ComponentsAPI, please refer to the main project repository or contact the development team.

---

**Built with ❤️ by the DJ Beat Blaster Team**
