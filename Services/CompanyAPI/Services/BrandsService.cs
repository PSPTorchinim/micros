using AutoMapper;
using CompanyAPI.Data.Models;
using CompanyAPI.Entities;
using CompanyAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Services.App;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace CompanyAPI.Services
{
    public interface IBrandsService : IService
    {
        Task<List<Brand>> Get();
        Task<bool> RegisterBrand(RegisterBrandDTO register);
    }

    public class BrandsService : BaseService<IBrandsService>, IBrandsService
    {
        private readonly IBrandsRepository brandsRepository;
        private readonly ICacheService _cacheService;
        
        private const string BrandsCachePrefix = "Brands_";
        private static readonly TimeSpan DefaultCacheExpiration = TimeSpan.FromMinutes(5);
        
        public BrandsService(ILogger<IBrandsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            brandsRepository = serviceProvider.GetRequiredService<IBrandsRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<List<Brand>> Get()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{BrandsCachePrefix}All";
                
                // Use GetOrCreateAsync to simplify cache-aside pattern
                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for brands. Fetching from database.");
                        return await brandsRepository.Get();
                    },
                    DefaultCacheExpiration
                );
                
                return result ?? new List<Brand>();
            }, _logger);
        }

        public async Task<bool> RegisterBrand(RegisterBrandDTO register)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                // TODO: Implement brand registration
                // When implemented, invalidate cache:
                // await _cacheService.RemoveAsync($"{BrandsCachePrefix}All");
                return false;
            }, _logger);
        }
    }
}