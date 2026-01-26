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
        /// <returns>True if seeding was successful or permissions already exist</returns>
        public async Task<bool> SeedPermissionsAsync(IEnumerable<PermissionDefinition> permissions)
        {
            try
            {
                // Check for ASPNETCORE_IDENTITY_BE_ADDRESS first (matches APIGateway convention), fallback to IDENTITY_API_URL for backward compatibility
                var identityApiUrl = Environment.GetEnvironmentVariable("ASPNETCORE_IDENTITY_BE_ADDRESS") 
                    ?? Environment.GetEnvironmentVariable("IDENTITY_API_URL") 
                    ?? "http://identity:8080";
                var permissionList = permissions.ToList();
                _logger.LogInformation("Seeding {Count} permissions to Identity API at {Url} using batch operation", permissionList.Count, identityApiUrl);

                var httpClient = _httpClientFactory.CreateClient();
                httpClient.BaseAddress = new Uri(identityApiUrl);

                // Add service authentication if available
                var serviceApiKey = Environment.GetEnvironmentVariable("SERVICE_API_KEY");
                if (!string.IsNullOrEmpty(serviceApiKey))
                {
                    httpClient.DefaultRequestHeaders.Add("X-Service-API-Key", serviceApiKey);
                    _logger.LogDebug("Using service API key for authentication");
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
                else
                {
                    _logger.LogWarning("Batch permission seeding failed with status: {StatusCode}", createResponse.StatusCode);
                    _logger.LogDebug("Response: {Response}", await createResponse.Content.ReadAsStringAsync());
                    
                    // Fallback to individual seeding if batch endpoint is not available (404)
                    if (createResponse.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        _logger.LogInformation("Batch endpoint not available, falling back to individual seeding");
                        return await SeedPermissionsIndividuallyAsync(httpClient, permissionList);
                    }
                    
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to seed permissions using batch operation");
                return false;
            }
        }

        /// <summary>
        /// Fallback method to seed permissions individually if batch endpoint is unavailable
        /// </summary>
        private async Task<bool> SeedPermissionsIndividuallyAsync(HttpClient httpClient, List<PermissionDefinition> permissions)
        {
            _logger.LogInformation("Seeding {Count} permissions individually", permissions.Count);

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
                            continue;
                        }
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
                    }
                    else if (createResponse.StatusCode == System.Net.HttpStatusCode.Conflict)
                    {
                        _logger.LogDebug("Permission {Permission} already exists (conflict), skipping", permission.Name);
                    }
                    else
                    {
                        _logger.LogWarning("Failed to seed permission {Permission}: {StatusCode}", 
                            permission.Name, createResponse.StatusCode);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Error seeding permission {Permission}, continuing with others", permission.Name);
                }
            }

            _logger.LogInformation("Individual permission seeding completed");
            return true;
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
