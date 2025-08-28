using Shared.Data.Specifications;
using System.Linq.Expressions;

namespace Shared.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<bool> Add(T entity);
        Task<bool> AddRange(List<T> entities);
        Task<int> Count(Expression<Func<T, bool>> expression);
        Task<int> Count(ISpecification<T> specification);
        Task<bool> Delete(T entity);
        Task<bool> DeleteRange(List<T> entities);
        Task<bool> Empty();
        Task<bool> Exists(Expression<Func<T, bool>> expression);
        Task<bool> Exists(ISpecification<T> specification);
        Task<List<T>> Get();
        Task<List<T>> Get(Expression<Func<T, bool>> expression);
        Task<List<T>> Get(ISpecification<T> specification);
        Task<bool> Update(T entity);
        Task<bool> UpdateRange(List<T> entities);
    }
}