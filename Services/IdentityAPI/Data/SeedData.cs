using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Microsoft.Extensions.Logging; // Add for logging
using Shared.Helpers;
using Shared.Services.Database;

namespace IdentityAPI.Data
{
    internal class SeedData : IDatabaseInitializer
    {
        private readonly IUsersRepository usersRepository;
        private readonly IRolesRepository rolesRepository;
        private readonly IPermissionsRepository permissionsRepository;
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<SeedData> _logger; // Add logger field

        public SeedData(IServiceProvider serviceProvider)
        {
            this.usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
            this.rolesRepository = serviceProvider.GetRequiredService<IRolesRepository>();
            this.permissionsRepository = serviceProvider.GetRequiredService<IPermissionsRepository>();
            this.serviceProvider = serviceProvider;
            this._logger = serviceProvider.GetService(typeof(ILogger<SeedData>)) as ILogger<SeedData>; // Assign logger
        }

        public async Task InitializeAsync()
        {
            _logger?.LogInformation("Starting database initialization at {Time}", DateTime.UtcNow);
            if (await permissionsRepository.Empty())
            {
                _logger?.LogInformation("Seeding permissions at {Time}", DateTime.UtcNow);
                await SeedPermissions();
            }
            if (await rolesRepository.Empty())
            {
                _logger?.LogInformation("Seeding roles at {Time}", DateTime.UtcNow);
                await SeedRoles();
            }
            if (await usersRepository.Empty())
            {
                _logger?.LogInformation("Seeding users at {Time}", DateTime.UtcNow);
                await SeedUsers();
            }
            _logger?.LogInformation("Database initialization completed at {Time}", DateTime.UtcNow);
        }

        private async Task SeedUsers()
        {
            _logger?.LogInformation("Seeding default user at {Time}", DateTime.UtcNow);
            try
            {
                await usersRepository.Add(new User()
                {
                    Email = "huberttroc@gmail.com",
                    Passwords = new List<Password>() {
                        new Password() { Value = "testPassword1234".computeHash() }
                    },
                    Roles = await rolesRepository.Get(x => x.Name.Equals("SuperOwner") || x.Name.Equals("CompanyOwner")),
                    Activated = true,
                    ActivationCode = StringHelper.GenerateRandomPassword(5)
                });
                _logger?.LogInformation("Default user seeded successfully at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to seed default user at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        private async Task SeedRoles()
        {
            _logger?.LogInformation("Seeding roles at {Time}", DateTime.UtcNow);
            try
            {
                await rolesRepository.Add(new Role()
                {
                    Name = "SuperOwner",
                    Description = "Full access to all functions",
                    Permissions = await permissionsRepository.Get()
                });
                _logger?.LogInformation("Roles seeded successfully at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to seed roles at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        private async Task SeedPermissions()
        {
            _logger?.LogInformation("Seeding permissions at {Time}", DateTime.UtcNow);
            try
            {
                new List<string>(["users", "permissions", "roles", "blocks", "company"]).ForEach(entry =>
                {
                    new List<string>(["read", "update", "delete"]).ForEach(command =>
                        {
                            permissionsRepository.Add(new Permission()
                            {
                                Name = $"{entry}:{command}",
                                Description = $"{command} {entry}"
                            }).Wait();
                            _logger?.LogDebug("Permission seeded: {Permission}", $"{entry}:{command}");

                            permissionsRepository.Add(new Permission()
                            {
                                Name = $"{entry}:{command}:all",
                                Description = $"{command} all {entry}"
                            }).Wait();
                            _logger?.LogDebug("Permission seeded: {Permission}", $"{entry}:{command}:all");
                        }
                    );

                    permissionsRepository.Add(new Permission()
                    {
                        Name = $"{entry}:create",
                        Description = $"create {entry}"
                    }).Wait();
                    _logger?.LogDebug("Permission seeded: {Permission}", $"{entry}:create");
                });

                permissionsRepository.Add(new Permission()
                {
                    Name = $"users:block",
                    Description = $"block users"
                }).Wait();
                _logger?.LogDebug("Permission seeded: users:block");

                _logger?.LogInformation("Permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to seed permissions at {Time}", DateTime.UtcNow);
                throw;
            }
        }
    }
}