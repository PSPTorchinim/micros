# DJHostGateway - API Gateway Service

## 📋 Overview

The DJHostGateway is the central API Gateway for the DJ Beat Blaster platform, built using YARP (Yet Another Reverse Proxy). It serves as the single entry point for all client applications, handling routing, authentication, load balancing, and cross-cutting concerns.

**Port**: 5000  
**Database**: SQL Server (ApiGatewayDB)  
**Framework**: .NET 9 + ASP.NET Core + YARP

## 🎯 Purpose

This service provides critical gateway functionality for:

- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- API documentation aggregation
- Cross-Origin Resource Sharing (CORS)
- SSL/TLS termination
- Centralized logging and monitoring

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 External Clients                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ DJ Panel │  │Mobile App│  │3rd Party │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              DJHostGateway (YARP)                       │
│  ┌────────────────────────────────────────────────┐    │
│  │  Routing │ Auth │ Rate Limiting │ Logging     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    ▼                  ▼                  ▼
┌─────────┐      ┌─────────┐      ┌─────────┐
│Identity │      │  Music  │      │Equipment│
│   API   │      │   API   │  ... │   API   │
└─────────┘      └─────────┘      └─────────┘
```

## 🔌 Routing Configuration

The gateway routes requests to backend services:

| Route Pattern          | Target Service | Port | Purpose                    |
| ---------------------- | -------------- | ---- | -------------------------- |
| `/identity/api/**`     | IdentityAPI    | 5001 | Authentication & Users     |
| `/music/api/**`        | MusicAPI       | 5002 | Music Library              |
| `/gear/api/**`         | EquipmentAPI   | 5003 | Equipment Management       |
| `/documents/api/**`    | DocumentsAPI   | 5004 | Document Generation        |
| `/brand/api/**`        | CompanyAPI     | 5005 | Client & Brand Management  |
| `/party/api/**`        | PartyAPI       | 5006 | Event Management           |
| `/mailing/api/**`      | MailingAPI     | 5007 | Email Campaigns            |

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core** - Web framework
- **YARP** - Reverse proxy library
- **SQL Server** - Configuration and logging storage
- **JWT** - Token-based authentication
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - Aggregated API documentation

## 🔐 Security Features

### Authentication

- **JWT Bearer Token** - Validate tokens from IdentityAPI
- **API Key** - Service-to-service authentication
- **OAuth 2.0** - Third-party integrations (planned)

### Authorization

- **Role-Based Access Control** - Enforce user roles
- **Claim-Based Authorization** - Fine-grained permissions
- **Service-Level Authorization** - Control access to services

### Security Headers

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

## 🚦 Rate Limiting

Protect services from abuse:

- **Per User**: 1000 requests/hour
- **Per IP**: 5000 requests/hour
- **Per Endpoint**: Custom limits
- **Burst Protection**: Short-term spike handling

## 🔧 Configuration

### Routing Configuration (appsettings.json)

```json
{
  "ReverseProxy": {
    "Routes": {
      "identity-route": {
        "ClusterId": "identity-cluster",
        "Match": {
          "Path": "/identity/api/{**catch-all}"
        },
        "Transforms": [
          { "PathPattern": "/api/{**catch-all}" }
        ]
      }
    },
    "Clusters": {
      "identity-cluster": {
        "Destinations": {
          "destination1": {
            "Address": "http://localhost:5001/"
          }
        }
      }
    }
  }
}
```

### CORS Configuration

```json
{
  "CORS": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://djbeatblaster.com"
    ],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowedHeaders": ["Authorization", "Content-Type"]
  }
}
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server 2022 or higher
- Visual Studio 2022 or VS Code
- All backend services running

### Local Development

1. **Configure Database Connection**

   Edit `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=ApiGatewayDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
     }
   }
   ```

2. **Configure Service Endpoints**

   Update service URLs in `appsettings.Development.json`:

   ```json
   {
     "ServiceEndpoints": {
       "IdentityAPI": "http://localhost:5001",
       "MusicAPI": "http://localhost:5002",
       "EquipmentAPI": "http://localhost:5003",
       "DocumentsAPI": "http://localhost:5004",
       "CompanyAPI": "http://localhost:5005",
       "PartyAPI": "http://localhost:5006",
       "MailingAPI": "http://localhost:5007"
     }
   }
   ```

3. **Start the Gateway**

   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger Documentation**

   Navigate to: http://localhost:5000/swagger

## 📊 Load Balancing

YARP provides multiple load balancing strategies:

- **Round Robin** - Distribute evenly across instances
- **Least Requests** - Route to least busy instance
- **Random** - Random selection
- **Power of Two Choices** - Best of two random picks

### Configuration Example

```json
{
  "LoadBalancingPolicy": "RoundRobin",
  "HealthCheck": {
    "Active": {
      "Enabled": true,
      "Interval": "00:00:10",
      "Timeout": "00:00:05",
      "Path": "/healthz/live"
    }
  }
}
```

## 🔍 Monitoring & Observability

### Health Checks

- `/healthz/live` - Liveness probe
- `/healthz/ready` - Readiness probe
- `/healthz/services` - Backend service health

### Metrics

- Request count and latency
- Error rates per service
- Active connection count
- Circuit breaker status

### Logging

Structured logging with Serilog:

- Request/response logging
- Error tracking
- Performance metrics
- Audit trails

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/DJHostGateway.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
SQL_CONNECTION_STRING=your-connection-string
IDENTITY_API_URL=http://identityapi:5001
MUSIC_API_URL=http://musicapi:5002
EQUIPMENT_API_URL=http://equipmentapi:5003
DOCUMENTS_API_URL=http://documentsapi:5004
COMPANY_API_URL=http://companyapi:5005
PARTY_API_URL=http://partyapi:5006
MAILING_API_URL=http://mailingapi:5007
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t djhostgateway:latest .
```

### Run Container

```bash
docker run -d -p 5000:5000 \
  -e JWT_SECRET_KEY=your-secret \
  -e SQL_CONNECTION_STRING=your-connection \
  -e IDENTITY_API_URL=http://identityapi:5001 \
  djhostgateway:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [YARP Documentation](https://microsoft.github.io/reverse-proxy/) - YARP docs

## 🤝 Integration

All services integrate through the gateway:

- **Frontend Applications** - Single endpoint for all APIs
- **Mobile Apps** - Unified API access
- **Third-Party Services** - External API access
- **Monitoring Tools** - Centralized metrics collection

## 🔧 Development Guidelines

### Adding New Routes

1. Define route in `appsettings.json`
2. Configure cluster destination
3. Add transforms if needed
4. Update Swagger documentation
5. Test routing and authentication

### Health Check Implementation

```csharp
// Add health checks for backend services
builder.Services.AddHealthChecks()
    .AddUrlGroup(new Uri("http://identityapi:5001/healthz"), "IdentityAPI")
    .AddUrlGroup(new Uri("http://musicapi:5002/healthz"), "MusicAPI");
```

## 🎯 Features

### Request Transformation

- Path rewriting
- Header manipulation
- Query string modification
- Response transformation

### Circuit Breaker

Protect against cascading failures:

- Automatic failure detection
- Fallback responses
- Gradual recovery
- Failure threshold configuration

### Caching

Response caching for improved performance:

- In-memory caching
- Distributed caching (Redis)
- Cache invalidation
- Cache-Control headers

## ⚡ Performance

### Optimization Strategies

- Connection pooling
- HTTP/2 support
- Compression (Gzip, Brotli)
- Response caching
- Request buffering

### Recommended Settings

```json
{
  "Kestrel": {
    "Limits": {
      "MaxConcurrentConnections": 100,
      "MaxRequestBodySize": 10485760,
      "KeepAliveTimeout": "00:02:00"
    }
  }
}
```

## 📞 Support

For issues related to DJHostGateway, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
