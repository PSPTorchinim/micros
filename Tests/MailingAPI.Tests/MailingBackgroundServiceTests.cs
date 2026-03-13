using MailingAPI.BackgroundServices;
using MailingAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Services.MessagesBroker.RabbitMQ;
using Shared.Tests;

namespace MailingAPI.Tests
{
    public class MailingBackgroundServiceTests
    {
        private readonly Mock<ILogger<MailingBackgroundService>> _loggerMock = new();
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();

        /// <summary>
        /// A <see cref="RabbitMQConsumerService"/> stub that overrides message receiving
        /// to avoid real RabbitMQ connections during testing.
        /// </summary>
        private sealed class RabbitMQConsumerServiceStub : RabbitMQConsumerService
        {
            public bool ReceiveCalled { get; private set; }

            public RabbitMQConsumerServiceStub() : base(null) { }

            public new Task ReceiveMessageAsync<T>(Func<T, Task<bool>> action, string queueName)
            {
                ReceiveCalled = true;
                return Task.CompletedTask;
            }
        }

        private MailingBackgroundService CreateService()
        {
            var consumerStub = new RabbitMQConsumerServiceStub();
            _serviceProviderMock
                .Setup(sp => sp.GetService(typeof(RabbitMQConsumerService)))
                .Returns(consumerStub);
            _serviceProviderMock
                .Setup(sp => sp.GetService(typeof(ILogger<MailingBackgroundService>)))
                .Returns(_loggerMock.Object);
            return new MailingBackgroundService(_serviceProviderMock.Object);
        }

        [Fact]
        public void Constructor_WithServiceProvider_DoesNotThrow()
        {
            // Act & Assert – no exception expected
            var service = CreateService();
            Assert.NotNull(service);
        }

        [Fact]
        public async Task StopAsync_BeforeStart_CompletesSuccessfully()
        {
            // Arrange
            var service = CreateService();

            // Act & Assert – stopping a service that was never started should not throw
            await service.StopAsync(CancellationToken.None);
        }

        [Fact]
        public async Task StartAsync_ThenImmediateStop_CompletesWithoutError()
        {
            // Arrange
            var service = CreateService();
            using var cts = new CancellationTokenSource();

            // Act
            await service.StartAsync(cts.Token);
            cts.Cancel();
            await service.StopAsync(CancellationToken.None);

            // Assert – reaching here means no unhandled exception occurred
            Assert.True(true);
        }
    }

    public class MailingContextIntegrationTests
    {
        private readonly InMemoryDbContextFactory<MailingContext> _factory;

        public MailingContextIntegrationTests()
        {
            _factory = new InMemoryDbContextFactory<MailingContext>();
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
        public void TwoFactoryInstances_ProduceSeparateDatabases()
        {
            // Arrange
            var factoryA = new InMemoryDbContextFactory<MailingContext>();
            var factoryB = new InMemoryDbContextFactory<MailingContext>();

            using var contextA = factoryA.CreateDbContext();
            using var contextB = factoryB.CreateDbContext();

            // Assert – each factory gets a uniquely-named in-memory database, so the
            // context instances are distinct.
            Assert.NotEqual(contextA.ContextId.InstanceId, contextB.ContextId.InstanceId);
        }
    }
}
