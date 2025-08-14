using AutoMapper;
using IdentityAPI.Data.DTO.Permission;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Services
{
    public interface IPermissionsService : IService
    {
        Task<List<GetPermissionsDTO>> GetPermissions();
        Task<GetPermissionDTO> GetPermission(Guid id);
        Task<bool> AddPermission(AddPermissionDTO request);
        Task<bool> EditPermission(Guid id, EditPermissionDTO request);
        Task<bool> DeletePermission(Guid id);
    }

    public class PermissionsService : BaseService<IPermissionsService>, IPermissionsService
    {
        public PermissionsService(ILogger<IPermissionsService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _permissionsRepository = serviceProvider.GetRequiredService<IPermissionsRepository>();
        }

        private IPermissionsRepository _permissionsRepository { get; set; }

        public async Task<List<GetPermissionsDTO>> GetPermissions()
        {
            _logger.LogInformation("Getting all permissions.");
            return await ExceptionHandler.Handle(async () =>
            {
                var result = await _permissionsRepository.Get();
                _logger.LogInformation("Retrieved {Count} permissions.", result.Count);
                return _mapper.Map<List<GetPermissionsDTO>>(result);
            }, _logger);
        }

        public async Task<bool> AddPermission(AddPermissionDTO request)
        {
            _logger.LogInformation("Adding permission with name: {Name}", request.Name);
            return await ExceptionHandler.Handle(async () =>
            {
                if (await _permissionsRepository.Exists(x => x.Name.Equals(request.Name)))
                {
                    _logger.LogWarning("Permission with name {Name} already exists.", request.Name);
                    return false;
                }
                var req = _mapper.Map<Permission>(request);
                var result = await _permissionsRepository.Add(req);
                _logger.LogInformation("Permission with name {Name} added: {Result}", request.Name, result);
                return result;
            }, _logger);
        }

        public async Task<GetPermissionDTO> GetPermission(Guid id)
        {
            _logger.LogInformation("Getting permission with id: {Id}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var req = await _permissionsRepository.Get(p => p.Id.Equals(id));
                if (req.FirstOrDefault() == null)
                {
                    _logger.LogWarning("Permission with id {Id} not found.", id);
                }
                else
                {
                    _logger.LogInformation("Permission with id {Id} retrieved.", id);
                }
                return _mapper.Map<GetPermissionDTO>(req.FirstOrDefault());
            }, _logger);
        }

        public async Task<bool> EditPermission(Guid id, EditPermissionDTO request)
        {
            _logger.LogInformation("Editing permission with id: {Id}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var permission = (await _permissionsRepository.Get(p => p.Id.Equals(id))).FirstOrDefault();
                if (permission == null)
                {
                    _logger.LogWarning("Permission with id {Id} not found for edit.", id);
                    return false;
                }
                permission.Name = request.Name;
                permission.Description = request.Description;
                var result = await _permissionsRepository.Update(permission);
                _logger.LogInformation("Permission with id {Id} updated: {Result}", id, result);
                return result;
            }, _logger);
        }

        public async Task<bool> DeletePermission(Guid id)
        {
            _logger.LogInformation("Deleting permission with id: {Id}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var permission = (await _permissionsRepository.Get(p => p.Id.Equals(id))).FirstOrDefault();
                if (permission != null)
                {
                    var result = await _permissionsRepository.Delete(permission);
                    _logger.LogInformation("Permission with id {Id} deleted: {Result}", id, result);
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