using IdentityAPI.Data;
using IdentityAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Repositories;

namespace IdentityAPI.Repositories
{
    public class PermissionsRepository : Repository<Permission, IdentityContext>, IPermissionsRepository
    {
        public PermissionsRepository(IDbContextFactory<IdentityContext> context, ILogger<IPermissionsRepository> logger) : base(context, logger)
        {
        }
    }

    public interface IPermissionsRepository : IRepository<Permission>
    {
    }
}
