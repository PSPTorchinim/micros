using System.Net.Http.Json;
using Microsoft.Extensions.Logging;

namespace Shared.Services.Security
{
    /// <summary>
    /// Seeds permissions in the Identity API for a microservice
    /// </summary>
    public class PermissionSeeder
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<PermissionSeeder> _logger;

        public PermissionSeeder(IHttpClientFactory httpClientFactory, ILogger<PermissionSeeder> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        /// <summary>
        /// Seeds permissions in the Identity API if they don't exist (batch operation)
        /// </summary>
        /// <param name="permissions">List of permissions to seed</param>
        /// <param name="maxRetries">Maximum number of retry attempts (default: 3)</param>
        /// <param name="initialDelayMs">Initial delay in milliseconds before first retry (default: 2000)</param>
        /// <returns>True if seeding was successful or permissions already exist</returns>
        public async Task<bool> SeedPermissionsAsync(IEnumerable<PermissionDefinition> permissions, int maxRetries = 3, int initialDelayMs = 2000)
        {
            var permissionList = permissions.ToList();
            
            for (int attempt = 0; attempt <= maxRetries; attempt++)
            {
                try
                {
                    // Check for ASPNETCORE_IDENTITY_BE_ADDRESS first (matches APIGateway convention), fallback to IDENTITY_API_URL for backward compatibility
                    var identityApiUrl = Environment.GetEnvironmentVariable("ASPNETCORE_IDENTITY_BE_ADDRESS") 
                        ?? Environment.GetEnvironmentVariable("IDENTITY_API_URL") 
                        ?? "http://identity:8080";
                    
                    if (attempt == 0)
                    {
                        _logger.LogInformation("Seeding {Count} permissions to Identity API at {Url} using batch operation", permissionList.Count, identityApiUrl);
                    }
                    else
                    {
                        _logger.LogInformation("Retry attempt {Attempt}/{MaxRetries} for permission seeding", attempt, maxRetries);
                    }

                    var httpClient = _httpClientFactory.CreateClient();
                    httpClient.BaseAddress = new Uri(identityApiUrl);
                    httpClient.Timeout = TimeSpan.FromSeconds(10);

                    // Add service authentication if available
                    var serviceApiKey = Environment.GetEnvironmentVariable("SERVICE_API_KEY");
                    if (!string.IsNullOrEmpty(serviceApiKey))
                    {
                        httpClient.DefaultRequestHeaders.Add("X-Service-API-Key", serviceApiKey);
                        if (attempt == 0)
                        {
                            _logger.LogDebug("Using service API key for authentication");
                        }
                    }
                    else
                    {
                        _logger.LogWarning("SERVICE_API_KEY environment variable not set - authentication will fail");
                    }

                    // Add secure_key header for SecureMiddleware (required for all /api requests)
                    var secureKey = Environment.GetEnvironmentVariable("ASPNETCORE_SECURE_KEY");
                    if (!string.IsNullOrEmpty(secureKey))
                    {
                        httpClient.DefaultRequestHeaders.Add("secure_key", secureKey);
                        if (attempt == 0)
                        {
                            _logger.LogDebug("Using secure key for SecureMiddleware authentication");
                        }
                    }
                    else
                    {
                        _logger.LogWarning("ASPNETCORE_SECURE_KEY environment variable not set - requests may be rejected by SecureMiddleware");
                    }

                    // First, check if Identity API is available with a health check
                    try
                    {
                        var healthResponse = await httpClient.GetAsync("/healthz/live");
                        if (!healthResponse.IsSuccessStatusCode)
                        {
                            _logger.LogWarning("Identity API health check failed, will retry");
                            throw new HttpRequestException($"Identity API not ready: {healthResponse.StatusCode}");
                        }
                    }
                    catch (HttpRequestException ex) when (attempt < maxRetries)
                    {
                        _logger.LogWarning("Identity API not yet available: {Message}", ex.Message);
                        await Task.Delay(initialDelayMs * (int)Math.Pow(2, attempt));
                        continue;
                    }

                    // Batch create permissions
                    var batchRequest = permissionList.Select(p => new
                    {
                        name = p.Name,
                        description = p.Description
                    }).ToList();

                    var createResponse = await httpClient.PostAsJsonAsync("/api/v1/Permissions/batch", batchRequest);

                    if (createResponse.IsSuccessStatusCode)
                    {
                        var result = await createResponse.Content.ReadFromJsonAsync<BatchPermissionResult>();
                        
                        if (result != null)
                        {
                            _logger.LogInformation("Successfully seeded {Created} permissions, {Skipped} already existed", 
                                result.Created, result.Skipped);
                            
                            foreach (var createdPermission in result.CreatedPermissions)
                            {
                                _logger.LogDebug("Created permission: {Permission}", createdPermission);
                            }
                            
                            foreach (var skippedPermission in result.SkippedPermissions)
                            {
                                _logger.LogDebug("Skipped existing permission: {Permission}", skippedPermission);
                            }
                        }
                        else
                        {
                            _logger.LogInformation("Batch permission seeding completed successfully");
                        }
                        
                        return true;
                    }
                    else if (createResponse.StatusCode == System.Net.HttpStatusCode.Unauthorized && attempt < maxRetries)
                    {
                        // Unauthorized might mean Identity API is still starting up
                        _logger.LogWarning("Unauthorized response from Identity API - will retry (API may still be initializing)");
                        var responseContent = await createResponse.Content.ReadAsStringAsync();
                        _logger.LogDebug("Response: {Response}", responseContent);
                        await Task.Delay(initialDelayMs * (int)Math.Pow(2, attempt));
                        continue;
                    }
                    else if (createResponse.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        // Fallback to individual seeding if batch endpoint is not available
                        _logger.LogInformation("Batch endpoint not available, falling back to individual seeding");
                        return await SeedPermissionsIndividuallyAsync(httpClient, permissionList);
                    }
                    else
                    {
                        _logger.LogWarning("Batch permission seeding failed with status: {StatusCode}", createResponse.StatusCode);
                        var responseContent = await createResponse.Content.ReadAsStringAsync();
                        _logger.LogWarning("Response: {Response}", responseContent);
                        
                        if (attempt < maxRetries)
                        {
                            await Task.Delay(initialDelayMs * (int)Math.Pow(2, attempt));
                            continue;
                        }
                        
                        return false;
                    }
                }
                catch (HttpRequestException ex) when (attempt < maxRetries)
                {
                    _logger.LogWarning(ex, "Failed to connect to Identity API, attempt {Attempt}/{MaxRetries}", attempt + 1, maxRetries + 1);
                    await Task.Delay(initialDelayMs * (int)Math.Pow(2, attempt));
                }
                catch (TaskCanceledException ex) when (attempt < maxRetries)
                {
                    _logger.LogWarning(ex, "Request to Identity API timed out, attempt {Attempt}/{MaxRetries}", attempt + 1, maxRetries + 1);
                    await Task.Delay(initialDelayMs * (int)Math.Pow(2, attempt));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to seed permissions using batch operation on attempt {Attempt}/{MaxRetries}", attempt + 1, maxRetries + 1);
                    
                    if (attempt >= maxRetries)
                    {
                        return false;
                    }
                    
                    await Task.Delay(initialDelayMs * (int)Math.Pow(2, attempt));
                }
            }
            
            _logger.LogError("All retry attempts exhausted for permission seeding");
            return false;
        }

        /// <summary>
        /// Fallback method to seed permissions individually if batch endpoint is unavailable
        /// </summary>
        private async Task<bool> SeedPermissionsIndividuallyAsync(HttpClient httpClient, List<PermissionDefinition> permissions)
        {
            _logger.LogInformation("Seeding {Count} permissions individually", permissions.Count);
            
            // Wait a bit longer for Identity API to fully initialize all endpoints
            _logger.LogInformation("Waiting for Identity API to fully initialize all endpoints...");
            await Task.Delay(3000); // 3 second delay before attempting individual seeding
            
            // Verify health again after delay
            try
            {
                var healthResponse = await httpClient.GetAsync("/healthz/live");
                if (!healthResponse.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Identity API health check failed after waiting, endpoints may not be ready");
                }
                else
                {
                    _logger.LogInformation("Identity API health check passed, proceeding with individual permission seeding");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Health check failed before individual seeding, will attempt anyway");
            }

            int successCount = 0;
            int skipCount = 0;
            int failCount = 0;

            foreach (var permission in permissions)
            {
                try
                {
                    // Check if permission exists
                    var checkResponse = await httpClient.GetAsync($"/api/v1/Permissions?name={Uri.EscapeDataString(permission.Name)}");
                    
                    if (checkResponse.IsSuccessStatusCode)
                    {
                        var existingPermissions = await checkResponse.Content.ReadFromJsonAsync<List<PermissionDto>>();
                        if (existingPermissions != null && existingPermissions.Any())
                        {
                            _logger.LogDebug("Permission {Permission} already exists, skipping", permission.Name);
                            skipCount++;
                            continue;
                        }
                    }
                    else if (checkResponse.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        _logger.LogWarning("Permission endpoint returned NotFound - Identity API may not have permission management endpoints available");
                        failCount++;
                        continue;
                    }

                    // Create permission
                    var createResponse = await httpClient.PostAsJsonAsync("/api/v1/Permissions", new
                    {
                        name = permission.Name,
                        description = permission.Description
                    });

                    if (createResponse.IsSuccessStatusCode)
                    {
                        _logger.LogInformation("Successfully seeded permission: {Permission}", permission.Name);
                        successCount++;
                    }
                    else if (createResponse.StatusCode == System.Net.HttpStatusCode.Conflict)
                    {
                        _logger.LogDebug("Permission {Permission} already exists (conflict), skipping", permission.Name);
                        skipCount++;
                    }
                    else if (createResponse.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        _logger.LogWarning("Failed to seed permission {Permission}: NotFound - Permission endpoints may not be implemented in Identity API", 
                            permission.Name);
                        failCount++;
                    }
                    else
                    {
                        _logger.LogWarning("Failed to seed permission {Permission}: {StatusCode}", 
                            permission.Name, createResponse.StatusCode);
                        failCount++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error seeding permission {Permission}, continuing with others", permission.Name);
                    failCount++;
                }
            }

            _logger.LogInformation("Individual permission seeding completed: {Success} created, {Skip} skipped, {Fail} failed", 
                successCount, skipCount, failCount);
            
            // Return true if we had any success or skips (permissions exist), false only if all failed
            return successCount > 0 || skipCount > 0 || failCount == 0;
        }

        private class PermissionDto
        {
            public Guid Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
        }

        private class BatchPermissionResult
        {
            public int Created { get; set; }
            public int Skipped { get; set; }
            public List<string> CreatedPermissions { get; set; } = new();
            public List<string> SkippedPermissions { get; set; } = new();
        }
    }

    /// <summary>
    /// Definition of a permission to be seeded
    /// </summary>
    public class PermissionDefinition
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public PermissionDefinition(string name, string description)
        {
            Name = name;
            Description = description;
        }
    }
}
