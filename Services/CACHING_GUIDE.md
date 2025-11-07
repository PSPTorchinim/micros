# Caching Implementation Guide

This document explains how to use the caching features implemented in the microservices.

## Overview

The caching implementation provides:
1. **Redis-backed distributed caching** between microservices and database
2. **Response caching** between frontend and microservices (API Gateway)
3. **Automatic cache invalidation** when entities are updated
4. **Cache key management** utilities

## Components

### 1. ICacheService
Located in `Shared/Services/Cache/ICacheService.cs`, this interface provides methods for:
- `GetAsync<T>`: Retrieve cached data
- `SetAsync<T>`: Store data in cache with optional expiration
- `RemoveAsync`: Remove specific cache entry
- `RemoveByPrefixAsync`: Invalidate all cache entries with a prefix
- `ExistsAsync`: Check if a cache key exists

### 2. RedisCacheService
Implementation of ICacheService using Redis. Automatically registered in dependency injection.

### 3. CachedRepository
Decorator for the repository pattern that adds caching to database operations.
Located in `Shared/Repositories/CachedRepository.cs`.

### 4. Response Caching
HTTP response caching configured with predefined cache profiles.

## Usage

### Using ICacheService in Services

```csharp
public class MyService : BaseService<IMyService>, IMyService
{
    private readonly ICacheService _cacheService;
    
    public MyService(
        ILogger<IMyService> logger, 
        IMapper mapper, 
        IHttpContextAccessor httpContextAccessor,
        RabbitMQProducerService rabbitMQProducerService,
        IServiceProvider serviceProvider) 
        : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
    {
        _cacheService = serviceProvider.GetRequiredService<ICacheService>();
    }
    
    public async Task<MyDto> GetDataAsync(string id)
    {
        var cacheKey = $"MyEntity_{id}";
        
        // Try to get from cache
        var cached = await _cacheService.GetAsync<MyDto>(cacheKey);
        if (cached != null)
        {
            return cached;
        }
        
        // If not in cache, get from database
        var data = await FetchFromDatabase(id);
        
        // Store in cache for 5 minutes
        await _cacheService.SetAsync(cacheKey, data, TimeSpan.FromMinutes(5));
        
        return data;
    }
    
    public async Task UpdateDataAsync(MyDto dto)
    {
        await UpdateInDatabase(dto);
        
        // Invalidate cache
        await _cacheService.RemoveAsync($"MyEntity_{dto.Id}");
        // Or invalidate all related caches
        await _cacheService.RemoveByPrefixAsync("MyEntity_");
    }
}
```

### Using Response Caching on Controllers

Add the `[ResponseCache]` attribute to controller actions:

```csharp
[HttpGet("{id}")]
[ResponseCache(CacheProfileName = CacheProfiles.Medium)] // 5 minutes
public async Task<IActionResult> GetById(string id)
{
    var result = await _service.GetDataAsync(id);
    return Ok(new Response<MyDto>(result));
}

[HttpGet]
[ResponseCache(CacheProfileName = CacheProfiles.Short)] // 30 seconds
public async Task<IActionResult> GetAll()
{
    var result = await _service.GetAllAsync();
    return Ok(new Response<List<MyDto>>(result));
}

[HttpPut]
[ResponseCache(CacheProfileName = CacheProfiles.NoCache)] // No caching for mutations
public async Task<IActionResult> Update(MyDto dto)
{
    await _service.UpdateDataAsync(dto);
    return Ok(new Response<bool>(true));
}
```

### Available Cache Profiles

- `CacheProfiles.Short` - 30 seconds
- `CacheProfiles.Default` - 1 minute
- `CacheProfiles.Medium` - 5 minutes
- `CacheProfiles.Long` - 15 minutes
- `CacheProfiles.NoCache` - No caching

### Using Cached Repository (Optional)

If you want automatic repository-level caching, you can use the `CachedRepository` decorator:

```csharp
// In your Scope configuration
services.AddScoped<IMyRepository>(provider =>
{
    var context = provider.GetRequiredService<MyContext>();
    var logger = provider.GetRequiredService<ILogger<IRepository<MyEntity>>>();
    var baseRepository = new Repository<MyEntity, MyContext>(context, logger);
    
    var cacheService = provider.GetRequiredService<ICacheService>();
    var cacheLogger = provider.GetRequiredService<ILogger<CachedRepository<MyEntity, MyContext>>>();
    
    return new CachedRepository<MyEntity, MyContext>(baseRepository, cacheService, cacheLogger);
});
```

This will automatically:
- Cache all Get operations
- Invalidate cache on Add, Update, Delete operations
- Use consistent cache keys based on entity type

## Cache Invalidation Strategy

The implementation uses automatic cache invalidation:

1. **Write operations** (Add, Update, Delete) automatically invalidate related cache entries
2. **Prefix-based invalidation** allows clearing all cache entries for an entity type
3. **TTL-based expiration** ensures stale data doesn't persist (default 5 minutes)

## Configuration

Redis connection is configured via environment variables:
- `ASPNETCORE_REDIS_HOST` - Redis host (default: localhost)
- `ASPNETCORE_REDIS_PORT` - Redis port (default: 6379)
- `ASPNETCORE_REDIS_PASSWORD` - Redis password

Each microservice gets its own Redis instance prefix to avoid key collisions.

## Best Practices

1. **Use appropriate cache durations**: Frequently changing data should have shorter TTL
2. **Invalidate on writes**: Always invalidate cache when data is modified
3. **Use cache profiles**: Leverage predefined profiles for consistency
4. **Monitor cache hit rates**: Track cache effectiveness in production
5. **Handle cache failures gracefully**: The service should work even if Redis is unavailable

## Testing

When testing services with caching:
1. Mock `ICacheService` to control cache behavior
2. Test both cache hit and cache miss scenarios
3. Verify cache invalidation on write operations
4. Test cache expiration behavior

## Monitoring

Cache operations are logged with the following information:
- Cache hits/misses
- Cache invalidations
- Error conditions

Monitor these logs in Grafana/Loki to optimize cache configuration.
