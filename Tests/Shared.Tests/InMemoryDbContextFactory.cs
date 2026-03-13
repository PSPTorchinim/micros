using Microsoft.EntityFrameworkCore;

namespace Shared.Tests
{
    /// <summary>
    /// A reusable in-memory <see cref="IDbContextFactory{TContext}"/> for integration tests.
    /// Each factory instance is backed by a uniquely named in-memory database so that
    /// test cases do not share state unless explicitly constructed with the same name.
    /// </summary>
    /// <typeparam name="TContext">The EF Core <see cref="DbContext"/> type.</typeparam>
    public class InMemoryDbContextFactory<TContext> : IDbContextFactory<TContext>
        where TContext : DbContext
    {
        private readonly DbContextOptions<TContext> _options;

        public InMemoryDbContextFactory(string? databaseName = null)
        {
            _options = new DbContextOptionsBuilder<TContext>()
                .UseInMemoryDatabase(databaseName ?? Guid.NewGuid().ToString())
                .Options;
        }

        public TContext CreateDbContext()
        {
            return (TContext)Activator.CreateInstance(typeof(TContext), _options)!;
        }

        public Task<TContext> CreateDbContextAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult(CreateDbContext());
        }
    }
}
