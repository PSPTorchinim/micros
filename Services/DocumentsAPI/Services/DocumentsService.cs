using AutoMapper;
using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using Shared.Services.App;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace DocumentsAPI.Services
{
    public interface IDocumentsService : IService
    {
        Task<List<Document>?> Get();
    }

    public class DocumentsService : BaseService<IDocumentsService>, IDocumentsService
    {
        private readonly IDocumentsRepository _documentsRepository;
        private readonly ICacheService _cacheService;
        
        private const string DocumentsCachePrefix = "Documents_";
        private static readonly TimeSpan DefaultCacheExpiration = TimeSpan.FromMinutes(5);
        
        public DocumentsService(ILogger<IDocumentsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _documentsRepository = serviceProvider.GetRequiredService<IDocumentsRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<List<Document>?> Get()
        {
            var cacheKey = $"{DocumentsCachePrefix}All";
            
            // Use GetOrCreateAsync to simplify cache-aside pattern
            var result = await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss for documents. Fetching from database.");
                    var documents = await _documentsRepository.Get();
                    return documents?.ToList();
                },
                DefaultCacheExpiration
            );
            
            return result;
        }
    }
}
