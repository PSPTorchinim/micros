using AutoMapper;
using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using Shared.Services.App;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace DocumentsAPI.Services
{
    public interface IDocumentTemplatesService : IService
    {
        Task<IEnumerable<DocumentTemplate>> Get();
        Task<DocumentTemplate?> Get(Guid id);
        Task<bool> Add(DocumentTemplate documentTemplate);
        Task<bool> Update(Guid guid, DocumentTemplate documentTemplate);
    }

    public class DocumentTemplatesService : BaseService<IDocumentTemplatesService>, IDocumentTemplatesService
    {
        private readonly IDocumentTemplatesRepository _documentTemplatesRepository;
        private readonly ICacheService _cacheService;
        
        private const string TemplatesCachePrefix = "DocumentTemplates_";
        private static readonly TimeSpan DefaultCacheExpiration = TimeSpan.FromMinutes(5);
        
        public DocumentTemplatesService(ILogger<IDocumentTemplatesService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _documentTemplatesRepository = serviceProvider.GetRequiredService<IDocumentTemplatesRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<bool> Add(DocumentTemplate documentTemplate)
        {
            var result = await _documentTemplatesRepository.Add(documentTemplate);
            
            if (result)
            {
                // Invalidate cache for lazy loading on next read
                await _cacheService.RemoveAsync($"{TemplatesCachePrefix}All");
                _logger.LogInformation("DocumentTemplate added and cache invalidated");
            }
            
            return result;
        }

        public async Task<IEnumerable<DocumentTemplate>> Get()
        {
            var cacheKey = $"{TemplatesCachePrefix}All";
            
            // Use GetOrCreateAsync to simplify cache-aside pattern
            var result = await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss for document templates. Fetching from database.");
                    var templates = await _documentTemplatesRepository.Get();
                    return templates?.ToList();
                },
                DefaultCacheExpiration
            );
            
            return result ?? new List<DocumentTemplate>();
        }

        public async Task<DocumentTemplate?> Get(Guid id)
        {
            var cacheKey = $"{TemplatesCachePrefix}{id}";
            
            // Use GetOrCreateAsync - returns null if not found (not cached)
            var result = await _cacheService.GetOrCreateAsync(
                cacheKey,
                async () =>
                {
                    _logger.LogDebug("Cache miss for document template id: {Id}. Fetching from database.", id);
                    var templates = await _documentTemplatesRepository.Get(t => t.Id.Equals(id));
                    var template = templates?.FirstOrDefault();
                    if (template == null)
                    {
                        _logger.LogWarning("DocumentTemplate with id {Id} not found.", id);
                    }
                    return template;
                },
                DefaultCacheExpiration
            );
            
            return result;
        }

        public Task<bool> Update(Guid guid, DocumentTemplate documentTemplate)
        {
            // TODO: Implement when Update is added to IMongoDBRepository
            // When implemented, update cache:
            // await _cacheService.SetAsync($"{TemplatesCachePrefix}{guid}", documentTemplate, DefaultCacheExpiration);
            // await _cacheService.RemoveAsync($"{TemplatesCachePrefix}All");
            throw new NotImplementedException();
        }
    }
}
