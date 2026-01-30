using Shared.Services.Database;
using Shared.Services.Security;

namespace EquipmentAPI.Data
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
            _logger.LogInformation("Initializing Equipment API data at {Time}", DateTime.UtcNow);
            
            // Seed permissions required by Equipment API
            await SeedPermissions();
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Equipment API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("equipment:read", "View equipment details and lists"),
                new PermissionDefinition("equipment:update", "Update equipment information"),
                new PermissionDefinition("equipment:delete", "Delete equipment"),
                new PermissionDefinition("equipment:create", "Create new equipment")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Equipment API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Equipment API permissions, service will continue but authorization may not work correctly");
            }
        }
    }
}