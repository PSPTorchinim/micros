using Microsoft.Extensions.Logging;
using Shared.Helpers;

namespace Shared.Services.Cache
{
    /// <summary>
    /// No-operation cache service for DevelopmentLocal environment.
    /// All operations return immediately without caching, allowing development without Redis.
    /// </summary>
    public class NoOpCacheService : ICacheService
    {
        private readonly ILogger<NoOpCacheService> _logger;

        public NoOpCacheService(ILogger<NoOpCacheService> logger)
        {
            _logger = logger;
            _logger.LogInformation("Using NoOpCacheService - all cache operations will be no-ops (DevelopmentLocal mode)");
        }

        public Task<T?> GetAsync<T>(string key) where T : class
        {
            _logger.LogDebug("NoOpCache: GetAsync called for key {Key} - returning null", StringHelper.SanitizeForLog(key));
            return Task.FromResult<T?>(null);
        }

        public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class
        {
            _logger.LogDebug("NoOpCache: SetAsync called for key {Key} - not caching", StringHelper.SanitizeForLog(key));
            return Task.CompletedTask;
        }

        public async Task<T?> GetOrCreateAsync<T>(string key, Func<Task<T?>> factory, TimeSpan? expiration = null) where T : class
        {
            _logger.LogDebug("NoOpCache: GetOrCreateAsync called for key {Key} - calling factory without caching", StringHelper.SanitizeForLog(key));
            // Always call the factory and return the value without caching
            return await factory();
        }

        public Task RemoveAsync(string key)
        {
            _logger.LogDebug("NoOpCache: RemoveAsync called for key {Key} - no-op", StringHelper.SanitizeForLog(key));
            return Task.CompletedTask;
        }

        public Task RemoveByPrefixAsync(string prefix)
        {
            _logger.LogDebug("NoOpCache: RemoveByPrefixAsync called for prefix {Prefix} - no-op", StringHelper.SanitizeForLog(prefix));
            return Task.CompletedTask;
        }

        public Task<bool> ExistsAsync(string key)
        {
            _logger.LogDebug("NoOpCache: ExistsAsync called for key {Key} - returning false", StringHelper.SanitizeForLog(key));
            return Task.FromResult(false);
        }
    }
}
