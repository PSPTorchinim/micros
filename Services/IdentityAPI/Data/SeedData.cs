using IdentityAPI.Entities;
using IdentityAPI.Repositories;
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
            this._logger = serviceProvider.GetRequiredService<ILogger<SeedData>>();
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
        }

        private async Task SeedUsers()
        {
            _logger?.LogInformation("Seeding default user at {Time}", DateTime.UtcNow);
            try
            {
                var email = Environment.GetEnvironmentVariable("ASPNETCORE_DJPANEL_USER_EMAIL");
                if (string.IsNullOrEmpty(email))
                {
                    throw new Exception("ASPNETCORE_DJPANEL_USER_EMAIL environment variable is not set.");
                }
                var password = Environment.GetEnvironmentVariable("ASPNETCORE_DJPANEL_USER_PASSWORD");
                if (string.IsNullOrEmpty(password))
                {
                    throw new Exception("ASPNETCORE_DJPANEL_USER_PASSWORD environment variable is not set.");
                }

                // Check if user with this email already exists
                var existingUsers = await usersRepository.Get(x => x.Email == email);
                if (existingUsers.Any())
                {
                    _logger?.LogInformation("User with email {Email} already exists, skipping seed at {Time}", email, DateTime.UtcNow);
                    return;
                }

                var roles = await rolesRepository.Get(x => x.Name.Equals("SuperOwner") || x.Name.Equals("CompanyOwner"));
                _logger?.LogInformation("Retrieved {Count} roles for default user", roles.Count);
                
                await usersRepository.Add(new User()
                {

                    Email = email,
                    Passwords = new List<Password>() {
                        new Password() { Value = password.computeHash() }
                    },
                    Roles = roles,
                    Activated = true,
                    ActivationCode = StringHelper.GenerateRandomPassword(5),
                    SecurityStamp = Guid.NewGuid().ToString("N"),
                    LastPasswordChangeDate = DateTime.UtcNow
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
                // Check if SuperOwner role already exists
                var existingRole = await rolesRepository.Get(x => x.Name == "SuperOwner");
                if (existingRole.Any())
                {
                    _logger?.LogInformation("SuperOwner role already exists, skipping seed at {Time}", DateTime.UtcNow);
                    return;
                }

                // Create role without permissions first
                var newRole = new Role()
                {
                    Name = "SuperOwner",
                    Description = "Full access to all functions"
                };
                
                await rolesRepository.Add(newRole);
                _logger?.LogInformation("SuperOwner role created at {Time}", DateTime.UtcNow);

                // Get the created role and assign permissions
                var createdRole = (await rolesRepository.Get(x => x.Name == "SuperOwner")).First();
                var allPermissions = await permissionsRepository.Get();
                _logger?.LogInformation("Retrieved {Count} permissions for SuperOwner role", allPermissions.Count);
                
                createdRole.Permissions = allPermissions;
                await rolesRepository.Update(createdRole);
                _logger?.LogInformation("Permissions assigned to SuperOwner role successfully at {Time}", DateTime.UtcNow);
                
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
                // Check existing permissions to avoid duplicates
                var existingPermissions = await permissionsRepository.Get();
                var existingPermissionNames = new HashSet<string>(existingPermissions.Select(p => p.Name));
                
                if (existingPermissionNames.Any())
                {
                    _logger?.LogInformation("Found {Count} existing permissions, will skip duplicates", existingPermissionNames.Count);
                }

                // Build list of permissions first to avoid race conditions
                var permissions = new List<Permission>();
                
                foreach (var entry in new List<string>(["users", "permissions", "roles", "blocks", "company"]))
                {
                    foreach (var command in new List<string>(["read", "update", "delete"]))
                    {
                        var permName = $"{entry}:{command}";
                        if (!existingPermissionNames.Contains(permName))
                        {
                            permissions.Add(new Permission()
                            {
                                Name = permName,
                                Description = $"{command} {entry}"
                            });
                        }

                        var permNameAll = $"{entry}:{command}:all";
                        if (!existingPermissionNames.Contains(permNameAll))
                        {
                            permissions.Add(new Permission()
                            {
                                Name = permNameAll,
                                Description = $"{command} all {entry}"
                            });
                        }
                    }

                    var createPermName = $"{entry}:create";
                    if (!existingPermissionNames.Contains(createPermName))
                    {
                        permissions.Add(new Permission()
                        {
                            Name = createPermName,
                            Description = $"create {entry}"
                        });
                    }
                }

                var blockPermName = "users:block";
                if (!existingPermissionNames.Contains(blockPermName))
                {
                    permissions.Add(new Permission()
                    {
                        Name = blockPermName,
                        Description = "block users"
                    });
                }

                if (!permissions.Any())
                {
                    _logger?.LogInformation("All permissions already exist, skipping seed at {Time}", DateTime.UtcNow);
                    return;
                }

                _logger?.LogInformation("Seeding {Count} new permissions", permissions.Count);
                
                // Add all permissions sequentially to avoid duplicate key issues
                foreach (var permission in permissions)
                {
                    await permissionsRepository.Add(permission);
                    _logger?.LogDebug("Permission seeded: {Permission}", permission.Name);
                }

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