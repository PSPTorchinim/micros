using IdentityAPI.Data;
using IdentityAPI.Data.Specifications;
using IdentityAPI.Entities;
using Shared.Repositories;
using System.Linq.Expressions;

namespace IdentityAPI.Repositories
{
    public class UsersRepository : Repository<User, IdentityContext>, IUsersRepository
    {
        public UsersRepository(IdentityContext context, ILogger<IUsersRepository> logger) : base(context, logger)
        {
        }

        public override async Task<List<User>> Get(Expression<Func<User, bool>> expression)
        {
            _logger.LogInformation("UsersRepository.Get called with expression: {Expression} at {Time}", expression, DateTime.UtcNow);
            try
            {
                var config = new UserWithRolesAndPermissions(expression);
                var result = await Get(config);
                _logger.LogInformation("UsersRepository.Get succeeded with {Count} users at {Time}", result?.Count, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UsersRepository.Get failed at {Time}", DateTime.UtcNow);
                throw;
            }
        }
    }

    public interface IUsersRepository : IRepository<User>
    {
        new Task<List<User>> Get(Expression<Func<User, bool>> expression);
    }
}
