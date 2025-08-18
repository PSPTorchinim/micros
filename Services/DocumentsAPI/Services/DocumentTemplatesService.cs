using AutoMapper;
using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace DocumentsAPI.Services
{
    public interface IDocumentTemplatesService : IService
    {
        Task<IEnumerable<DocumentTemplate>> Get();
        Task<DocumentTemplate> Get(Guid id);
        Task<bool> Add(DocumentTemplate documentTemplate);
        Task<bool> Update(Guid guid, DocumentTemplate documentTemplate);
    }

    public class DocumentTemplatesService : BaseService<IDocumentTemplatesService>, IDocumentTemplatesService
    {
        private readonly DocumentTemplatesRepository _documentTemplatesRepository;
        public DocumentTemplatesService(ILogger<IDocumentTemplatesService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _documentTemplatesRepository = serviceProvider.GetRequiredService<DocumentTemplatesRepository>();
        }

        public async Task<bool> Add(DocumentTemplate documentTemplate)
        {
            return await _documentTemplatesRepository.Add(documentTemplate);
        }

        public async Task<IEnumerable<DocumentTemplate>> Get()
        {
            return await _documentTemplatesRepository.Get();
        }

        public Task<DocumentTemplate> Get(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(Guid guid, DocumentTemplate documentTemplate)
        {
            throw new NotImplementedException();
        }
    }
}
