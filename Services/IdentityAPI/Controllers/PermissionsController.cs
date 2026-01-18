using IdentityAPI.Data.DTO.Permission;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Data.Models;
using Shared.Helpers;
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
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<IEnumerable<GetPermissionsDTO>>))]
        public async Task<IActionResult> GetV1()
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("GetV1 called: Fetching all permissions at {Time}", DateTime.UtcNow);
                try
                {
                    var result = await _permissionsService.GetPermissions();
                    _logger.LogInformation("GetV1 succeeded at {Time}", DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "GetV1 failed at {Time}", DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "permissions:read")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<GetPermissionDTO>))]
        public async Task<IActionResult> GetV1(Guid id)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("GetV1(id) called: Fetching permission with ID {Id} at {Time}", id, DateTime.UtcNow);
                try
                {
                    var result = await _permissionsService.GetPermission(id);
                    _logger.LogInformation("GetV1(id) succeeded for ID {Id} at {Time}", id, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "GetV1(id) failed for ID {Id} at {Time}", id, DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpPost()]
        [Authorize(Roles = "permissions:create")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Response<bool>))]
        public async Task<IActionResult> PostV1(AddPermissionDTO request)
        {
            return await Handle(async () =>
            {
                var sanitizedPermissionName = StringHelper.SanitizeForLog(request?.Name ?? string.Empty);
                _logger.LogInformation("PostV1 called for permission {PermissionName} at {Time}", sanitizedPermissionName, DateTime.UtcNow);
                try
                {
                    var result = await _permissionsService.AddPermission(request);
                    _logger.LogInformation("PostV1 succeeded for permission {PermissionName} at {Time}", sanitizedPermissionName, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "PostV1 failed for permission {PermissionName} at {Time}", sanitizedPermissionName, DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpPost("batch")]
        [Authorize(Policy = "PermissionBatchCreate")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<BatchPermissionsResultDTO>))]
        public async Task<IActionResult> PostBatchV1(BatchAddPermissionsDTO request)
        {
            return await Handle(async () =>
            {
                var permissionCount = request?.Permissions?.Count ?? 0;
                _logger.LogInformation("PostBatchV1 called for {Count} permissions at {Time}", permissionCount, DateTime.UtcNow);
                try
                {
                    var result = await _permissionsService.AddPermissionsBatch(request);
                    _logger.LogInformation("PostBatchV1 succeeded: Created={Created}, Skipped={Skipped}, Failed={Failed} at {Time}", 
                        result.Created, result.Skipped, result.Failed, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "PostBatchV1 failed for batch permissions at {Time}", DateTime.UtcNow);
                    throw;
                }
            });
        }
    }
}