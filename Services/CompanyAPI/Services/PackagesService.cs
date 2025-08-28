using AutoMapper;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace CompanyAPI.Services
{
    public interface IPackagesService : IService
    {

    }

    public class PackagesService : BaseService<IPackagesService>, IPackagesService
    {
        public PackagesService(ILogger<IPackagesService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
        }
    }
}