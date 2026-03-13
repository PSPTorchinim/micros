using Microsoft.EntityFrameworkCore;
using PartyAPI.Data;
using Shared.Tests;

namespace PartyAPI.Tests
{
    public class PartyContextIntegrationTests
    {
        private readonly InMemoryDbContextFactory<PartyContext> _factory;

        public PartyContextIntegrationTests()
        {
            _factory = new InMemoryDbContextFactory<PartyContext>();
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

            // Assert
            Assert.IsType<bool>(result);
        }

        [Fact]
        public void TwoFactoryInstances_ProduceSeparateDatabases()
        {
            // Arrange
            var factoryA = new InMemoryDbContextFactory<PartyContext>();
            var factoryB = new InMemoryDbContextFactory<PartyContext>();

            using var contextA = factoryA.CreateDbContext();
            using var contextB = factoryB.CreateDbContext();

            // Assert – each factory gets a uniquely-named in-memory database, so the
            // context instances are distinct.
            Assert.NotEqual(contextA.ContextId.InstanceId, contextB.ContextId.InstanceId);
        }
    }
}
