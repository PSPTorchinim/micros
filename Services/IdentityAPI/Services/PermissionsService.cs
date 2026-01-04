using AutoMapper;
using IdentityAPI.Data.DTO.Permission;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Helpers;
using Shared.Services.App;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Services
{
    public interface IPermissionsService : IService
    {
        Task<List<GetPermissionsDTO>> GetPermissions();
        Task<GetPermissionDTO?> GetPermission(Guid id);
        Task<bool> AddPermission(AddPermissionDTO request);
        Task<bool> EditPermission(Guid id, EditPermissionDTO request);
        Task<bool> DeletePermission(Guid id);
    }

    public class PermissionsService : BaseService<IPermissionsService>, IPermissionsService
    {
        private readonly IPermissionsRepository _permissionsRepository;
        private readonly ICacheService _cacheService;
        private const string PermissionsCachePrefix = "Permissions_";
        private static readonly TimeSpan DefaultCacheExpiration = TimeSpan.FromMinutes(5);

        public PermissionsService(ILogger<IPermissionsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _permissionsRepository = serviceProvider.GetRequiredService<IPermissionsRepository>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<List<GetPermissionsDTO>> GetPermissions()
        {
            _logger.LogInformation("Getting all permissions.");
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{PermissionsCachePrefix}All";

                // Use GetOrCreateAsync to simplify cache-aside pattern
                var permissions = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for permissions. Fetching from database.");
                        var result = await _permissionsRepository.Get();
                        return _mapper.Map<List<GetPermissionsDTO>>(result);
                    },
                    DefaultCacheExpiration
                );

                // GetOrCreateAsync will never return null for list factories that return non-null
                var result = permissions ?? new List<GetPermissionsDTO>();
                _logger.LogInformation("Retrieved {Count} permissions.", result.Count);
                return result;
            }, _logger);
        }

        public async Task<bool> AddPermission(AddPermissionDTO request)
        {
            _logger.LogInformation("Adding permission with name: {Name}", StringHelper.SanitizeForLog(request.Name));
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Checking if permission with name {Name} exists.", StringHelper.SanitizeForLog(request.Name));
                if (await _permissionsRepository.Exists(x => x.Name.Equals(request.Name)))
                {
                    _logger.LogWarning("Permission with name {Name} already exists.", StringHelper.SanitizeForLog(request.Name));
                    return false;
                }
                var req = _mapper.Map<Permission>(request);
                _logger.LogDebug("Mapped AddPermissionDTO to Permission entity.");
                var result = await _permissionsRepository.Add(req);

                // Invalidate cache so it will be refreshed on next read
                await _cacheService.RemoveAsync($"{PermissionsCachePrefix}All");

                _logger.LogInformation("Permission with name {Name} added and cache invalidated: {Result}", StringHelper.SanitizeForLog(request.Name), result);
                return result;
            }, _logger);
        }

        public async Task<GetPermissionDTO?> GetPermission(Guid id)
        {
            _logger.LogInformation("Getting permission with id: {Id}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{PermissionsCachePrefix}{id}";

                // Use GetOrCreateAsync to simplify cache-aside pattern
                // Returns null if not found (null values are not cached)
                var permission = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for permission id: {Id}. Fetching from database.", id);
                        var req = await _permissionsRepository.Get(p => p.Id.Equals(id));
                        var entity = req.FirstOrDefault();
                        if (entity == null)
                        {
                            _logger.LogWarning("Permission with id {Id} not found.", id);
                            return null;
                        }
                        _logger.LogInformation("Permission with id {Id} retrieved.", id);
                        return _mapper.Map<GetPermissionDTO>(entity);
                    },
                    DefaultCacheExpiration
                );

                return permission;
            }, _logger);
        }

        public async Task<bool> EditPermission(Guid id, EditPermissionDTO request)
        {
            _logger.LogInformation("Editing permission with id: {Id}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Fetching permission with id: {Id} for edit.", id);
                var permission = (await _permissionsRepository.Get(p => p.Id.Equals(id))).FirstOrDefault();
                if (permission == null)
                {
                    _logger.LogWarning("Permission with id {Id} not found for edit.", id);
                    return false;
                }
                _logger.LogDebug("Updating permission fields for id: {Id}", id);
                permission.Name = request.Name;
                permission.Description = request.Description;
                var result = await _permissionsRepository.Update(permission);

                // Update cache with new data
                var updatedPermission = _mapper.Map<GetPermissionDTO>(permission);
                await _cacheService.SetAsync($"{PermissionsCachePrefix}{id}", updatedPermission, DefaultCacheExpiration);

                // Invalidate the all permissions cache so it will be refreshed on next read
                await _cacheService.RemoveAsync($"{PermissionsCachePrefix}All");

                _logger.LogInformation("Permission with id {Id} updated and cache refreshed: {Result}", id, result);
                return result;
            }, _logger);
        }

        public async Task<bool> DeletePermission(Guid id)
        {
            _logger.LogInformation("Deleting permission with id: {Id}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Fetching permission with id: {Id} for deletion.", id);
                var permission = (await _permissionsRepository.Get(p => p.Id.Equals(id))).FirstOrDefault();
                if (permission != null)
                {
                    _logger.LogDebug("Permission found. Proceeding to delete id: {Id}", id);
                    var result = await _permissionsRepository.Delete(permission);

                    // Invalidate the specific permission cache
                    await _cacheService.RemoveAsync($"{PermissionsCachePrefix}{id}");

                    // Invalidate the "All" permissions cache so it will be lazily loaded on next read
                    await _cacheService.RemoveAsync($"{PermissionsCachePrefix}All");

                    _logger.LogInformation("Permission with id {Id} deleted and cache invalidated: {Result}", id, result);
                    return result;
                }
                else
                {
                    _logger.LogWarning("Permission with id {Id} not found for deletion.", id);
                    return false;
                }
            }, _logger);
        }
    }
}