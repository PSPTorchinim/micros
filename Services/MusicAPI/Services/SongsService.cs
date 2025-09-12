using AutoMapper;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace Music.Services
{
    public interface ISongsService : IService
    {
    }

    public class SongsService : BaseService<ISongsService>, ISongsService
    {
        public SongsService(ILogger<ISongsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
        }
    }
}
