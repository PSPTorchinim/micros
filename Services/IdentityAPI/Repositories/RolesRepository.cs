using IdentityAPI.Data;
using IdentityAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Repositories;

namespace IdentityAPI.Repositories
{
    public class RolesRepository : Repository<Role, IdentityContext>, IRolesRepository
    {
        public RolesRepository(IDbContextFactory<IdentityContext> context, ILogger<IRolesRepository> logger) : base(context, logger)
        {
        }

        public override async Task<bool> Add(Role entity)
        {
            _logger.LogInformation("Adding role with permissions handling");
            return await Shared.Data.Exceptions.ExceptionHandler.Handle(async () =>
            {
                await using var context = await _factory.CreateDbContextAsync();
                
                // Attach existing permissions to the context and mark as unchanged
                if (entity.Permissions != null && entity.Permissions.Any())
                {
                    foreach (var permission in entity.Permissions)
                    {
                        var entry = context.Entry(permission);
                        if (entry.State == EntityState.Detached)
                        {
                            context.Attach(permission);
                            entry.State = EntityState.Unchanged;
                        }
                    }
                }
                
                await context.AddAsync(entity);
                return await context.SaveChangesAsync() > 0;
            }, _logger);
        }

        public override async Task<bool> Update(Role entity)
        {
            _logger.LogInformation("Updating role with permissions handling");
            return await Shared.Data.Exceptions.ExceptionHandler.Handle(async () =>
            {
                await using var context = await _factory.CreateDbContextAsync();
                
                // Attach the role entity
                var entry = context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    context.Attach(entity);
                }
                
                // Attach existing permissions to the context and mark as unchanged
                if (entity.Permissions != null && entity.Permissions.Any())
                {
                    foreach (var permission in entity.Permissions)
                    {
                        var permEntry = context.Entry(permission);
                        if (permEntry.State == EntityState.Detached)
                        {
                            context.Attach(permission);
                            permEntry.State = EntityState.Unchanged;
                        }
                    }
                }
                
                context.Update(entity);
                return await context.SaveChangesAsync() > 0;
            }, _logger);
        }
    }

    public interface IRolesRepository : IRepository<Role>
    {
    }
}
