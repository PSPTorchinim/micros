using IdentityAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Data.Specifications;
using System.Linq.Expressions;

namespace IdentityAPI.Data.Specifications
{
    public class RoleWithUsersSpec : BaseSpecifcation<Role>
    {
        public RoleWithUsersSpec(Expression<Func<Role, bool>> criteria) : base(criteria)
        {
            AddInclude(x => x.Include(r => r.Users));
        }
    }
}
