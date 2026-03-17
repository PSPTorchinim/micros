using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Shared.Helpers;
using StackExchange.Redis;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Shared.Services.Cache
{
    public class RedisCacheService : ICacheService
    {
        private readonly IDistributedCache _distributedCache;
        private readonly IConnectionMultiplexer? _connectionMultiplexer;
        private readonly ILogger<RedisCacheService> _logger;
        private readonly string _instanceName;

        // Lock dictionary to prevent cache stampede (multiple concurrent requests for same key)
        private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        public RedisCacheService(
            IDistributedCache distributedCache,
            ILogger<RedisCacheService> logger,
            IConnectionMultiplexer? connectionMultiplexer = null,
            string instanceName = "")
        {
            _distributedCache = distributedCache;
            _connectionMultiplexer = connectionMultiplexer;
            _logger = logger;
            _instanceName = instanceName;
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            var cached = await _distributedCache.GetStringAsync(key);
            if (string.IsNullOrEmpty(cached))
            {
                return null;
            }

            return JsonSerializer.Deserialize<T>(cached, _jsonOptions);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
        {
            var serialized = JsonSerializer.Serialize(value, _jsonOptions);
            var options = new DistributedCacheEntryOptions
            {
                // Default expiration of 5 minutes if not specified
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(5)
            };

            await _distributedCache.SetStringAsync(key, serialized, options);
        }

        public async Task<T?> GetOrCreateAsync<T>(string key, Func<Task<T?>> factory, TimeSpan? expiration = null) where T : class
        {
            // Try to get from cache first (without lock)
            var cached = await GetAsync<T>(key);
            if (cached != null)
            {
                _logger.LogDebug("Cache hit for key: {Key}", StringHelper.SanitizeForLog(key));
                return cached;
            }

            // Get or create a lock for this specific key to prevent cache stampede
            var keyLock = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));

            await keyLock.WaitAsync();
            try
            {
                // Double-check after acquiring lock (another thread might have populated the cache)
                cached = await GetAsync<T>(key);
                if (cached != null)
                {
                    _logger.LogDebug("Cache hit for key (after lock): {Key}", StringHelper.SanitizeForLog(key));
                    return cached;
                }

                // Cache miss - get from factory (database)
                _logger.LogDebug("Cache miss for key: {Key}. Fetching from source.", StringHelper.SanitizeForLog(key));
                var value = await factory();

                // Don't cache null values - they could represent "not found" scenarios
                // that should be retried on subsequent requests
                if (value != null)
                {
                    await SetAsync(key, value, expiration);
                    _logger.LogDebug("Cached value for key: {Key}", StringHelper.SanitizeForLog(key));
                }
                else
                {
                    _logger.LogDebug("Factory returned null for key: {Key}. Not caching.", StringHelper.SanitizeForLog(key));
                }

                return value;
            }
            finally
            {
                keyLock.Release();
                // Note: Lock cleanup removed to avoid race condition.
                // SemaphoreSlim instances are small and the dictionary will reach
                // a steady state based on active cache keys.
            }
        }

        public async Task RemoveAsync(string key)
        {
            await _distributedCache.RemoveAsync(key);
        }

        public async Task RemoveByPrefixAsync(string prefix)
        {
            if (_connectionMultiplexer != null)
            {
                try
                {
                    var db = _connectionMultiplexer.GetDatabase();
                    var endpoints = _connectionMultiplexer.GetEndPoints();
                    var server = _connectionMultiplexer.GetServer(endpoints.First());

                    var pattern = $"{_instanceName}{prefix}*";

                    // Use SCAN instead of KEYS for better performance in production
                    // SCAN doesn't block the server like KEYS does
                    var keys = new List<RedisKey>();
                    await foreach (var key in server.KeysAsync(pattern: pattern))
                    {
                        keys.Add(key);
                    }

                    if (keys.Count > 0)
                    {
                        await db.KeyDeleteAsync(keys.ToArray());
                        _logger.LogInformation("Deleted {Count} cache keys with prefix {Prefix}", keys.Count, prefix);
                    }
                }
                catch (RedisException ex)
                {
                    _logger.LogError(ex, "Redis error removing cache keys by prefix {Prefix}", prefix);
                }
            }
            else
            {
                _logger.LogWarning("RemoveByPrefixAsync called but Redis connection multiplexer not available");
            }
        }

        public async Task<bool> ExistsAsync(string key)
        {
            var value = await _distributedCache.GetStringAsync(key);
            return !string.IsNullOrEmpty(value);
        }
    }
}
