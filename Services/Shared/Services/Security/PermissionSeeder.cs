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
        /// Seeds permissions in the Identity API if they don't exist
        /// </summary>
        /// <param name="permissions">List of permissions to seed</param>
        /// <returns>True if seeding was successful or permissions already exist</returns>
        public async Task<bool> SeedPermissionsAsync(IEnumerable<PermissionDefinition> permissions)
        {
            try
            {
                var identityApiUrl = Environment.GetEnvironmentVariable("IDENTITY_API_URL") ?? "http://identity:8080";
                _logger.LogInformation("Seeding {Count} permissions to Identity API at {Url}", permissions.Count(), identityApiUrl);

                var httpClient = _httpClientFactory.CreateClient();
                httpClient.BaseAddress = new Uri(identityApiUrl);

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

                _logger.LogInformation("Permission seeding completed");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to seed permissions");
                return false;
            }
        }

        private class PermissionDto
        {
            public Guid Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public string Description { get; set; } = string.Empty;
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
