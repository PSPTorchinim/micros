using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shared.Services.Cache;

namespace Shared.Repositories
{
    /// <summary>
    /// Extension methods for registering repositories with Redis caching support.
    /// </summary>
    public static class CachedRepositoryExtensions
    {
        /// <summary>
        /// Registers a repository interface with its implementation, wrapped with CachedRepository for automatic Redis caching.
        /// All database read operations will be cached, and write operations will automatically refresh the cache.
        /// </summary>
        /// <typeparam name="TInterface">The repository interface type (e.g., IRolesRepository)</typeparam>
        /// <typeparam name="TImplementation">The repository implementation type (e.g., RolesRepository)</typeparam>
        /// <typeparam name="TEntity">The entity type (e.g., Role)</typeparam>
        /// <typeparam name="TContext">The DbContext type (e.g., IdentityContext)</typeparam>
        /// <param name="services">The service collection</param>
        /// <returns>The service collection for chaining</returns>
        public static IServiceCollection AddCachedRepository<TInterface, TImplementation, TEntity, TContext>(
            this IServiceCollection services)
            where TInterface : class, IRepository<TEntity>
            where TImplementation : class, TInterface
            where TEntity : class
            where TContext : DbContext
        {
            // Register the base repository implementation
            services.AddScoped<TImplementation>();
            
            // Register the interface with CachedRepository decorator
            services.AddScoped<TInterface>(provider =>
            {
                var innerRepository = provider.GetRequiredService<TImplementation>();
                var cacheService = provider.GetRequiredService<ICacheService>();
                var logger = provider.GetRequiredService<ILogger<CachedRepository<TEntity, TContext>>>();
                
                return (TInterface)(object)new CachedRepository<TEntity, TContext>(
                    innerRepository,
                    cacheService,
                    logger);
            });
            
            return services;
        }

        /// <summary>
        /// Registers a repository with caching support using the generic IRepository interface.
        /// Use this when you don't need a custom repository interface.
        /// </summary>
        /// <typeparam name="TEntity">The entity type</typeparam>
        /// <typeparam name="TContext">The DbContext type</typeparam>
        /// <param name="services">The service collection</param>
        /// <returns>The service collection for chaining</returns>
        public static IServiceCollection AddCachedRepository<TEntity, TContext>(
            this IServiceCollection services)
            where TEntity : class
            where TContext : DbContext
        {
            // Register the base repository
            services.AddScoped<Repository<TEntity, TContext>>();
            
            // Register IRepository<TEntity> with CachedRepository decorator
            services.AddScoped<IRepository<TEntity>>(provider =>
            {
                var context = provider.GetRequiredService<TContext>();
                var repositoryLogger = provider.GetRequiredService<ILogger<IRepository<TEntity>>>();
                var innerRepository = new Repository<TEntity, TContext>(context, repositoryLogger);
                
                var cacheService = provider.GetRequiredService<ICacheService>();
                var cachedLogger = provider.GetRequiredService<ILogger<CachedRepository<TEntity, TContext>>>();
                
                return new CachedRepository<TEntity, TContext>(
                    innerRepository,
                    cacheService,
                    cachedLogger);
            });
            
            return services;
        }
    }
}
