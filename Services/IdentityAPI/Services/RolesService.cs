using AutoMapper;
using IdentityAPI.Data.Specifications;
using IdentityAPI.DTO.Role;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Services.App;
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

        public RolesService(ILogger<IRolesService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _rolesRepository = serviceProvider.GetRequiredService<IRolesRepository>();
            _permissionsRepository = serviceProvider.GetRequiredService<IPermissionsRepository>();
        }

        public async Task<List<Role>> GetRoles()
        {
            _logger.LogInformation("Getting all roles.");
            return await ExceptionHandler.Handle(async () =>
            {
                var roles = (await _rolesRepository.Get()).ToList();
                _logger.LogInformation("Retrieved {Count} roles.", roles.Count);
                return roles;
            }, _logger);
        }

        public async Task<GetRoleDTO> GetRole(Guid id)
        {
            _logger.LogInformation("Getting role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
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
            }, _logger);
        }

        public async Task<bool> AddRole(AddRoleRequest request)
        {
            _logger.LogInformation("Adding new role: {RoleName}", request.Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var foundByName = await _rolesRepository.Exists(role => role.Name == request.Name);
                if (foundByName)
                {
                    _logger.LogWarning("Role with name '{RoleName}' already exists.", request.Name);
                    throw new AppException(ExceptionCodes.AddRoleExists);
                }

                var toAdd = new Role
                {
                    Name = request.Name,
                    Description = request.Description,
                    Permissions = await _permissionsRepository.Get(p => request.Permissions.Contains(p.Id))
                };

                var result = await _rolesRepository.Add(toAdd);
                _logger.LogInformation("Role '{RoleName}' added successfully: {Result}", request.Name, result);
                return result;
            }, _logger);
        }

        public async Task<bool> EditRole(Guid id, AddRoleRequest request)
        {
            _logger.LogInformation("Editing role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
                var foundByName = (await _rolesRepository.Get(role => role.Id == id)).FirstOrDefault();
                if (foundByName == null)
                {
                    _logger.LogWarning("Role with Id: {RoleId} not found for edit.", id);
                    throw new AppException(ExceptionCodes.RoleNotExists);
                }

                foundByName.Name = request.Name;
                foundByName.Description = request.Description;
                foundByName.Permissions = await _permissionsRepository.Get(p => request.Permissions.Contains(p.Id));

                var result = await _rolesRepository.Update(foundByName);
                _logger.LogInformation("Role with Id: {RoleId} updated: {Result}", id, result);
                return result;
            }, _logger);
        }

        public async Task<bool> DeleteRole(Guid id)
        {
            _logger.LogInformation("Deleting role with Id: {RoleId}", id);
            return await ExceptionHandler.Handle(async () =>
            {
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

                var result = await _rolesRepository.Delete(foundByName);
                _logger.LogInformation("Role with Id: {RoleId} deleted: {Result}", id, result);
                return result;
            }, _logger);
        }
    }
}
