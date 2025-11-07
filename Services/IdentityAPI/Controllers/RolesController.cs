using IdentityAPI.DTO.Role;
using IdentityAPI.Entities;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Data.Models;
using Shared.Services.App;
using Shared.Services.Cache;

namespace IdentityAPI.Controllers
{
    public class RolesController : BaseController<RolesController>
    {

        private readonly IRolesService _rolesService;

        public RolesController(ILogger<RolesController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            _rolesService = serviceProvider.GetRequiredService<IRolesService>();
        }

        [HttpGet]
        [ResponseCache(CacheProfileName = CacheProfiles.Medium)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<IEnumerable<Role>>))]
        public async Task<IActionResult> GetRolesV1()
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("GetRolesV1 called at {Time}", DateTime.UtcNow);
                try
                {
                    var result = await _rolesService.GetRoles();
                    _logger.LogInformation("GetRolesV1 succeeded at {Time}", DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "GetRolesV1 failed at {Time}", DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpGet("{id}")]
        [ResponseCache(CacheProfileName = CacheProfiles.Medium)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<Role>))]
        public async Task<IActionResult> GetRoleV1(Guid id)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("GetRoleV1 called for ID {Id} at {Time}", id, DateTime.UtcNow);
                try
                {
                    var result = await _rolesService.GetRole(id);
                    _logger.LogInformation("GetRoleV1 succeeded for ID {Id} at {Time}", id, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "GetRoleV1 failed for ID {Id} at {Time}", id, DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpPost]
        [ResponseCache(CacheProfileName = CacheProfiles.NoCache)]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Response<bool>))]
        public async Task<IActionResult> PostRoleV1(AddRoleRequest request)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("PostRoleV1 called with data {@Request} at {Time}", request, DateTime.UtcNow);
                try
                {
                    var result = await _rolesService.AddRole(request);
                    _logger.LogInformation("PostRoleV1 succeeded for role {RoleName} at {Time}", request?.Name, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "PostRoleV1 failed for role {RoleName} at {Time}", request?.Name, DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpPut("{id}")]
        [ResponseCache(CacheProfileName = CacheProfiles.NoCache)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        public async Task<IActionResult> PutRoleV1(Guid id, [FromBody] AddRoleRequest request)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("PutRoleV1 called for ID {Id} with data {@Request} at {Time}", id, request, DateTime.UtcNow);
                try
                {
                    var result = await _rolesService.EditRole(id, request);
                    _logger.LogInformation("PutRoleV1 succeeded for ID {Id} at {Time}", id, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "PutRoleV1 failed for ID {Id} at {Time}", id, DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpDelete("{id}")]
        [ResponseCache(CacheProfileName = CacheProfiles.NoCache)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        public async Task<IActionResult> DeleteRoleV1(Guid id)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("DeleteRoleV1 called for ID {Id} at {Time}", id, DateTime.UtcNow);
                try
                {
                    var result = await _rolesService.DeleteRole(id);
                    _logger.LogInformation("DeleteRoleV1 succeeded for ID {Id} at {Time}", id, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "DeleteRoleV1 failed for ID {Id} at {Time}", id, DateTime.UtcNow);
                    throw;
                }
            });
        }
    }
}