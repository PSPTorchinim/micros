using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared.Data.Exceptions;
using Shared.Data.Specifications;
using System.Linq.Expressions;

namespace Shared.Repositories
{
    public class Repository<T, C> : IRepository<T> where T : class where C : DbContext
    {
        public readonly C _context;
        public readonly ILogger<IRepository<T>> _logger;

        public Repository(C context, ILogger<IRepository<T>> logger)
        {
            _context = context;
            _logger = logger;
        }

        #region Create
        public virtual async Task<bool> Add(T entity)
        {
            _logger.LogInformation("Adding entity of type {EntityType}", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var result = await _context.AddAsync(entity);
                result.State = EntityState.Added;
                var success = await _context.SaveChangesAsync() > 0;
                _logger.LogInformation("Entity of type {EntityType} added: {Success}", typeof(T).Name, success);
                return success;
            }, _logger);
        }

        public virtual async Task<bool> AddRange(List<T> entities)
        {
            _logger.LogInformation("Adding {Count} entities of type {EntityType}", entities.Count, typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                await _context.AddRangeAsync(entities);
                var success = await _context.SaveChangesAsync() > 0;
                _logger.LogInformation("{Count} entities of type {EntityType} added: {Success}", entities.Count, typeof(T).Name, success);
                return success;
            }, _logger);
        }
        #endregion

        #region Count
        public async Task<int> Count(Expression<Func<T, bool>> expression)
        {
            _logger.LogInformation("Counting entities of type {EntityType} with expression", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var count = await _context.Set<T>().CountAsync(expression);
                _logger.LogInformation("Counted {Count} entities of type {EntityType}", count, typeof(T).Name);
                return count;
            }, _logger);
        }

        public async Task<int> Count(ISpecification<T> specification)
        {
            _logger.LogInformation("Counting entities of type {EntityType} with specification", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var count = (await Get(specification)).Count();
                _logger.LogInformation("Counted {Count} entities of type {EntityType} with specification", count, typeof(T).Name);
                return count;
            }, _logger);
        }
        #endregion

        #region Delete
        public virtual async Task<bool> Delete(T entity)
        {
            _logger.LogInformation("Deleting entity of type {EntityType}", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var entry = _context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    _context.Attach(entity);
                }
                _context.Remove(entity);
                var success = await _context.SaveChangesAsync() > 0;
                _logger.LogInformation("Entity of type {EntityType} deleted: {Success}", typeof(T).Name, success);
                return success;
            }, _logger);
        }

        public virtual async Task<bool> DeleteRange(List<T> entities)
        {
            _logger.LogInformation("Deleting {Count} entities of type {EntityType}", entities.Count, typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                _context.RemoveRange(entities);
                var success = await _context.SaveChangesAsync() > 0;
                _logger.LogInformation("{Count} entities of type {EntityType} deleted: {Success}", entities.Count, typeof(T).Name, success);
                return success;
            }, _logger);
        }
        #endregion

        #region Empty
        public async Task<bool> Empty()
        {
            _logger.LogInformation("Checking if set of type {EntityType} is empty", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var isEmpty = !await _context.Set<T>().AnyAsync();
                _logger.LogInformation("Set of type {EntityType} is empty: {IsEmpty}", typeof(T).Name, isEmpty);
                return isEmpty;
            }, _logger);
        }
        #endregion

        #region Exists
        public async Task<bool> Exists(Expression<Func<T, bool>> expression)
        {
            _logger.LogInformation("Checking existence of entity of type {EntityType} with expression", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var exists = await _context.Set<T>().AnyAsync(expression);
                _logger.LogInformation("Entity of type {EntityType} exists: {Exists}", typeof(T).Name, exists);
                return exists;
            }, _logger);
        }

        public async Task<bool> Exists(ISpecification<T> specification)
        {
            _logger.LogInformation("Checking existence of entity of type {EntityType} with specification", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var exists = (await Get(specification)).Any();
                _logger.LogInformation("Entity of type {EntityType} exists with specification: {Exists}", typeof(T).Name, exists);
                return exists;
            }, _logger);
        }
        #endregion

        #region Read
        public virtual async Task<List<T>> Get()
        {
            _logger.LogInformation("Getting all entities of type {EntityType}", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var list = await _context.Set<T>().ToListAsync();
                _logger.LogInformation("Retrieved {Count} entities of type {EntityType}", list.Count, typeof(T).Name);
                return list;
            }, _logger);
        }

        public virtual async Task<List<T>> Get(Expression<Func<T, bool>> expression)
        {
            _logger.LogInformation("Getting entities of type {EntityType} with expression", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var list = await _context.Set<T>().Where(expression).ToListAsync();
                _logger.LogInformation("Retrieved {Count} entities of type {EntityType} with expression", list.Count, typeof(T).Name);
                return list;
            }, _logger);
        }

        public virtual async Task<List<T>> Get(ISpecification<T> specification)
        {
            _logger.LogInformation("Getting entities of type {EntityType} with specification", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var list = await SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), specification).ToListAsync();
                _logger.LogInformation("Retrieved {Count} entities of type {EntityType} with specification", list.Count, typeof(T).Name);
                return list;
            }, _logger);
        }
        #endregion

        #region Update
        public virtual async Task<bool> Update(T entity)
        {
            _logger.LogInformation("Updating entity of type {EntityType}", typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                var entry = _context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    _context.Attach(entity);
                }
                _context.Update(entity);
                var success = await _context.SaveChangesAsync() > 0;
                _logger.LogInformation("Entity of type {EntityType} updated: {Success}", typeof(T).Name, success);
                return success;
            }, _logger);
        }

        public virtual async Task<bool> UpdateRange(List<T> entities)
        {
            _logger.LogInformation("Updating {Count} entities of type {EntityType}", entities.Count, typeof(T).Name);
            return await ExceptionHandler.Handle(async () =>
            {
                _context.UpdateRange(entities);
                var success = await _context.SaveChangesAsync() > 0;
                _logger.LogInformation("{Count} entities of type {EntityType} updated: {Success}", entities.Count, typeof(T).Name, success);
                return success;
            }, _logger);
        }
        #endregion

    }
}
