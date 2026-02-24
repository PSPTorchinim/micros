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
                
                // Load the existing user with roles from database
                var existingUser = await context.Users
                    .Include(u => u.Roles)
                    .FirstOrDefaultAsync(u => u.Id == entity.Id);
                
                if (existingUser == null)
                {
                    // User doesn't exist, use standard update
                    var entry = context.Entry(entity);
                    if (entry.State == EntityState.Detached)
                    {
                        context.Attach(entity);
                    }
                    context.Update(entity);
                }
                else
                {
                    // Update user properties
                    context.Entry(existingUser).CurrentValues.SetValues(entity);
                    
                    // Only update roles if the entity has roles set
                    // (indicating this is a role update operation)
                    if (entity.Roles != null)
                    {
                        // Clear existing roles
                        existingUser.Roles.Clear();
                        
                        // Add new roles if any
                        if (entity.Roles.Any())
                        {
                            // Load the roles from the database to avoid tracking conflicts
                            var roleIds = entity.Roles.Select(r => r.Id).ToList();
                            var rolesToAdd = await context.Roles
                                .Where(r => roleIds.Contains(r.Id))
                                .ToListAsync();
                            
                            foreach (var role in rolesToAdd)
                            {
                                existingUser.Roles.Add(role);
                            }
                        }
                    }
                }
                
                return await context.SaveChangesAsync() > 0;
            }, _logger);
        }
    }

    public interface IUsersRepository : IRepository<User>
    {
        new Task<List<User>> Get(Expression<Func<User, bool>> expression);
    }
}
