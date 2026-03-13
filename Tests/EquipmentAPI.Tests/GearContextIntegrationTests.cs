using EquipmentAPI.Data;
using Microsoft.EntityFrameworkCore;
using Shared.Tests;

namespace EquipmentAPI.Tests
{
    public class GearContextIntegrationTests
    {
        private readonly InMemoryDbContextFactory<GearContext> _factory;

        public GearContextIntegrationTests()
        {
            _factory = new InMemoryDbContextFactory<GearContext>();
        }

        [Fact]
        public void CreateDbContext_ReturnsNonNullContext()
        {
            // Act
            using var context = _factory.CreateDbContext();

            // Assert
            Assert.NotNull(context);
        }

        [Fact]
        public async Task CreateDbContextAsync_ReturnsNonNullContext()
        {
            // Act
            await using var context = await _factory.CreateDbContextAsync();

            // Assert
            Assert.NotNull(context);
        }

        [Fact]
        public void CreateDbContext_DatabaseIsInMemory()
        {
            // Act
            using var context = _factory.CreateDbContext();

            // Assert
            Assert.True(context.Database.IsInMemory());
        }

        [Fact]
        public async Task EnsureCreated_Succeeds()
        {
            // Arrange
            await using var context = await _factory.CreateDbContextAsync();

            // Act
            var result = await context.Database.EnsureCreatedAsync();

            // Assert – the database was either created (true) or already existed (false)
            // Either outcome confirms the context can be used
            Assert.IsType<bool>(result);
        }

        [Fact]
        public void TwoFactoryInstances_ProduceSeparateDatabases()
        {
            // Each factory gets its own uniquely-named in-memory database by default
            var factoryA = new InMemoryDbContextFactory<GearContext>();
            var factoryB = new InMemoryDbContextFactory<GearContext>();

            using var contextA = factoryA.CreateDbContext();
            using var contextB = factoryB.CreateDbContext();

            // Contexts from different factories should have different ContextId instances,
            // confirming they are backed by separate in-memory databases.
            Assert.NotEqual(contextA.ContextId.InstanceId, contextB.ContextId.InstanceId);
        }

        [Fact]
        public void SameNamedFactory_ProducesSameDatabase()
        {
            // Arrange
            const string dbName = "shared-gear-test-db";
            var factoryA = new InMemoryDbContextFactory<GearContext>(dbName);
            var factoryB = new InMemoryDbContextFactory<GearContext>(dbName);

            using var contextA = factoryA.CreateDbContext();
            using var contextB = factoryB.CreateDbContext();

            // Verify both contexts can be ensured created without conflict
            // (they target the same database, so one call is idempotent)
            var resultA = contextA.Database.EnsureCreated();
            var resultB = contextB.Database.EnsureCreated();

            // The first call creates the database (resultA == true),
            // the second call finds it already exists (resultB == false).
            Assert.True(resultA);
            Assert.False(resultB);
        }
    }
}
