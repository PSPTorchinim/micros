using AutoMapper;
using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace DocumentsAPI.Services
{
    public interface IDocumentsService : IService
    {
        Task<List<Document>> Get();
    }

    public class DocumentsService : BaseService<IDocumentsService>, IDocumentsService
    {
        private readonly DocumentsRepository _documentsRepository;
        public DocumentsService(ILogger<IDocumentsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _documentsRepository = serviceProvider.GetRequiredService<DocumentsRepository>();
        }

        public Task<List<Document>> Get()
        {
            return null;
        }
    }
}
