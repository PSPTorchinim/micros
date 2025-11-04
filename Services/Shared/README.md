# Shared - Common Libraries & Utilities

The Shared project contains reusable components, services, and utilities used across all microservices in the DJ Beat Blaster platform.

## 📋 Overview

The Shared library provides:

- Common database configuration and setup
- Authentication and security middleware
- API key validation services
- Redis caching configuration
- RabbitMQ messaging services
- Health check implementations
- CORS configuration
- Swagger/OpenAPI setup
- Logging configuration
- Extension methods and helpers

## 🏗️ Technology Stack

- **Framework**: .NET 9 Class Library
- **Databases**: Entity Framework Core, MongoDB.Driver
- **Caching**: StackExchange.Redis
- **Messaging**: RabbitMQ.Client
- **Logging**: Serilog
- **Documentation**: Swashbuckle (Swagger)

## 📁 Project Structure

```
Shared/
├── Services/
│   ├── App/              # Application setup services
│   ├── Authentication/   # JWT authentication services
│   ├── Cache/           # Redis caching services
│   ├── Database/        # Database configuration
│   ├── Messaging/       # RabbitMQ services
│   ├── Run/             # Application runtime services
│   └── Security/        # Security middleware
├── Models/              # Shared data models
├── Extensions/          # Extension methods
├── Middleware/          # Custom middleware
└── Shared.csproj       # Project file
```

## 🔧 Core Services

### Application Setup (`BuildBasicServices`)

Central service configuration used by all microservices:

```csharp
builder.Services.BuildBasicServices(
    builder.Configuration,
    serviceName: "ServiceName",
    version: "v1.0.0"
);
```

**Configures**:
- Controllers and JSON serialization
- CORS policies
- Authentication and authorization
- Swagger/OpenAPI documentation
- Health checks
- Logging with Serilog
- HTTP client factory

### Database Configuration

#### SQL Server Setup

```csharp
builder.Services.BuildScope<Program, SeedData, ServiceScope>(
    UseDatabase.ConfigureSqlServer<ServiceContext>
);
```

**Features**:
- Connection string management
- Entity Framework Core configuration
- Migration management
- Connection pooling
- Retry policies

#### MongoDB Setup

```csharp
builder.Services.BuildScope<Program, SeedData, ServiceScope>(
    UseDatabase.ConfigureMongoDB
);
```

**Features**:
- MongoDB client configuration
- Database and collection setup
- Index management
- Connection string handling

### Authentication Services

JWT Bearer token authentication configuration:

```csharp
services.AddJwtAuthentication(configuration);
```

**Provides**:
- JWT token validation
- Bearer token configuration
- Claims processing
- Role-based authorization
- Token expiration handling

### Security Middleware

API key validation for service-to-service communication:

```csharp
app.UseSecureKeyMiddleware();
```

**Features**:
- API key validation
- Request authentication
- Service identity verification
- Secure endpoint protection

### Caching Services

Redis caching configuration:

```csharp
services.AddRedisCaching(configuration);
```

**Capabilities**:
- Connection management
- Cache key generation
- Serialization/deserialization
- Expiration policies
- Distributed caching

**Usage Example**:
```csharp
public class SomeService
{
    private readonly IDistributedCache _cache;

    public async Task<T> GetCachedDataAsync<T>(string key)
    {
        var cached = await _cache.GetStringAsync(key);
        if (cached != null)
        {
            return JsonSerializer.Deserialize<T>(cached);
        }
        
        // Fetch from database...
        var data = await FetchFromDatabaseAsync();
        
        await _cache.SetStringAsync(
            key,
            JsonSerializer.Serialize(data),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            }
        );
        
        return data;
    }
}
```

### Messaging Services

RabbitMQ producer and consumer services:

```csharp
services.AddRabbitMQ(configuration);
```

**Producer Usage**:
```csharp
public class EventPublisher
{
    private readonly IMessageProducer _producer;

    public async Task PublishEventAsync<T>(string queueName, T message)
    {
        await _producer.PublishAsync(queueName, message);
    }
}
```

**Consumer Usage**:
```csharp
public class EventConsumer : BackgroundService
{
    private readonly IMessageConsumer _consumer;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _consumer.ConsumeAsync<EventMessage>(
            "event-queue",
            async (message) =>
            {
                // Process message
                await HandleEventAsync(message);
            },
            stoppingToken
        );
    }
}
```

### Health Checks

Comprehensive health check implementation:

```csharp
services.AddHealthChecks()
    .AddSqlServer(connectionString, name: "sql-server")
    .AddMongoDb(mongoConnectionString, name: "mongodb")
    .AddRedis(redisConnectionString, name: "redis")
    .AddRabbitMQ(rabbitMQConnectionString, name: "rabbitmq");
```

**Endpoints**:
- `/healthz/live` - Liveness probe (service is running)
- `/healthz/ready` - Readiness probe (service can accept traffic)
- `/health` - Detailed health status

### CORS Configuration

Centralized CORS policy setup:

```csharp
services.AddCorsPolicy(configuration);
```

**Configures**:
- Allowed origins
- Allowed methods
- Allowed headers
- Credentials support
- Preflight caching

### Swagger/OpenAPI Setup

Standardized API documentation:

```csharp
services.AddSwaggerDocumentation(serviceName, version);
```

**Features**:
- OpenAPI 3.0 specification
- JWT authentication support
- XML documentation comments
- Request/response examples
- Schema descriptions

## 🔒 Security Features

### JWT Authentication

Shared JWT configuration ensures consistency:

```csharp
public class JwtSettings
{
    public string Key { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpiryHours { get; set; } = 1;
    public int RefreshTokenExpiryDays { get; set; } = 7;
}
```

### API Key Middleware

Validates API keys for protected endpoints:

```csharp
[ApiKeyAuthorize]
public class SecureController : ControllerBase
{
    // Protected endpoints
}
```

### Security Headers

Automatically adds security headers to responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

## 📊 Logging Configuration

Serilog configuration with multiple sinks:

```csharp
builder.Host.UseSerilog((context, services, configuration) => 
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("ServiceName", serviceName)
        .WriteTo.Console()
        .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
        .WriteTo.Grafana() // Loki integration
);
```

**Features**:
- Structured logging
- Request/response logging
- Performance logging
- Error tracking
- Contextual enrichment

## 🛠️ Extension Methods

### String Extensions

```csharp
string.IsNullOrEmpty()
string.ToKebabCase()
string.ToPascalCase()
string.ToCamelCase()
```

### Date Extensions

```csharp
DateTime.IsWeekend()
DateTime.ToUnixTimestamp()
DateTime.FromUnixTimestamp()
```

### Collection Extensions

```csharp
IEnumerable<T>.IsNullOrEmpty()
IEnumerable<T>.ForEach(action)
List<T>.AddRange(params T[] items)
```

## 🔧 Configuration Models

### Database Settings

```csharp
public class DatabaseSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
    public int MaxPoolSize { get; set; } = 100;
    public int ConnectionTimeout { get; set; } = 30;
}
```

### Redis Settings

```csharp
public class RedisSettings
{
    public string ConnectionString { get; set; }
    public int DefaultExpirationMinutes { get; set; } = 10;
    public bool AbortOnConnectFail { get; set; } = false;
}
```

### RabbitMQ Settings

```csharp
public class RabbitMQSettings
{
    public string HostName { get; set; }
    public int Port { get; set; } = 5672;
    public string UserName { get; set; }
    public string Password { get; set; }
    public string VirtualHost { get; set; } = "/";
}
```

## 🧪 Testing

The Shared library includes test utilities:

### Mock Services

```csharp
public class MockCacheService : IDistributedCache
{
    private readonly Dictionary<string, byte[]> _cache = new();
    
    public Task SetAsync(string key, byte[] value, 
        DistributedCacheEntryOptions options, 
        CancellationToken token = default)
    {
        _cache[key] = value;
        return Task.CompletedTask;
    }
    
    // ... other implementations
}
```

### Test Fixtures

```csharp
public class DatabaseFixture : IDisposable
{
    public DbContextOptions<TestContext> ContextOptions { get; }
    
    public DatabaseFixture()
    {
        ContextOptions = new DbContextOptionsBuilder<TestContext>()
            .UseInMemoryDatabase("TestDatabase")
            .Options;
    }
    
    public void Dispose()
    {
        // Cleanup
    }
}
```

## 📦 NuGet Dependencies

Key dependencies used in Shared:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.0" />
<PackageReference Include="MongoDB.Driver" Version="2.25.0" />
<PackageReference Include="StackExchange.Redis" Version="2.7.0" />
<PackageReference Include="RabbitMQ.Client" Version="6.8.0" />
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
```

## 🚀 Usage in Microservices

### Typical Program.cs Setup

```csharp
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);

// Use Serilog
builder.Host.UseSerilog();

// Build basic services (controllers, swagger, auth, etc.)
builder.Services.BuildBasicServices(
    builder.Configuration,
    "ServiceName",
    "v1.0.0"
);

// Configure database
builder.Services.BuildScope<Program, SeedData, ServiceScope>(
    UseDatabase.ConfigureSqlServer<ServiceContext>
);

var app = builder.Build();

// Build basic app (middleware pipeline)
app.BuildBasicApp();

// Build services app (database migration, seeding)
await app.BuildServicesAppAsync<SeedData>(
    UseDatabase.UseSQLServerAsync<ServiceContext, Program>
);

app.Run();
Log.CloseAndFlush();
```

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [Individual Service READMEs](../)

## 🐛 Troubleshooting

### Redis connection fails
- Verify Redis is running
- Check connection string
- Review firewall settings
- Check Redis configuration

### RabbitMQ connection issues
- Verify RabbitMQ service is running
- Check credentials
- Verify virtual host exists
- Review network connectivity

### Database migrations fail
- Check connection string
- Verify database exists
- Check permissions
- Review migration files

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
