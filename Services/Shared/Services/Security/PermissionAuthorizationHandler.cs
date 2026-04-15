using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Shared.Services.Security
{
    /// <summary>
    /// Authorization handler that validates if a user has the required permission.
    /// Permissions are stored as individual <see cref="ClaimTypes.Role"/> claims in the JWT token,
    /// with each claim value being a permission name (e.g. "company:update").
    /// </summary>
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly ILogger<PermissionAuthorizationHandler> _logger;

        public PermissionAuthorizationHandler(ILogger<PermissionAuthorizationHandler> logger)
        {
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var userId = context.User.FindFirst("Id")?.Value
                ?? context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? "unknown";

            // Permissions are stored as ClaimTypes.Role claims (one claim per permission name)
            var userPermissions = context.User
                .FindAll(ClaimTypes.Role)
                .Select(c => c.Value)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            if (userPermissions.Count == 0)
            {
                _logger.LogWarning("User {UserId} has no role/permission claims", userId);
                return Task.CompletedTask;
            }

            // Check if user has the required permission
            if (userPermissions.Contains(requirement.Permission))
            {
                _logger.LogDebug("User {UserId} has required permission: {Permission}",
                    userId, requirement.Permission);
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning("User {UserId} lacks required permission: {Permission}",
                    userId, requirement.Permission);
            }

            return Task.CompletedTask;
        }
    }

    /// <summary>
    /// Authorization requirement for permission-based access control.
    /// </summary>
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string Permission { get; }

        public PermissionRequirement(string permission)
        {
            Permission = permission;
        }
    }
}
