using Microsoft.AspNetCore.Authorization;

namespace IdentityAPI.Services.Security
{
    /// <summary>
    /// Authorization handler for permission batch create that allows either service API key or user role
    /// </summary>
    public class PermissionBatchCreateAuthorizationHandler : AuthorizationHandler<PermissionBatchCreateRequirement>
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<PermissionBatchCreateAuthorizationHandler> _logger;

        public PermissionBatchCreateAuthorizationHandler(
            IConfiguration _configuration,
            ILogger<PermissionBatchCreateAuthorizationHandler> logger)
        {
            this._configuration = _configuration;
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionBatchCreateRequirement requirement)
        {
            // Check if HTTP context is available
            if (context.Resource is not HttpContext httpContext)
            {
                _logger.LogWarning("HTTP context not available for permission batch create authorization");
                return Task.CompletedTask;
            }

            // Option 1: Check for valid service API key (for service-to-service communication)
            if (httpContext.Request.Headers.TryGetValue("X-Service-API-Key", out var apiKeyValues))
            {
                var providedApiKey = apiKeyValues.FirstOrDefault();
                var expectedApiKey = _configuration["ServiceApiKey"] ?? 
                                    Environment.GetEnvironmentVariable("SERVICE_API_KEY");

                if (!string.IsNullOrEmpty(providedApiKey) && 
                    !string.IsNullOrEmpty(expectedApiKey) && 
                    providedApiKey == expectedApiKey)
                {
                    _logger.LogInformation("Valid service API key provided for batch permission create");
                    context.Succeed(requirement);
                    return Task.CompletedTask;
                }
            }

            // Option 2: Check if user has the required role (for user-initiated requests)
            if (context.User.IsInRole("permissions:create"))
            {
                _logger.LogInformation("User has permissions:create role for batch permission create");
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            _logger.LogDebug("Permission batch create authorization failed - no valid API key or role");
            return Task.CompletedTask;
        }
    }

    /// <summary>
    /// Authorization requirement for permission batch create operations
    /// </summary>
    public class PermissionBatchCreateRequirement : IAuthorizationRequirement
    {
    }
}
