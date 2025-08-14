using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Shared.Data.Specifications
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Criteria { get; }
        public List<Func<IQueryable<T>, IIncludableQueryable<T, object>>> Includes { get; }
        Expression<Func<T, object>> OrderBy { get; }
        Expression<Func<T, object>> OrderByDescending { get; }
    }
}
