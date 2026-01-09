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
    public interface ICompanyService : IService
    {
        Task<CompanyDTO?> GetCompany();
        Task<bool> UpdateCompany(UpdateCompanyDTO updateDto);
        Task<List<CompanyUserDTO>> GetCompanyUsers();
        Task<bool> AddCompanyUser(AddCompanyUserDTO addUserDto);
        Task<bool> RemoveCompanyUser(Guid userId);
        Task<List<CompanyStructureNodeDTO>> GetCompanyStructure();
        Task<bool> UpdateCompanyStructure(UpdateCompanyStructureDTO structureDto);
    }

    public class CompanyService : BaseService<ICompanyService>, ICompanyService
    {
        private readonly IBrandsRepository brandsRepository;
        private readonly IBrandUsersRepository brandUsersRepository;
        private readonly ICacheService _cacheService;
        
        private const string CompanyCachePrefix = "Company_";
        private static readonly TimeSpan DefaultCacheExpiration = TimeSpan.FromMinutes(5);
        
        public CompanyService(
            ILogger<ICompanyService> logger, 
            IMapper mapper, 
            IHttpContextAccessor httpContextAccessor, 
            RabbitMQProducerService rabbitMQProducerService, 
            IServiceProvider serviceProvider) 
            : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            brandsRepository = serviceProvider.GetRequiredService<IBrandsRepository>();
            brandUsersRepository = serviceProvider.GetRequiredService<IBrandUsersRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<CompanyDTO?> GetCompany()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{CompanyCachePrefix}Info";
                
                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for company info. Fetching from database.");
                        // Get the first brand (company) - in a real scenario, you'd filter by user's company
                        var brand = (await brandsRepository.Get()).FirstOrDefault();
                        if (brand == null) return null;
                        
                        return new CompanyDTO
                        {
                            Id = brand.Id,
                            Name = brand.Name,
                            Email = brand.BrandEmail,
                            Phone = brand.BrandPhone,
                            Country = brand.Country,
                            City = brand.City,
                            PostCode = brand.PostCode,
                            AddressLine1 = brand.AddresLine1,
                            AddressLine2 = brand.AddresLine2,
                            Logo = brand.Logo,
                            CreatedDate = brand.CreatedDate
                        };
                    },
                    DefaultCacheExpiration
                );
                
                return result;
            }, _logger);
        }

        public async Task<bool> UpdateCompany(UpdateCompanyDTO updateDto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                // Get the first brand (company)
                var brand = (await brandsRepository.Get()).FirstOrDefault();
                if (brand == null)
                {
                    _logger.LogWarning("No company found to update");
                    return false;
                }

                // Update brand properties
                brand.Name = updateDto.Name;
                brand.BrandEmail = updateDto.Email;
                brand.BrandPhone = updateDto.Phone;
                brand.Country = updateDto.Country;
                brand.City = updateDto.City;
                brand.PostCode = updateDto.PostCode;
                brand.AddresLine1 = updateDto.AddressLine1;
                brand.AddresLine2 = updateDto.AddressLine2;
                brand.Logo = updateDto.Logo;

                await brandsRepository.Update(brand);
                
                // Invalidate cache
                await _cacheService.RemoveAsync($"{CompanyCachePrefix}Info");
                
                return true;
            }, _logger);
        }

        public async Task<List<CompanyUserDTO>> GetCompanyUsers()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{CompanyCachePrefix}Users";
                
                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for company users. Fetching from database.");
                        // Get all brand users - in a real scenario, you'd filter by company
                        var brandUsers = await brandUsersRepository.Get();
                        
                        return brandUsers.Select(bu => new CompanyUserDTO
                        {
                            Id = bu.Id,
                            UserId = bu.UserId,
                            Username = $"User_{bu.UserId.ToString()[..8]}", // Placeholder - would come from Identity service
                            Email = $"user_{bu.UserId.ToString()[..8]}@company.com", // Placeholder
                            Role = "Member" // Placeholder - would come from role system
                        }).ToList();
                    },
                    DefaultCacheExpiration
                );
                
                return result ?? new List<CompanyUserDTO>();
            }, _logger);
        }

        public async Task<bool> AddCompanyUser(AddCompanyUserDTO addUserDto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                // Get the first brand (company)
                var brand = (await brandsRepository.Get()).FirstOrDefault();
                if (brand == null)
                {
                    _logger.LogWarning("No company found to add user to");
                    return false;
                }

                // Note: Role information from addUserDto is not persisted in BrandUser entity
                // In a production system, roles should be managed by the Identity service
                // TODO: Consider adding Role field to BrandUser entity or managing roles separately
                var brandUser = new BrandUser
                {
                    Id = Guid.NewGuid(),
                    UserId = addUserDto.UserId,
                    BrandId = brand.Id,
                    Brand = brand
                };

                await brandUsersRepository.Add(brandUser);
                
                // Invalidate cache
                await _cacheService.RemoveAsync($"{CompanyCachePrefix}Users");
                
                return true;
            }, _logger);
        }

        public async Task<bool> RemoveCompanyUser(Guid userId)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var brandUser = (await brandUsersRepository.Get())
                    .FirstOrDefault(bu => bu.UserId == userId);
                
                if (brandUser == null)
                {
                    _logger.LogWarning($"Brand user with userId {userId} not found");
                    return false;
                }

                await brandUsersRepository.Delete(brandUser);
                
                // Invalidate cache
                await _cacheService.RemoveAsync($"{CompanyCachePrefix}Users");
                
                return true;
            }, _logger);
        }

        public async Task<List<CompanyStructureNodeDTO>> GetCompanyStructure()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{CompanyCachePrefix}Structure";
                
                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for company structure. Fetching from database.");
                        // Placeholder - return empty structure for now
                        // In a real implementation, you'd have a CompanyStructure entity
                        return new List<CompanyStructureNodeDTO>();
                    },
                    DefaultCacheExpiration
                );
                
                return result ?? new List<CompanyStructureNodeDTO>();
            }, _logger);
        }

        public async Task<bool> UpdateCompanyStructure(UpdateCompanyStructureDTO structureDto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                // Placeholder - in a real implementation, you'd persist the structure
                _logger.LogInformation("Company structure update requested");
                
                // Invalidate cache
                await _cacheService.RemoveAsync($"{CompanyCachePrefix}Structure");
                
                return true;
            }, _logger);
        }
    }
}
