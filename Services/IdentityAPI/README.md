# IdentityAPI - Authentication & User Management Service

## 📋 Overview

The IdentityAPI service is the core authentication and authorization service for the DJ Beat Blaster platform. It handles user management, role-based access control (RBAC), and JWT token-based authentication for all platform services.

**Port**: 5001  
**Database**: SQL Server (IdentityDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides centralized identity and access management for:

- User authentication and session management
- Role-based authorization and permissions
- JWT token generation and validation
- User profile management
- Password management and security

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│        IdentityAPI Service          │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ UsersController                 │
│  ├─ RolesController                 │
│  └─ PermissionsController           │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ AuthenticationService           │
│  ├─ UserService                     │
│  └─ PermissionService               │
├─────────────────────────────────────┤
│  Data Layer (EF Core)               │
│  └─ SQL Server (IdentityDB)         │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

- **User** - User accounts and credentials
- **Role** - User roles (Admin, DJ, Client, etc.)
- **Permission** - Granular permissions for access control
- **Password** - Password history and security
- **Block** - User blocking and security features

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login and token generation
- `POST /api/auth/register` - New user registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users` - List all users (paginated)
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user information
- `DELETE /api/users/{id}` - Delete user account
- `PUT /api/users/{id}/password` - Change user password

### Role Management

- `GET /api/roles` - List all roles
- `GET /api/roles/{id}` - Get role details
- `POST /api/roles` - Create new role
- `PUT /api/roles/{id}` - Update role
- `DELETE /api/roles/{id}` - Delete role

### Permission Management

- `GET /api/permissions` - List all permissions
- `GET /api/permissions/user/{userId}` - Get user permissions
- `POST /api/permissions` - Assign permission
- `DELETE /api/permissions/{id}` - Remove permission

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core** - ORM for SQL Server
- **SQL Server** - Primary database
- **JWT** - Token-based authentication
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Schema

The IdentityDB contains the following tables:

- `Users` - User accounts and credentials
- `Roles` - User roles
- `Permissions` - Permission definitions
- `UserRoles` - Many-to-many relationship
- `RolePermissions` - Many-to-many relationship
- `Passwords` - Password history
- `Blocks` - User blocking records

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
       "DefaultConnection": "Server=localhost;Database=IdentityDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
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

   Navigate to: http://localhost:5001/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10",
    "RefreshTokenExpireTime": "2592000"
  }
}
```

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/IdentityAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Token Authentication** - Secure token-based authentication
- **Password Hashing** - BCrypt password hashing
- **Role-Based Access Control** - Granular permission system
- **Token Expiration** - Automatic token expiration and refresh
- **Account Lockout** - Protection against brute force attacks
- **HTTPS Enforcement** - Secure communication

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
JWT_ISSUER=JWTServiceAccessToken
JWT_AUDIENCE=JWTServicePostmanClient
SQL_CONNECTION_STRING=your-connection-string
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t identityapi:latest .
```

### Run Container

```bash
docker run -d -p 5001:5001 \
  -e JWT_SECRET_KEY=your-secret \
  -e SQL_CONNECTION_STRING=your-connection \
  identityapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design
- [API Gateway](../DJHostGateway/README.md) - Gateway configuration

## 🤝 Integration with Other Services

The IdentityAPI is consumed by:

- **DJHostGateway** - Token validation and routing
- **All Services** - User authentication and authorization
- **DJ Panel Frontend** - User login and session management

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

For issues related to IdentityAPI, please refer to the main project repository or contact the development team.

---

**Built with ❤️ by the DJ Beat Blaster Team**
