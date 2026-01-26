using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Microsoft.EntityFrameworkCore;
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
        private readonly IDbContextFactory<IdentityContext> _contextFactory;

        public SeedData(IServiceProvider serviceProvider)
        {
            this.usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
            this.rolesRepository = serviceProvider.GetRequiredService<IRolesRepository>();
            this.permissionsRepository = serviceProvider.GetRequiredService<IPermissionsRepository>();
            this.serviceProvider = serviceProvider;
            this._logger = serviceProvider.GetRequiredService<ILogger<SeedData>>();
            this._contextFactory = serviceProvider.GetRequiredService<IDbContextFactory<IdentityContext>>();
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
                    _logger?.LogInformation("User with email already exists, checking role assignment at {Time}", DateTime.UtcNow);
                    
                    // Check if user already has roles assigned
                    var existingUser = existingUsers.First();
                    if (existingUser.Roles != null && existingUser.Roles.Any())
                    {
                        _logger?.LogInformation("User already has {Count} roles assigned, skipping seed at {Time}", existingUser.Roles.Count, DateTime.UtcNow);
                        return;
                    }
                    
                    // User exists but has no roles, assign them
                    _logger?.LogInformation("User exists but has no roles, assigning roles at {Time}", DateTime.UtcNow);
                    var roles = await rolesRepository.Get();
                    _logger?.LogInformation("Retrieved {Count} roles for existing user", roles.Count);
                    
                    // Clear and add roles to ensure proper tracking
                    existingUser.Roles = new List<Role>(roles);
                    await usersRepository.Update(existingUser);
                    _logger?.LogInformation("Roles assigned to existing user successfully at {Time}", DateTime.UtcNow);
                    return;
                }

                // Create user with roles in a single operation
                var allRoles = await rolesRepository.Get();
                _logger?.LogInformation("Retrieved {Count} roles for new user", allRoles.Count);
                
                var newUser = new User()
                {
                    Email = email,
                    Passwords = new List<Password>() {
                        new Password() { Value = password.computeHash(12) } // Use BCrypt work factor 12
                    },
                    Activated = true,
                    ActivationCode = StringHelper.GenerateRandomPassword(5),
                    SecurityStamp = Guid.NewGuid().ToString("N"),
                    LastPasswordChangeDate = DateTime.UtcNow,
                    Roles = new List<Role>(allRoles) // Assign roles immediately
                };
                
                await usersRepository.Add(newUser);
                _logger?.LogInformation("Default user created with {Count} roles at {Time}", allRoles.Count, DateTime.UtcNow);
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
                // Use a single DbContext for the entire operation to ensure proper entity tracking
                await using var context = await _contextFactory.CreateDbContextAsync();
                
                // Check if SuperOwner role already exists with all permissions
                var existingRole = await context.Set<Role>()
                    .Include(r => r.Permissions)
                    .FirstOrDefaultAsync(x => x.Name == "SuperOwner");
                
                if (existingRole != null)
                {
                    _logger?.LogInformation("SuperOwner role already exists, updating permissions at {Time}", DateTime.UtcNow);
                    
                    // Get all permissions in the same context
                    var allPermissions = await context.Set<Permission>().ToListAsync();
                    _logger?.LogInformation("Retrieved {Count} permissions for SuperOwner role", allPermissions.Count);
                    
                    // Update permissions - EF Core will track changes properly since all entities are in the same context
                    existingRole.Permissions = allPermissions;
                    await context.SaveChangesAsync();
                    _logger?.LogInformation("Permissions updated for SuperOwner role successfully at {Time}", DateTime.UtcNow);
                    return;
                }

                // Create role with all permissions in a single transaction
                var newRole = new Role()
                {
                    Name = "SuperOwner",
                    Description = "Full access to all functions"
                };
                
                try
                {
                    // Get all permissions in the same context
                    var allPermissions = await context.Set<Permission>().ToListAsync();
                    _logger?.LogInformation("Retrieved {Count} permissions for new SuperOwner role", allPermissions.Count);
                    
                    // Assign permissions before adding - this ensures the junction table entries are created
                    newRole.Permissions = allPermissions;
                    
                    context.Add(newRole);
                    await context.SaveChangesAsync();
                    
                    _logger?.LogInformation("SuperOwner role created with {Count} permissions at {Time}", allPermissions.Count, DateTime.UtcNow);
                }
                catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("PK_Roles") == true || 
                                                     ex.InnerException?.Message?.Contains("duplicate key") == true)
                {
                    _logger?.LogWarning("SuperOwner role already exists (caught duplicate key exception), updating permissions at {Time}", DateTime.UtcNow);
                    
                    // Clear the context to reset change tracker
                    context.ChangeTracker.Clear();
                    
                    // Reload the existing role with permissions in the same context
                    existingRole = await context.Set<Role>()
                        .Include(r => r.Permissions)
                        .FirstOrDefaultAsync(x => x.Name == "SuperOwner");
                        
                    if (existingRole != null)
                    {
                        var allPermissions = await context.Set<Permission>().ToListAsync();
                        existingRole.Permissions = allPermissions;
                        await context.SaveChangesAsync();
                        _logger?.LogInformation("Permissions updated for existing SuperOwner role at {Time}", DateTime.UtcNow);
                    }
                }
                
                _logger?.LogInformation("Roles seeded successfully at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to seed roles at {Time}", DateTime.UtcNow);
                // Don't re-throw - this makes the seeding idempotent and won't fail on subsequent runs
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