using Microsoft.AspNetCore.Authorization;

namespace IdentityAPI.Services.Security
{
    /// <summary>
    /// Authorization handler that validates service API keys for service-to-service communication
    /// </summary>
    public class ServiceApiKeyAuthorizationHandler : AuthorizationHandler<ServiceApiKeyRequirement>
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ServiceApiKeyAuthorizationHandler> _logger;

        public ServiceApiKeyAuthorizationHandler(
            IConfiguration configuration,
            ILogger<ServiceApiKeyAuthorizationHandler> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            ServiceApiKeyRequirement requirement)
        {
            // Check if HTTP context is available
            if (context.Resource is not HttpContext httpContext)
            {
                _logger.LogWarning("HTTP context not available for service API key validation");
                return Task.CompletedTask;
            }

            // Get the API key from the request header
            if (!httpContext.Request.Headers.TryGetValue("X-Service-API-Key", out var apiKeyValues))
            {
                _logger.LogDebug("No service API key provided in request");
                return Task.CompletedTask;
            }

            var providedApiKey = apiKeyValues.FirstOrDefault();
            if (string.IsNullOrEmpty(providedApiKey))
            {
                _logger.LogDebug("Empty service API key provided");
                return Task.CompletedTask;
            }

            // Get the expected API key from configuration
            var expectedApiKey = _configuration["ServiceApiKey"] ?? 
                                Environment.GetEnvironmentVariable("SERVICE_API_KEY");

            if (string.IsNullOrEmpty(expectedApiKey))
            {
                _logger.LogWarning("No service API key configured in Identity API");
                return Task.CompletedTask;
            }

            // Validate the API key
            if (providedApiKey == expectedApiKey)
            {
                _logger.LogInformation("Valid service API key provided, granting service:seed permission");
                context.Succeed(requirement);
            }
            else
            {
                _logger.LogWarning("Invalid service API key provided");
            }

            return Task.CompletedTask;
        }
    }

    /// <summary>
    /// Authorization requirement for service API key validation
    /// </summary>
    public class ServiceApiKeyRequirement : IAuthorizationRequirement
    {
    }
}
