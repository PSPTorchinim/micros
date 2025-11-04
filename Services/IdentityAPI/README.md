# IdentityAPI - Authentication & User Management Service

The Identity service handles all authentication, authorization, and user management functionality for the DJ Beat Blaster platform.

## 📋 Overview

IdentityAPI is the central authentication service that manages:

- User registration and authentication
- JWT token generation and validation
- Role-based access control (RBAC)
- Password management and reset
- User profile management
- Session management

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (IdentityDB)
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
IdentityAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # Database context and seed data
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic services
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── IdentityAPI.csproj  # Project file
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server (local or container)
- Visual Studio 2022 or VS Code

### Running Locally

1. **Ensure SQL Server is running**:
   ```bash
   docker run -d --name sqlserver -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Update connection string** in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1433;Database=IdentityDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5001/swagger

## 🔌 API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "roles": ["DJ", "Admin"]
  }
}
```

#### POST /api/auth/register
Register a new user account.

**Request**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/refresh
Refresh expired JWT token using refresh token.

**Request**:
```json
{
  "token": "expired_token",
  "refreshToken": "valid_refresh_token"
}
```

#### POST /api/auth/logout
Invalidate user session and tokens.

### User Management

#### GET /api/users
Get paginated list of users (Admin only).

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `search` - Search term for email/name

#### GET /api/users/{id}
Get specific user details.

#### PUT /api/users/{id}
Update user information.

#### DELETE /api/users/{id}
Delete user account (Admin only).

### Role Management

#### GET /api/roles
Get list of available roles.

#### POST /api/users/{id}/roles
Assign role to user (Admin only).

#### DELETE /api/users/{id}/roles/{roleId}
Remove role from user (Admin only).

## 🔒 Security Features

### JWT Token Configuration

- **Algorithm**: HMAC-SHA256
- **Token Expiry**: 1 hour
- **Refresh Token Expiry**: 7 days
- **Claims**: User ID, email, roles, permissions

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

### Role-Based Access Control

Available roles:
- **Admin**: Full system access
- **DJ**: DJ-specific features and content management
- **Client**: Limited read-only access to bookings and events
- **Guest**: Public content access only

## 🗄️ Database Schema

### Users Table
- Id (PK)
- Email (Unique)
- PasswordHash
- FirstName
- LastName
- CreatedAt
- UpdatedAt
- IsActive
- LastLoginAt

### Roles Table
- Id (PK)
- Name
- Description

### UserRoles Table (Junction)
- UserId (FK)
- RoleId (FK)

### RefreshTokens Table
- Id (PK)
- UserId (FK)
- Token
- ExpiresAt
- CreatedAt
- RevokedAt

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_SQLSERVER=localhost
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
IDENTITY_DATABASE_CATALOG=IdentityDB

# Security
JWT_KEY=YourSecureJWTKeyHere123456789012345678901234567890
SECURE_KEY=YourSecureAPIKeyHere
JWT_EXPIRY_HOURS=1
REFRESH_TOKEN_EXPIRY_DAYS=7

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/IdentityAPI.Tests
dotnet test
```

### Test Authentication Flow

1. Register a new user
2. Login with credentials
3. Use token to access protected endpoints
4. Refresh token before expiry
5. Test role-based authorization

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready to accept requests (DB connected)

## 🔍 Logging

Structured logging is implemented using Serilog with:

- Request/response logging
- Authentication events
- Error tracking
- Performance metrics

Logs are written to:
- Console (Development)
- File (Production)
- Centralized logging system (Grafana/Loki)

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=IdentityAPI \
  -t djbeatblaster/identity-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name identity-api \
  -p 5001:8080 \
  -e DATABASE_HOST_SQLSERVER=sqlserver \
  -e JWT_KEY=YourJWTKey \
  djbeatblaster/identity-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes all authentication requests
- **All Services**: Validate JWT tokens issued by IdentityAPI
- **CompanyAPI**: User-client relationships
- **PartyAPI**: User-event associations

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)
- [Shared Libraries](../Shared/README.md)

## 🐛 Troubleshooting

### Cannot connect to database
- Verify SQL Server is running
- Check connection string in appsettings
- Ensure IdentityDB database exists

### JWT token validation fails
- Check JWT_KEY matches across services
- Verify token hasn't expired
- Ensure clock synchronization between services

### User registration fails
- Check password meets requirements
- Verify email is unique
- Check database write permissions

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
