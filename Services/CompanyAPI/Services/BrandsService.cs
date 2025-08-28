using AutoMapper;
using CompanyAPI.Data.Models;
using CompanyAPI.Entities;
using CompanyAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Services.App;
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
        public BrandsService(ILogger<IBrandsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            brandsRepository = serviceProvider.GetRequiredService<IBrandsRepository>();
        }

        public async Task<List<Brand>> Get()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return await brandsRepository.Get();
            }, _logger);
        }

        public async Task<bool> RegisterBrand(RegisterBrandDTO register)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return false;
            }, _logger);
        }
    }
}