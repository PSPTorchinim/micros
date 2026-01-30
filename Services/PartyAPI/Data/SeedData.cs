using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Shared.Services.Database;
using Shared.Services.Security;

namespace PartyAPI.Data
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
            _logger.LogInformation("Initializing Party API data at {Time}", DateTime.UtcNow);
            
            // Seed permissions required by Party API
            await SeedPermissions();
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Party API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("party:read", "View party and event details"),
                new PermissionDefinition("party:update", "Update party and event information"),
                new PermissionDefinition("party:delete", "Delete parties and events"),
                new PermissionDefinition("party:create", "Create new parties and events")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Party API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Party API permissions, service will continue but authorization may not work correctly");
            }
        }
    }
}