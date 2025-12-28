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
            _logger.LogInformation("Getting security data for user: {UserId}", userId);
            var cacheKey = GetCacheKey(userId);
            
            return await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss - fetching security data from database for user: {UserId}", userId);
                    var user = (await _usersRepository.Get(u => u.Id == userId)).FirstOrDefault();
                    
                    if (user == null)
                    {
                        _logger.LogWarning("User not found: {UserId}", userId);
                        return null;
                    }

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
            _logger.LogInformation("Invalidating security cache for user: {UserId}", userId);
            var cacheKey = GetCacheKey(userId);
            await _cacheService.RemoveAsync(cacheKey);
            _logger.LogDebug("Security cache invalidated for user: {UserId}", userId);
        }

        public string GenerateSecurityStamp()
        {
            // Generate a security stamp using GUID in 'N' format (32 hex digits without dashes)
            // This provides a compact, URL-safe identifier for security validation
            return Guid.NewGuid().ToString("N");
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
