using IdentityAPI.Data;
using IdentityAPI.Entities;
using Shared.Repositories;

namespace IdentityAPI.Repositories
{
    public class RolesRepository : Repository<Role, IdentityContext>, IRolesRepository
    {
        public RolesRepository(IdentityContext context, ILogger<IRolesRepository> logger) : base(context, logger)
        {
        }
    }

    public interface IRolesRepository : IRepository<Role>
    {
    }
}
