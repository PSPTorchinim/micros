using AutoMapper;
using CompanyAPI.Repositories;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace CompanyAPI.Services
{
    public class ElementsService : BaseService<IElementsService>, IElementsService
    {

        private readonly IElementsRepository elementsRepository;

        public ElementsService(ILogger<IElementsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            elementsRepository = serviceProvider.GetRequiredService<IElementsRepository>();
        }
    }

    public interface IElementsService : IService
    {
    }
}
