using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace Shared.Services.App
{
    public class BaseService<TService> where TService : IService
    {
        public readonly ILogger<TService> _logger;
        public readonly IMapper _mapper;
        public readonly IHttpContextAccessor _httpContextAccessor;
        public readonly RabbitMQProducerService _rabbitMQProducerService;
        public readonly IServiceProvider _serviceProvider;

        public BaseService(ILogger<TService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _rabbitMQProducerService = rabbitMQProducerService;
            _serviceProvider = serviceProvider;
        }

        public string? GetClaim(string type)
        {
            return _httpContextAccessor?.HttpContext?.User?.Claims?.FirstOrDefault(x => x.Type.Equals(type))?.Value;
        }

        public string? GetTokenAsync()
        {
            var authorizationHeader = _httpContextAccessor.HttpContext?.Request.Headers.Authorization;

            var bearerToken = authorizationHeader?.SingleOrDefault()?.Replace("bearer ", "", StringComparison.InvariantCultureIgnoreCase);

            if (string.IsNullOrWhiteSpace(bearerToken))
            {
                throw new ArgumentException(nameof(_httpContextAccessor), "HttpContextAccessor resulted in no Access Token");
            }

            return bearerToken;
        }
    }
}
