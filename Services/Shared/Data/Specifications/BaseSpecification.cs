using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Shared.Data.Specifications
{
    public class BaseSpecifcation<T> : ISpecification<T>
    {

        public Expression<Func<T, bool>> Criteria { get; }
        public List<Func<IQueryable<T>, IIncludableQueryable<T, object>>> Includes { get; } = new();
        public Expression<Func<T, object>> OrderBy { get; private set; }
        public Expression<Func<T, object>> OrderByDescending { get; private set; }

        public BaseSpecifcation()
        {
        }

        public BaseSpecifcation(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        protected void AddInclude(Func<IQueryable<T>, IIncludableQueryable<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        protected void AddOrderBy(Expression<Func<T, object>> orderByExpression)
        {
            OrderBy = orderByExpression;
        }

        protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
        {
            OrderByDescending = orderByDescExpression;
        }
    }
}