using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Shared.Services.Cache;
using Shared.Services.App;
using AutoMapper;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Services
{
    public interface ISecurityStampService : IService
    {
        Task<SecurityStampCacheData?> GetUserSecurityDataAsync(Guid userId);
        Task InvalidateUserSecurityCacheAsync(Guid userId);
        string GenerateSecurityStamp();
    }

    public class SecurityStampService : BaseService<ISecurityStampService>, ISecurityStampService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly ICacheService _cacheService;
        private static readonly TimeSpan CacheDuration = TimeSpan.FromDays(7); // Long lifetime as specified

        public SecurityStampService(
            ILogger<ISecurityStampService> logger, 
            IMapper mapper, 
            IHttpContextAccessor httpContextAccessor, 
            RabbitMQProducerService rabbitMQProducerService, 
            IServiceProvider serviceProvider
        ) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<SecurityStampCacheData?> GetUserSecurityDataAsync(Guid userId)
        {
            _logger.LogInformation("🔍 [SecurityStampService] Fetching security data | UserId: {UserId}", userId);
            var cacheKey = GetCacheKey(userId);
            
            return await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogInformation("💾 [SecurityStampService] CACHE MISS - Loading from database | UserId: {UserId} | CacheKey: {CacheKey}", 
                        userId, cacheKey);
                    var user = (await _usersRepository.Get(u => u.Id == userId)).FirstOrDefault();
                    
                    if (user == null)
                    {
                        _logger.LogWarning("❌ [SecurityStampService] USER NOT FOUND | UserId: {UserId}", userId);
                        return null;
                    }

                    _logger.LogDebug("✓ [SecurityStampService] Security data loaded from database | UserId: {UserId} | SecurityStamp: {SecurityStamp} | LastPasswordChange: {LastPasswordChange}", 
                        userId, user.SecurityStamp, user.LastPasswordChangeDate?.ToString("yyyy-MM-dd HH:mm:ss") ?? "null");
                    
                    return new SecurityStampCacheData
                    {
                        UserId = user.Id,
                        SecurityStamp = user.SecurityStamp,
                        LastPasswordChangeDate = user.LastPasswordChangeDate
                    };
                },
                CacheDuration
            );
        }

        public async Task InvalidateUserSecurityCacheAsync(Guid userId)
        {
            _logger.LogInformation("🗑️ [SecurityStampService] Invalidating cache (forcing logout on all devices) | UserId: {UserId}", userId);
            var cacheKey = GetCacheKey(userId);
            await _cacheService.RemoveAsync(cacheKey);
            _logger.LogInformation("✓ [SecurityStampService] Cache invalidated successfully | UserId: {UserId} | CacheKey: {CacheKey} | Effect: User will be logged out on next request", 
                userId, cacheKey);
        }

        public string GenerateSecurityStamp()
        {
            var stamp = Guid.NewGuid().ToString("N");
            _logger.LogDebug("🔑 [SecurityStampService] Generated new security stamp | Stamp: {Stamp}", stamp);
            return stamp;
        }

        private static string GetCacheKey(Guid userId)
        {
            return $"user_security_{userId}";
        }
    }

    public class SecurityStampCacheData
    {
        public Guid UserId { get; set; }
        public string? SecurityStamp { get; set; }
        public DateTime? LastPasswordChangeDate { get; set; }
    }
}
