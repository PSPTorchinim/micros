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
        private static int _consecutiveFailures = 0;
        private static readonly int MaxConsecutiveFailures = 5;

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
            
            // Skip validation if user is not logged in (no JWT included)
            var authHeader = request.Headers.Authorization.FirstOrDefault();
            if (string.IsNullOrWhiteSpace(authHeader))
            {
                _logger.LogDebug("No authorization header found, skipping security stamp validation");
                return;
            }

            // Skip validation only for the ValidateSecurityStamp endpoint (to avoid circular calls)
            if (request.Path.StartsWithSegments("/identity/api", StringComparison.OrdinalIgnoreCase) &&
                request.Path.Value?.Contains("ValidateSecurityStamp", StringComparison.OrdinalIgnoreCase) == true)
            {
                _logger.LogDebug("Skipping security stamp validation for ValidateSecurityStamp endpoint");
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
                    await WriteUnauthorizedResponse(context.HttpContext, "Invalid token format");
                    return;
                }

                var jwtToken = handler.ReadJwtToken(token);
                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "Id");
                var securityStampClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "SecurityStamp");

                if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
                {
                    _logger.LogWarning("User ID claim not found in token");
                    await WriteUnauthorizedResponse(context.HttpContext, "User ID not found in token");
                    return;
                }

                if (securityStampClaim == null || string.IsNullOrWhiteSpace(securityStampClaim.Value))
                {
                    _logger.LogWarning("Security stamp claim not found in token for user {UserId}", userIdClaim.Value);
                    await WriteUnauthorizedResponse(context.HttpContext, "Security stamp not found in token");
                    return;
                }

                // Circuit breaker: if too many consecutive failures, fail-secure
                if (_consecutiveFailures >= MaxConsecutiveFailures)
                {
                    _logger.LogError("Circuit breaker open - too many validation service failures. Denying access.");
                    await WriteUnauthorizedResponse(context.HttpContext, "Security validation service unavailable");
                    return;
                }

                // Call identity service to validate security stamp
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.Timeout = TimeSpan.FromSeconds(5); // Set reasonable timeout
                
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
                    Interlocked.Increment(ref _consecutiveFailures);
                    await WriteUnauthorizedResponse(context.HttpContext, "Security validation failed");
                    return;
                }

                var validationResult = await response.Content.ReadFromJsonAsync<SecurityStampValidationResponse>();
                
                if (validationResult?.Data?.IsValid != true)
                {
                    _logger.LogWarning("Security stamp validation failed for user {UserId}. Reason: {Reason}",
                        userIdClaim.Value, validationResult?.Data?.Reason ?? "Unknown");
                    Interlocked.Exchange(ref _consecutiveFailures, 0); // Reset on successful call but invalid stamp
                    await WriteUnauthorizedResponse(
                        context.HttpContext, 
                        "Unauthorized - " + (validationResult?.Data?.Reason ?? "Security validation failed"),
                        validationResult?.Data?.Reason);
                    return;
                }

                // Success - reset failure counter
                Interlocked.Exchange(ref _consecutiveFailures, 0);
                _logger.LogDebug("Security stamp validated successfully for user {UserId}", userIdClaim.Value);
            }
            catch (TaskCanceledException)
            {
                _logger.LogError("Security validation request timed out");
                Interlocked.Increment(ref _consecutiveFailures);
                await WriteUnauthorizedResponse(context.HttpContext, "Security validation timeout");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Network error during security stamp validation");
                Interlocked.Increment(ref _consecutiveFailures);
                await WriteUnauthorizedResponse(context.HttpContext, "Security validation service error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during security stamp validation");
                Interlocked.Increment(ref _consecutiveFailures);
                await WriteUnauthorizedResponse(context.HttpContext, "Security validation error");
            }
        }

        private static async Task WriteUnauthorizedResponse(HttpContext context, string error, string? reason = null)
        {
            if (context.Response.HasStarted)
            {
                return;
            }

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            
            if (reason != null)
            {
                await context.Response.WriteAsJsonAsync(new { error, reason });
            }
            else
            {
                await context.Response.WriteAsJsonAsync(new { error });
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
