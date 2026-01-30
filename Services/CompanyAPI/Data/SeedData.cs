using Shared.Services.Database;
using Shared.Services.Security;

namespace CompanyAPI.Data
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
            _logger.LogInformation("Initializing Company API data at {Time}", DateTime.UtcNow);
            
            // Seed permissions required by Company API
            await SeedPermissions();
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Company API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("company:read", "View company details, users, and structure"),
                new PermissionDefinition("company:update", "Update company details and structure"),
                new PermissionDefinition("company:users:manage", "Add and remove users from the company")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Company API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Company API permissions, service will continue but authorization may not work correctly");
            }
        }
    }
}