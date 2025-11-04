# DJHostGateway - API Gateway Service

The API Gateway serves as the single entry point for all client requests to the DJ Beat Blaster microservices platform, built with YARP (Yet Another Reverse Proxy).

## 📋 Overview

DJHostGateway provides centralized gateway functionality:

- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- API documentation aggregation
- Cross-Origin Resource Sharing (CORS)
- Service discovery and health checks
- Centralized logging and monitoring

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Reverse Proxy**: YARP (Yet Another Reverse Proxy)
- **Database**: SQL Server (ApiGatewayDB) - for configuration and rate limiting
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI (aggregated from all services)

## 📁 Project Structure

```
DJHostGateway/
├── Controllers/         # Gateway-specific controllers
├── Data/               # Database context for gateway config
├── Middleware/         # Custom middleware (rate limiting, logging)
├── Configuration/      # YARP configuration and routing
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── DJHostGateway.csproj # Project file
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server (local or container) - for rate limiting and configuration
- All backend microservices running
- Visual Studio 2022 or VS Code

### Running Locally

1. **Ensure all backend services are running**:
   ```bash
   # Start infrastructure
   docker-compose -f ../../Docker/dj-panel-composer.yml up -d sqlserver mongodb redis
   
   # Start microservices (from Visual Studio or individually)
   ```

2. **Update configuration** in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1433;Database=ApiGatewayDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
     },
     "ReverseProxy": {
       "Routes": {
         "identity-route": {
           "ClusterId": "identity-cluster",
           "Match": {
             "Path": "/identity/{**catch-all}"
           }
         }
       },
       "Clusters": {
         "identity-cluster": {
           "Destinations": {
             "destination1": {
               "Address": "http://localhost:5001"
             }
           }
         }
       }
     }
   }
   ```

3. **Run the gateway**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Gateway Swagger**: http://localhost:5000/swagger

## 🔌 Route Configuration

### Service Routing Table

| Path Pattern | Target Service | Service Port | Description |
|-------------|----------------|--------------|-------------|
| `/identity/**` | IdentityAPI | 5001 | Authentication & user management |
| `/music/**` | MusicAPI | 5002 | Music library & playlists |
| `/gear/**` | EquipmentAPI | 5003 | Equipment inventory |
| `/documents/**` | DocumentsAPI | 5004 | Document templates & generation |
| `/brand/**` | CompanyAPI | 5005 | Brand & client management |
| `/party/**` | PartyAPI | 5006 | Event & booking management |
| `/mailing/**` | MailingAPI | 5007 | Email campaigns & templates |

### Example Routes

#### Identity Service
```
GET  /identity/api/auth/login       → http://identity-api:8080/api/auth/login
POST /identity/api/users            → http://identity-api:8080/api/users
```

#### Music Service
```
GET  /music/api/tracks              → http://music-api:8080/api/tracks
POST /music/api/playlists           → http://music-api:8080/api/playlists
```

#### Party Service
```
GET  /party/api/events              → http://party-api:8080/api/events
POST /party/api/bookings            → http://party-api:8080/api/bookings
```

## 🔐 Security Features

### JWT Authentication

The gateway validates JWT tokens for all protected routes:

```csharp
// Authentication configuration
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });
```

### Authorization Policies

- **Public**: No authentication required (login, registration)
- **Authenticated**: Valid JWT token required
- **Admin**: Admin role required
- **DJ**: DJ role required

### API Key Validation

Additional security layer for service-to-service communication:

```http
X-API-Key: your-secure-api-key
```

## 🚦 Rate Limiting

### Configuration

Rate limiting is applied per client/IP address:

```json
{
  "RateLimiting": {
    "EnableRateLimiting": true,
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 60
      }
    ],
    "SpecificRules": [
      {
        "Endpoint": "/identity/api/auth/login",
        "Period": "5m",
        "Limit": 5
      }
    ]
  }
}
```

### Rate Limit Headers

Responses include rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

## 🔄 Load Balancing

### Strategies

YARP supports multiple load balancing strategies:

- **RoundRobin**: Distributes requests evenly
- **LeastRequests**: Routes to service with fewest active requests
- **Random**: Random distribution
- **PowerOfTwoChoices**: Chooses best of two random picks

Example configuration:

```json
{
  "Clusters": {
    "music-cluster": {
      "LoadBalancingPolicy": "RoundRobin",
      "Destinations": {
        "music-1": { "Address": "http://music-api-1:8080" },
        "music-2": { "Address": "http://music-api-2:8080" },
        "music-3": { "Address": "http://music-api-3:8080" }
      }
    }
  }
}
```

## 🏥 Health Checks

### Gateway Health Endpoints

- **Gateway Health**: `/healthz/live` - Gateway is running
- **Gateway Readiness**: `/healthz/ready` - Gateway is ready to accept requests
- **Downstream Services**: `/health` - Aggregated health of all services

### Health Check Response

```json
{
  "status": "Healthy",
  "services": {
    "identity-api": {
      "status": "Healthy",
      "responseTime": "25ms"
    },
    "music-api": {
      "status": "Healthy",
      "responseTime": "30ms"
    },
    "party-api": {
      "status": "Degraded",
      "responseTime": "500ms",
      "message": "High database latency"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_SQLSERVER=localhost
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
APIGATEWAY_DATABASE_CATALOG=ApiGatewayDB

# Security
JWT_KEY=YourJWTKey
SECURE_KEY=YourSecureAPIKeyHere
JWT_ISSUER=djbeatblaster
JWT_AUDIENCE=djbeatblaster-clients

# Service Discovery
ASPNETCORE_IDENTITY_BE_ADDRESS=http://identity-api:8080
ASPNETCORE_MUSIC_BE_ADDRESS=http://music-api:8080
ASPNETCORE_GEAR_BE_ADDRESS=http://equipment-api:8080
ASPNETCORE_DOCUMENTS_BE_ADDRESS=http://documents-api:8080
ASPNETCORE_BRAND_BE_ADDRESS=http://company-api:8080
ASPNETCORE_PARTY_BE_ADDRESS=http://party-api:8080
ASPNETCORE_MAILING_BE_ADDRESS=http://mailing-api:8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://djbeatblaster.com

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 🌐 CORS Configuration

Cross-Origin Resource Sharing is configured to allow frontend access:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:3080",
      "https://djbeatblaster.com"
    ],
    "AllowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "AllowedHeaders": ["*"],
    "AllowCredentials": true
  }
}
```

## 📝 Request/Response Transformation

### Request Headers

Gateway adds tracking headers to all requests:

```http
X-Request-Id: unique-request-id
X-Forwarded-For: client-ip
X-Gateway-Time: 2024-01-15T10:30:00Z
```

### Response Headers

Gateway adds security and informational headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Powered-By: DJ Beat Blaster Gateway
```

## 📊 Monitoring & Logging

### Structured Logging

All requests are logged with:
- Request ID
- Client IP
- Request path and method
- Response status
- Duration
- User identity (if authenticated)

### Metrics Collected

- Request count per endpoint
- Response time percentiles
- Error rates
- Rate limit hits
- Circuit breaker status

## 🔌 Circuit Breaker

Circuit breaker pattern prevents cascading failures:

```json
{
  "CircuitBreaker": {
    "FailureThreshold": 5,
    "SuccessThreshold": 2,
    "Timeout": "30s",
    "BreakDuration": "60s"
  }
}
```

### Circuit States

- **Closed**: Normal operation
- **Open**: Too many failures, requests rejected
- **Half-Open**: Testing if service recovered

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/DJHostGateway.Tests
dotnet test
```

### Test Scenarios
- Route configuration
- Authentication flow
- Rate limiting
- Circuit breaker
- Load balancing
- Health checks

### Manual Testing

```bash
# Test routing
curl http://localhost:5000/identity/api/auth/login

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/music/api/tracks

# Test rate limiting
for i in {1..100}; do
  curl http://localhost:5000/identity/api/auth/login
done
```

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=DJHostGateway \
  -t djbeatblaster/api-gateway:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name api-gateway \
  -p 5000:8080 \
  -e DATABASE_HOST_SQLSERVER=sqlserver \
  -e ASPNETCORE_IDENTITY_BE_ADDRESS=http://identity-api:8080 \
  djbeatblaster/api-gateway:latest
```

## 📊 Performance Considerations

### Optimization Tips

1. **Connection Pooling**: Reuse HTTP connections to downstream services
2. **Response Caching**: Cache frequently accessed read-only data
3. **Request Buffering**: Minimize memory usage for large requests
4. **Compression**: Enable gzip/brotli compression
5. **Keep-Alive**: Enable HTTP keep-alive for persistent connections

### Scaling

Gateway can be scaled horizontally:

```bash
# Run multiple instances
docker-compose -f dj-panel-composer.yml up -d --scale apigateway=3
```

Load balancer (nginx/HAProxy) in front of gateway instances.

## 🤝 Integration Points

The gateway integrates with:

- **All Microservices**: Routes and forwards requests
- **Frontend Applications**: CORS-enabled access
- **IdentityAPI**: Token validation
- **Monitoring Systems**: Health checks and metrics
- **Logging Infrastructure**: Centralized logging

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [YARP Documentation](https://microsoft.github.io/reverse-proxy/)
- [All Individual Service READMEs](../)

## 🐛 Troubleshooting

### Gateway returns 502 Bad Gateway
- Check downstream service is running
- Verify service addresses in configuration
- Check network connectivity
- Review circuit breaker status

### Authentication fails at gateway
- Verify JWT key configuration
- Check token expiration
- Ensure issuer/audience match
- Review CORS settings

### Rate limiting too restrictive
- Adjust rate limit configuration
- Check if limits apply per IP or per user
- Review rate limit headers
- Consider whitelisting certain clients

### Requests timing out
- Check downstream service performance
- Adjust timeout configurations
- Review circuit breaker settings
- Check for network issues

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
