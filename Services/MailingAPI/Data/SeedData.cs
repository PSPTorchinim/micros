using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Shared.Services.Database;
using Shared.Services.Security;

namespace MailingAPI.Data
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
            _logger.LogInformation("Initializing Mailing API data at {Time}", DateTime.UtcNow);
            
            // Seed permissions required by Mailing API
            await SeedPermissions();
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Mailing API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("mailing:read", "View mail templates and history"),
                new PermissionDefinition("mailing:send", "Send emails to users"),
                new PermissionDefinition("mailing:create", "Create new mail templates"),
                new PermissionDefinition("mailing:update", "Update mail templates"),
                new PermissionDefinition("mailing:delete", "Delete mail templates")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Mailing API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Mailing API permissions, service will continue but authorization may not work correctly");
            }
        }
    }
}