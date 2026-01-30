using Shared.Services.Database;
using Shared.Services.Security;

namespace Music.Data
{
    public class SeedData : IDatabaseInitializer
    {
        private readonly PermissionSeeder _permissionSeeder;
        private readonly ILogger<SeedData> _logger;

        public SeedData(PermissionSeeder permissionSeeder, ILogger<SeedData> logger)
        {
            _permissionSeeder = permissionSeeder;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            _logger.LogInformation("Initializing Music API data at {Time}", DateTime.UtcNow);
            
            // Seed permissions required by Music API
            await SeedPermissions();
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Music API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("music:read", "View music library and playlists"),
                new PermissionDefinition("music:update", "Update music metadata and playlists"),
                new PermissionDefinition("music:delete", "Delete music tracks and playlists"),
                new PermissionDefinition("music:create", "Upload new music and create playlists")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Music API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Music API permissions, service will continue but authorization may not work correctly");
            }
        }
    }
}