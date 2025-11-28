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
                
                // Use GetOrCreateAsync to simplify cache-aside pattern
                var roles = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () => (await _rolesRepository.Get()).ToList(),
                    DefaultCacheExpiration
                );
                
                _logger.LogInformation("Retrieved {Count} roles.", roles.Count);
                return roles;
            }, _logger);
        }

        public async Task<GetRoleDTO> GetRole(Guid id)
        {
            _logger.LogInformation("Getting role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{RolesCachePrefix}{id}";
                
                // Use GetOrCreateAsync to simplify cache-aside pattern
                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Creating RolePermissionsSpec for Id: {RoleId}", id);
                        var spec = new RolePermissionsSpec(x => x.Id.Equals(id));
                        var req = await _rolesRepository.Get(spec);
                        if (req == null || !req.Any())
                        {
                            _logger.LogWarning("Role with Id: {RoleId} not found.", id);
                        }
                        else
                        {
                            _logger.LogInformation("Role with Id: {RoleId} retrieved.", id);
                        }
                        return _mapper.Map<GetRoleDTO>(req);
                    },
                    DefaultCacheExpiration
                );
                
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
                
                // Update cache with new data instead of just invalidating
                // 1. Cache the newly added role
                var roleDto = _mapper.Map<GetRoleDTO>(toAdd);
                await _cacheService.SetAsync($"{RolesCachePrefix}{toAdd.Id}", roleDto, DefaultCacheExpiration);
                
                // 2. Update the all roles cache by appending the new role if cache exists
                var cachedAllRoles = await _cacheService.GetAsync<List<Role>>($"{RolesCachePrefix}All");
                if (cachedAllRoles != null)
                {
                    cachedAllRoles.Add(toAdd);
                    await _cacheService.SetAsync($"{RolesCachePrefix}All", cachedAllRoles, DefaultCacheExpiration);
                }
                // If cache doesn't exist, it will be lazily loaded on next read
                
                _logger.LogInformation("Role '{RoleName}' added successfully and cache updated: {Result}", request.Name, result);
                
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
                
                // Update cache with new data instead of just invalidating
                // Use the already-updated entity for the DTO instead of fetching again
                var roleDto = _mapper.Map<GetRoleDTO>(foundByName);
                
                // Update the specific role cache
                await _cacheService.SetAsync($"{RolesCachePrefix}{id}", roleDto, DefaultCacheExpiration);
                
                // Invalidate the all roles cache; it will be refreshed on next read
                await _cacheService.RemoveAsync($"{RolesCachePrefix}All");
                
                _logger.LogInformation("Role with Id: {RoleId} updated and cache refreshed: {Result}", id, result);
                
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
