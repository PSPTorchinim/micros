using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Data.Specifications;
using Shared.Services.Cache;
using System.Linq.Expressions;

namespace Shared.Repositories
{
    /// <summary>
    /// Decorator that wraps any IRepository with Redis caching capabilities.
    /// All read operations use GetOrCreateAsync for automatic cache-aside pattern.
    /// All write operations invalidate the cache to maintain consistency.
    /// </summary>
    public class CachedRepository<T, C> : IRepository<T> where T : class where C : DbContext
    {
        private readonly IRepository<T> _innerRepository;
        private readonly ICacheService _cacheService;
        private readonly ILogger<CachedRepository<T, C>> _logger;
        private readonly string _entityName;
        private readonly TimeSpan _defaultExpiration = TimeSpan.FromMinutes(5);

        public CachedRepository(
            IRepository<T> innerRepository,
            ICacheService cacheService,
            ILogger<CachedRepository<T, C>> logger)
        {
            _innerRepository = innerRepository;
            _cacheService = cacheService;
            _logger = logger;
            _entityName = typeof(T).Name;
        }

        private string GetCacheKey(string operation, params object[] parameters)
        {
            var paramString = string.Join("_", parameters.Select(p => p?.ToString() ?? "null"));
            return $"{_entityName}_{operation}_{paramString}";
        }

        private string GetEntityCachePrefix()
        {
            return $"{_entityName}_";
        }

        #region Create
        public async Task<bool> Add(T entity)
        {
            var result = await _innerRepository.Add(entity);
            if (result)
            {
                await RefreshCacheAfterWriteAsync();
            }
            return result;
        }

        public async Task<bool> AddRange(List<T> entities)
        {
            var result = await _innerRepository.AddRange(entities);
            if (result)
            {
                await RefreshCacheAfterWriteAsync();
            }
            return result;
        }
        #endregion

        #region Count
        public async Task<int> Count(Expression<Func<T, bool>> expression)
        {
            return await _innerRepository.Count(expression);
        }

        public async Task<int> Count(ISpecification<T> specification)
        {
            return await _innerRepository.Count(specification);
        }
        #endregion

        #region Delete
        public async Task<bool> Delete(T entity)
        {
            var result = await _innerRepository.Delete(entity);
            if (result)
            {
                await RefreshCacheAfterWriteAsync();
            }
            return result;
        }

        public async Task<bool> DeleteRange(List<T> entities)
        {
            var result = await _innerRepository.DeleteRange(entities);
            if (result)
            {
                await RefreshCacheAfterWriteAsync();
            }
            return result;
        }
        #endregion

        #region Empty
        public async Task<bool> Empty()
        {
            return await _innerRepository.Empty();
        }
        #endregion

        #region Exists
        public async Task<bool> Exists(Expression<Func<T, bool>> expression)
        {
            return await _innerRepository.Exists(expression);
        }

        public async Task<bool> Exists(ISpecification<T> specification)
        {
            return await _innerRepository.Exists(specification);
        }
        #endregion

        #region Read
        public async Task<List<T>> Get()
        {
            var cacheKey = GetCacheKey("GetAll");
            return await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss for {EntityName} GetAll - fetching from database", _entityName);
                    return await _innerRepository.Get();
                },
                _defaultExpiration
            ) ?? new List<T>();
        }

        public async Task<List<T>> Get(Expression<Func<T, bool>> expression)
        {
            var cacheKey = GetCacheKey("GetByExpression", expression.ToString());
            return await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss for {EntityName} GetByExpression - fetching from database", _entityName);
                    return await _innerRepository.Get(expression);
                },
                _defaultExpiration
            ) ?? new List<T>();
        }

        public async Task<List<T>> Get(ISpecification<T> specification)
        {
            var cacheKey = GetCacheKey("GetBySpecification", specification.GetType().Name);
            return await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss for {EntityName} GetBySpecification - fetching from database", _entityName);
                    return await _innerRepository.Get(specification);
                },
                _defaultExpiration
            ) ?? new List<T>();
        }
        #endregion

        #region Update
        public async Task<bool> Update(T entity)
        {
            var result = await _innerRepository.Update(entity);
            if (result)
            {
                await RefreshCacheAfterWriteAsync();
            }
            return result;
        }

        public async Task<bool> UpdateRange(List<T> entities)
        {
            var result = await _innerRepository.UpdateRange(entities);
            if (result)
            {
                await RefreshCacheAfterWriteAsync();
            }
            return result;
        }
        #endregion

        /// <summary>
        /// Invalidates the cache after write operations.
        /// Uses lazy loading pattern - cache is refreshed on next read, not eagerly.
        /// This avoids unnecessary database queries after write operations.
        /// </summary>
        private async Task RefreshCacheAfterWriteAsync()
        {
            try
            {
                // Invalidate all cached data for this entity
                // The cache will be refreshed lazily on the next read operation
                await _cacheService.RemoveByPrefixAsync(GetEntityCachePrefix());
                _logger.LogInformation("Cache invalidated for {EntityName}. Will be refreshed on next read.", _entityName);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Error invalidating cache for {EntityName}", _entityName);
            }
        }
    }
}
