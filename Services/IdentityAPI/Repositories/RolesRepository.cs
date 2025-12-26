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
    }

    public interface IRolesRepository : IRepository<Role>
    {
    }
}
