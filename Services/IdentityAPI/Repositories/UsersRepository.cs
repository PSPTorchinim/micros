using IdentityAPI.Data;
using IdentityAPI.Data.Specifications;
using IdentityAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Repositories;
using System.Linq.Expressions;

namespace IdentityAPI.Repositories
{
    public class UsersRepository : Repository<User, IdentityContext>, IUsersRepository
    {
        public UsersRepository(IDbContextFactory<IdentityContext> context, ILogger<IUsersRepository> logger) : base(context, logger)
        {
        }

        public override async Task<List<User>> Get(Expression<Func<User, bool>> expression)
        {
            _logger.LogInformation("UsersRepository.Get called with expression: {Expression} at {Time}", expression, DateTime.UtcNow);
            try
            {
                var config = new UserWithRolesAndPermissions(expression);
                var result = await base.Get(config);
                _logger.LogInformation("UsersRepository.Get succeeded with {Count} users at {Time}", result?.Count, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UsersRepository.Get failed at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        public override async Task<bool> Update(User entity)
        {
            _logger.LogInformation("Updating user with roles handling");
            return await Shared.Data.Exceptions.ExceptionHandler.Handle(async () =>
            {
                await using var context = await _factory.CreateDbContextAsync();
                
                // Attach the user entity
                var entry = context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    context.Attach(entity);
                }
                
                // Attach existing roles to the context and mark as unchanged
                if (entity.Roles != null && entity.Roles.Any())
                {
                    foreach (var role in entity.Roles)
                    {
                        var roleEntry = context.Entry(role);
                        if (roleEntry.State == EntityState.Detached)
                        {
                            context.Attach(role);
                            roleEntry.State = EntityState.Unchanged;
                        }
                    }
                }
                
                context.Update(entity);
                return await context.SaveChangesAsync() > 0;
            }, _logger);
        }
    }

    public interface IUsersRepository : IRepository<User>
    {
        new Task<List<User>> Get(Expression<Func<User, bool>> expression);
    }
}
