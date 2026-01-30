using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Shared.Services.Security
{
    /// <summary>
    /// Authorization handler that validates if a user has the required permission.
    /// Checks the "permissions" claim in the JWT token.
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
            // Get the user's permissions from the claims
            var permissionsClaim = context.User.FindFirst("permissions")?.Value;
            
            if (string.IsNullOrEmpty(permissionsClaim))
            {
                _logger.LogWarning("User {UserId} has no permissions claim", 
                    context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown");
                return Task.CompletedTask;
            }

            // Parse permissions (assuming comma-separated list)
            var permissions = permissionsClaim.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(p => p.Trim())
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            // Check if user has the required permission
            if (permissions.Contains(requirement.Permission))
            {
                _logger.LogDebug("User {UserId} has required permission: {Permission}", 
                    context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown",
                    requirement.Permission);
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning("User {UserId} lacks required permission: {Permission}", 
                    context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown",
                    requirement.Permission);
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
