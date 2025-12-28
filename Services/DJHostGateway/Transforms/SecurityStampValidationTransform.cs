using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Json;
using System.Text.Json;
using Yarp.ReverseProxy.Transforms;

namespace DJHostGateway.Transforms
{
    public class SecurityStampValidationTransform : RequestTransform
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<SecurityStampValidationTransform> _logger;
        private readonly string _identityServiceUrl;

        public SecurityStampValidationTransform(
            IHttpClientFactory httpClientFactory,
            ILogger<SecurityStampValidationTransform> logger,
            IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _identityServiceUrl = Environment.GetEnvironmentVariable("ASPNETCORE_IDENTITY_BE_ADDRESS")
                ?? configuration["ReverseProxy:Clusters:Identity:Destinations:destination1:Address"]
                ?? "http://localhost:5001";
        }

        public override async ValueTask ApplyAsync(RequestTransformContext context)
        {
            var request = context.HttpContext.Request;
            
            // Skip validation for identity service endpoints (to avoid circular calls)
            if (request.Path.StartsWithSegments("/identity", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogDebug("Skipping security stamp validation for identity endpoint");
                return;
            }

            // Skip validation for endpoints that don't require authentication
            var authHeader = request.Headers.Authorization.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(authHeader))
            {
                _logger.LogDebug("No authorization header found, skipping security stamp validation");
                return;
            }

            try
            {
                // Extract token from "Bearer <token>"
                var token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authHeader.Substring(7)
                    : authHeader;

                // Parse JWT to extract claims
                var handler = new JwtSecurityTokenHandler();
                if (!handler.CanReadToken(token))
                {
                    _logger.LogWarning("Invalid JWT token format");
                    context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        error = "Invalid token format"
                    });
                    context.HttpContext.Abort();
                    return;
                }

                var jwtToken = handler.ReadJwtToken(token);
                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "Id");
                var securityStampClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "SecurityStamp");

                if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
                {
                    _logger.LogWarning("User ID claim not found in token");
                    context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        error = "User ID not found in token"
                    });
                    context.HttpContext.Abort();
                    return;
                }

                if (securityStampClaim == null || string.IsNullOrWhiteSpace(securityStampClaim.Value))
                {
                    _logger.LogWarning("Security stamp claim not found in token for user {UserId}", userIdClaim.Value);
                    context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        error = "Security stamp not found in token"
                    });
                    context.HttpContext.Abort();
                    return;
                }

                // Call identity service to validate security stamp
                var httpClient = _httpClientFactory.CreateClient();
                var validationRequest = new
                {
                    userId = userIdClaim.Value,
                    securityStamp = securityStampClaim.Value
                };

                var response = await httpClient.PostAsJsonAsync(
                    $"{_identityServiceUrl}/api/Users/ValidateSecurityStamp",
                    validationRequest);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Failed to validate security stamp for user {UserId}. Status: {StatusCode}",
                        userIdClaim.Value, response.StatusCode);
                    context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        error = "Security validation failed"
                    });
                    context.HttpContext.Abort();
                    return;
                }

                var validationResult = await response.Content.ReadFromJsonAsync<SecurityStampValidationResponse>();
                
                if (validationResult?.Data?.IsValid != true)
                {
                    _logger.LogWarning("Security stamp validation failed for user {UserId}. Reason: {Reason}",
                        userIdClaim.Value, validationResult?.Data?.Reason ?? "Unknown");
                    context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.HttpContext.Response.WriteAsJsonAsync(new
                    {
                        error = "Unauthorized - " + (validationResult?.Data?.Reason ?? "Security validation failed"),
                        reason = validationResult?.Data?.Reason
                    });
                    context.HttpContext.Abort();
                    return;
                }

                _logger.LogDebug("Security stamp validated successfully for user {UserId}", userIdClaim.Value);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during security stamp validation");
                // Don't block the request if validation service is unavailable
                _logger.LogWarning("Allowing request to proceed due to validation service error");
            }
        }

        private class SecurityStampValidationResponse
        {
            public ValidationData? Data { get; set; }
        }

        private class ValidationData
        {
            public bool IsValid { get; set; }
            public string? Reason { get; set; }
        }
    }
}
