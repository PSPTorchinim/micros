using IdentityAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Data.Specifications;
using System.Linq.Expressions;

namespace IdentityAPI.Data.Specifications
{
    public class UserWithRolesAndPermissions : BaseSpecifcation<User>
    {
        public UserWithRolesAndPermissions()
        {
            AddInclude(x => x.Include(u => u.Passwords).Include(u => u.Blocks).Include(u => u.Roles).ThenInclude(r => r.Permissions));
        }

        public UserWithRolesAndPermissions(Expression<Func<User, bool>> criteria) : base(criteria)
        {
            AddInclude(x => x.Include(u => u.Passwords).Include(u => u.Blocks).Include(u => u.Roles).ThenInclude(r => r.Permissions));
        }
    }
}
