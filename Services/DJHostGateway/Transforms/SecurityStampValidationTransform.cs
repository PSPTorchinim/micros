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
        private const string StrapiPathPrefix = "/strapi/";

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
            var requestPath = request.Path.Value ?? "unknown";
            var requestMethod = request.Method;
            var correlationId = context.HttpContext.TraceIdentifier;
            
            _logger.LogInformation("🔐 [SecurityStamp] Starting validation | CorrelationId: {CorrelationId} | Path: {Path} | Method: {Method}", 
                correlationId, requestPath, requestMethod);
            
            // Skip validation for Strapi paths (Strapi has its own authentication)
            if (request.Path.Value?.StartsWith(StrapiPathPrefix, StringComparison.OrdinalIgnoreCase) == true)
            {
                _logger.LogInformation("✓ [SecurityStamp] SKIPPED - Strapi endpoint (uses own authentication) | CorrelationId: {CorrelationId} | Path: {Path}", 
                    correlationId, requestPath);
                
                // Remove Authorization header from the incoming request for Strapi
                if (context.HttpContext.Request.Headers.ContainsKey("Authorization"))
                {
                    context.HttpContext.Request.Headers.Remove("Authorization");
                    _logger.LogDebug("🔓 [SecurityStamp] Removed Authorization header for Strapi request | CorrelationId: {CorrelationId}", 
                        correlationId);
                }
                
                return;
            }
            
            // Try to get JWT token from Authorization header or jwtToken cookie
            var authHeader = request.Headers.Authorization.FirstOrDefault();
            string? token = null;
            string tokenSource = "none";
            
            if (!string.IsNullOrWhiteSpace(authHeader))
            {
                // Extract token from "Bearer <token>"
                token = authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
                    ? authHeader.Substring(7)
                    : authHeader;
                tokenSource = "Authorization header";
            }
            else if (request.Cookies.TryGetValue("jwtToken", out var cookieToken) && !string.IsNullOrWhiteSpace(cookieToken))
            {
                token = cookieToken;
                tokenSource = "jwtToken cookie";
            }
            
            // Skip validation if user is not logged in (no JWT included)
            if (string.IsNullOrWhiteSpace(token))
            {
                _logger.LogInformation("✓ [SecurityStamp] SKIPPED - No JWT token found | CorrelationId: {CorrelationId} | Path: {Path}", 
                    correlationId, requestPath);
                return;
            }
            
            _logger.LogDebug("🔑 [SecurityStamp] JWT token found | CorrelationId: {CorrelationId} | Source: {Source}", 
                correlationId, tokenSource);

            // Skip validation only for the ValidateSecurityStamp endpoint (to avoid circular calls)
            if (request.Path.Value?.Contains("ValidateSecurityStamp", StringComparison.OrdinalIgnoreCase) == true)
            {
                _logger.LogInformation("✓ [SecurityStamp] SKIPPED - ValidateSecurityStamp endpoint (avoiding circular call) | CorrelationId: {CorrelationId}", 
                    correlationId);
                return;
            }

            try
            {
                _logger.LogDebug("📝 [SecurityStamp] Parsing JWT token | CorrelationId: {CorrelationId} | Source: {Source}", 
                    correlationId, tokenSource);
                
                // Parse JWT to extract claims
                var handler = new JwtSecurityTokenHandler();
                if (!handler.CanReadToken(token))
                {
                    _logger.LogWarning("❌ [SecurityStamp] INVALID TOKEN FORMAT | CorrelationId: {CorrelationId} | Path: {Path}", 
                        correlationId, requestPath);
                    await WriteUnauthorizedResponse(context.HttpContext, "Invalid token format");
                    return;
                }

                var jwtToken = handler.ReadJwtToken(token);
                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "Id");
                var securityStampClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "SecurityStamp");

                if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
                {
                    _logger.LogWarning("❌ [SecurityStamp] MISSING USER ID | CorrelationId: {CorrelationId} | Path: {Path}", 
                        correlationId, requestPath);
                    await WriteUnauthorizedResponse(context.HttpContext, "User ID not found in token");
                    return;
                }

                var userId = userIdClaim.Value;

                if (securityStampClaim == null || string.IsNullOrWhiteSpace(securityStampClaim.Value))
                {
                    _logger.LogWarning("❌ [SecurityStamp] MISSING STAMP IN TOKEN | CorrelationId: {CorrelationId} | UserId: {UserId} | Path: {Path}", 
                        correlationId, userId, requestPath);
                    await WriteUnauthorizedResponse(context.HttpContext, "Security stamp not found in token");
                    return;
                }

                var tokenStamp = securityStampClaim.Value;
                _logger.LogDebug("📋 [SecurityStamp] Token claims extracted | CorrelationId: {CorrelationId} | UserId: {UserId} | TokenStamp: {TokenStamp}", 
                    correlationId, userId, tokenStamp);

                // Circuit breaker: if too many consecutive failures, fail-secure
                if (_consecutiveFailures >= MaxConsecutiveFailures)
                {
                    _logger.LogError("⚠️ [SecurityStamp] CIRCUIT BREAKER OPEN | CorrelationId: {CorrelationId} | ConsecutiveFailures: {Failures} | Max: {Max} | Action: DENY ACCESS", 
                        correlationId, _consecutiveFailures, MaxConsecutiveFailures);
                    await WriteUnauthorizedResponse(context.HttpContext, "Security validation service unavailable");
                    return;
                }

                // Call identity service to validate security stamp
                _logger.LogDebug("🔄 [SecurityStamp] Calling validation endpoint | CorrelationId: {CorrelationId} | UserId: {UserId} | Endpoint: {Endpoint}", 
                    correlationId, userId, $"{_identityServiceUrl}/api/Users/ValidateSecurityStamp");
                
                var httpClient = _httpClientFactory.CreateClient();
                httpClient.Timeout = TimeSpan.FromSeconds(5); // Set reasonable timeout
                
                var validationRequest = new
                {
                    userId = userIdClaim.Value,
                    securityStamp = securityStampClaim.Value
                };

                var url = $"{_identityServiceUrl}/v1/Users/ValidateSecurityStamp";

                _logger.LogDebug("📤 [SecurityStamp] Sending validation request | CorrelationId: {CorrelationId} | UserId: {UserId} | URL: {URL} | Payload: {@Payload}", 
                    correlationId, userId, url, validationRequest);

                var response = await httpClient.PostAsJsonAsync(
                    url,
                    validationRequest);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("❌ [SecurityStamp] VALIDATION API CALL FAILED | CorrelationId: {CorrelationId} | UserId: {UserId} | StatusCode: {StatusCode} | ConsecutiveFailures: {Failures}", 
                        correlationId, userId, response.StatusCode, _consecutiveFailures + 1);
                    Interlocked.Increment(ref _consecutiveFailures);
                    await WriteUnauthorizedResponse(context.HttpContext, "Security validation failed");
                    return;
                }

                var validationResult = await response.Content.ReadFromJsonAsync<SecurityStampValidationResponse>();
                
                if (validationResult?.Data?.IsValid != true)
                {
                    var reason = validationResult?.Data?.Reason ?? "Unknown";
                    _logger.LogWarning("❌ [SecurityStamp] VALIDATION FAILED | CorrelationId: {CorrelationId} | UserId: {UserId} | Reason: {Reason} | Action: USER LOGGED OUT", 
                        correlationId, userId, reason);
                    Interlocked.Exchange(ref _consecutiveFailures, 0); // Reset on successful call but invalid stamp
                    await WriteUnauthorizedResponse(
                        context.HttpContext, 
                        "Unauthorized - " + reason,
                        reason);
                    return;
                }

                // Success - reset failure counter
                Interlocked.Exchange(ref _consecutiveFailures, 0);
                _logger.LogInformation("✓ [SecurityStamp] VALIDATION SUCCESSFUL | CorrelationId: {CorrelationId} | UserId: {UserId} | Path: {Path} | Method: {Method}", 
                    correlationId, userId, requestPath, requestMethod);
            }
            catch (TaskCanceledException)
            {
                _logger.LogError("⏱️ [SecurityStamp] TIMEOUT | CorrelationId: {CorrelationId} | Timeout: 5s | ConsecutiveFailures: {Failures} | Action: DENY ACCESS", 
                    correlationId, _consecutiveFailures + 1);
                Interlocked.Increment(ref _consecutiveFailures);
                await WriteUnauthorizedResponse(context.HttpContext, "Security validation timeout");
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "🌐 [SecurityStamp] NETWORK ERROR | CorrelationId: {CorrelationId} | Error: {Message} | ConsecutiveFailures: {Failures} | Action: DENY ACCESS", 
                    correlationId, ex.Message, _consecutiveFailures + 1);
                Interlocked.Increment(ref _consecutiveFailures);
                await WriteUnauthorizedResponse(context.HttpContext, "Security validation service error");
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "📄 [SecurityStamp] JSON PARSING ERROR | CorrelationId: {CorrelationId} | Error: {Message} | ConsecutiveFailures: {Failures} | Action: DENY ACCESS", 
                    correlationId, ex.Message, _consecutiveFailures + 1);
                Interlocked.Increment(ref _consecutiveFailures);
                await WriteUnauthorizedResponse(context.HttpContext, "Security validation error");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 [SecurityStamp] UNEXPECTED ERROR | CorrelationId: {CorrelationId} | Type: {ExceptionType} | Message: {Message} | Action: DENY ACCESS", 
                    correlationId, ex.GetType().Name, ex.Message);
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
