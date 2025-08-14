using IdentityAPI.Data.DTO.Permission;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace IdentityAPI.Controllers
{
    public class PermissionsController : BaseController<PermissionsController>
    {
        private IPermissionsService _permissionsService { get; set; }

        public PermissionsController(ILogger<PermissionsController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            _permissionsService = serviceProvider.GetRequiredService<IPermissionsService>();
        }

        [HttpGet]
        [Authorize(Roles = "permissions:read:all")]
        public async Task<IActionResult> GetV1()
        {
            _logger.LogInformation("GetV1 called: Fetching all permissions at {Time}", DateTime.UtcNow);
            try
            {
                var result = await Handle(_permissionsService.GetPermissions);
                _logger.LogInformation("GetV1 succeeded at {Time}", DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetV1 failed at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "permissions:read")]
        public async Task<IActionResult> GetV1(Guid id)
        {
            _logger.LogInformation("GetV1(id) called: Fetching permission with ID {Id} at {Time}", id, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _permissionsService.GetPermission(id));
                _logger.LogInformation("GetV1(id) succeeded for ID {Id} at {Time}", id, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetV1(id) failed for ID {Id} at {Time}", id, DateTime.UtcNow);
                throw;
            }
        }

        [HttpPost()]
        [Authorize(Roles = "permissions:create")]
        public async Task<IActionResult> PostV1(AddPermissionDTO request)
        {
            _logger.LogInformation("PostV1 called: Creating permission with data {@Request} at {Time}", request, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _permissionsService.AddPermission(request));
                _logger.LogInformation("PostV1 succeeded for permission {PermissionName} at {Time}", request?.Name, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PostV1 failed for permission {PermissionName} at {Time}", request?.Name, DateTime.UtcNow);
                throw;
            }
        }
    }
}