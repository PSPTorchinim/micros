using AutoMapper;
using IdentityAPI.Data.Specifications;
using IdentityAPI.DTO.Role;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Services.App;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Services
{
    public interface IRolesService : IService
    {
        Task<List<Role>> GetRoles();
        Task<GetRoleDTO> GetRole(Guid id);
        Task<bool> AddRole(AddRoleRequest request);
        Task<bool> EditRole(Guid id, AddRoleRequest request);
        Task<bool> DeleteRole(Guid id);
    }

    public class RolesService : BaseService<IRolesService>, IRolesService
    {
        private readonly IRolesRepository _rolesRepository;
        private readonly IPermissionsRepository _permissionsRepository;
        private readonly ICacheService _cacheService;
        private const string RolesCachePrefix = "Roles_";
        private static readonly TimeSpan DefaultCacheExpiration = TimeSpan.FromMinutes(5);

        public RolesService(ILogger<IRolesService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _rolesRepository = serviceProvider.GetRequiredService<IRolesRepository>();
            _permissionsRepository = serviceProvider.GetRequiredService<IPermissionsRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<List<Role>> GetRoles()
        {
            _logger.LogInformation("Getting all roles.");
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{RolesCachePrefix}All";
                
                // Try to get from cache
                var cached = await _cacheService.GetAsync<List<Role>>(cacheKey);
                if (cached != null)
                {
                    _logger.LogDebug("Cache hit for all roles.");
                    return cached;
                }
                
                _logger.LogDebug("Cache miss for all roles. Calling _rolesRepository.Get()");
                var roles = (await _rolesRepository.Get()).ToList();
                
                // Store in cache
                await _cacheService.SetAsync(cacheKey, roles, DefaultCacheExpiration);
                
                _logger.LogInformation("Retrieved {Count} roles and cached them.", roles.Count);
                return roles;
            }, _logger);
        }

        public async Task<GetRoleDTO> GetRole(Guid id)
        {
            _logger.LogInformation("Getting role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{RolesCachePrefix}{id}";
                
                // Try to get from cache
                var cached = await _cacheService.GetAsync<GetRoleDTO>(cacheKey);
                if (cached != null)
                {
                    _logger.LogDebug("Cache hit for role Id: {RoleId}", id);
                    return cached;
                }
                
                _logger.LogDebug("Cache miss for role Id: {RoleId}. Creating RolePermissionsSpec", id);
                var spec = new RolePermissionsSpec(x => x.Id.Equals(id));
                _logger.LogDebug("Calling _rolesRepository.Get(spec) for Id: {RoleId}", id);
                var req = await _rolesRepository.Get(spec);
                if (req == null || !req.Any())
                {
                    _logger.LogWarning("Role with Id: {RoleId} not found.", id);
                }
                else
                {
                    _logger.LogInformation("Role with Id: {RoleId} retrieved.", id);
                }
                
                var result = _mapper.Map<GetRoleDTO>(req);
                
                // Store in cache
                if (result != null)
                {
                    await _cacheService.SetAsync(cacheKey, result, DefaultCacheExpiration);
                }
                
                return result;
            }, _logger);
        }

        public async Task<bool> AddRole(AddRoleRequest request)
        {
            _logger.LogInformation("Adding new role: {RoleName}", request.Name);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Checking if role with name '{RoleName}' exists.", request.Name);
                var foundByName = await _rolesRepository.Exists(role => role.Name == request.Name);
                if (foundByName)
                {
                    _logger.LogWarning("Role with name '{RoleName}' already exists.", request.Name);
                    throw new AppException(ExceptionCodes.AddRoleExists);
                }

                _logger.LogDebug("Fetching permissions for new role '{RoleName}'.", request.Name);
                var permissions = await _permissionsRepository.Get(p => request.Permissions.Contains(p.Id));
                var toAdd = new Role
                {
                    Name = request.Name,
                    Description = request.Description,
                    Permissions = permissions
                };

                _logger.LogDebug("Adding role '{RoleName}' to repository.", request.Name);
                var result = await _rolesRepository.Add(toAdd);
                await _rolesRepository.Save();
                
                // Invalidate cache after adding
                await _cacheService.RemoveByPrefixAsync(RolesCachePrefix);
                _logger.LogInformation("Role '{RoleName}' added successfully and cache invalidated: {Result}", request.Name, result);
                
                return result;
            }, _logger);
        }

        public async Task<bool> EditRole(Guid id, AddRoleRequest request)
        {
            _logger.LogInformation("Editing role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Fetching role with Id: {RoleId} for edit.", id);
                var foundByName = (await _rolesRepository.Get(role => role.Id == id)).FirstOrDefault();
                if (foundByName == null)
                {
                    _logger.LogWarning("Role with Id: {RoleId} not found for edit.", id);
                    throw new AppException(ExceptionCodes.RoleNotExists);
                }

                _logger.LogDebug("Updating role fields for Id: {RoleId}", id);
                foundByName.Name = request.Name;
                foundByName.Description = request.Description;
                foundByName.Permissions = await _permissionsRepository.Get(p => request.Permissions.Contains(p.Id));

                _logger.LogDebug("Updating role with Id: {RoleId} in repository.", id);
                var result = await _rolesRepository.Update(foundByName);
                await _rolesRepository.Save();
                
                // Invalidate cache after editing
                await _cacheService.RemoveByPrefixAsync(RolesCachePrefix);
                _logger.LogInformation("Role with Id: {RoleId} updated and cache invalidated: {Result}", id, result);
                
                return result;
            }, _logger);
        }

        public async Task<bool> DeleteRole(Guid id)
        {
            _logger.LogInformation("Deleting role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Fetching role with Id: {RoleId} for deletion.", id);
                var foundByName = (await _rolesRepository.Get(role => role.Id == id)).FirstOrDefault();
                if (foundByName == null)
                {
                    _logger.LogWarning("Role with Id: {RoleId} not found for deletion.", id);
                    throw new AppException(ExceptionCodes.RoleNotExists);
                }

                if (foundByName.Users.Any())
                {
                    _logger.LogWarning("Role with Id: {RoleId} has users and cannot be deleted.", id);
                    throw new AppException(ExceptionCodes.RoleHasUsers);
                }

                _logger.LogDebug("Deleting role with Id: {RoleId} from repository.", id);
                var result = await _rolesRepository.Delete(foundByName);
                
                // Invalidate cache after deleting
                await _cacheService.RemoveByPrefixAsync(RolesCachePrefix);
                _logger.LogInformation("Role with Id: {RoleId} deleted and cache invalidated: {Result}", id, result);
                
                return result;
            }, _logger);
        }
    }
}
