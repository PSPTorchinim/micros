using AutoMapper;
using IdentityAPI.Data.DTO.User;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Data.Exceptions;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Tests
{
    public class SecurityStampServiceTests
    {
        private readonly Mock<IUsersRepository> _usersRepositoryMock = new();
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly Mock<ILogger<ISecurityStampService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceMock = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();

        private SecurityStampService CreateService()
        {
            _serviceProviderMock.Setup(x => x.GetService(typeof(IUsersRepository))).Returns(_usersRepositoryMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ICacheService))).Returns(_cacheServiceMock.Object);
            return new SecurityStampService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceMock,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public void GenerateSecurityStamp_ReturnsNonEmptyString()
        {
            // Arrange
            var service = CreateService();

            // Act
            var stamp = service.GenerateSecurityStamp();

            // Assert
            Assert.NotNull(stamp);
            Assert.NotEmpty(stamp);
            Assert.Equal(32, stamp.Length); // GUID without dashes is 32 characters
        }

        [Fact]
        public async Task GetUserSecurityDataAsync_ReturnsCachedData_WhenExists()
        {
            // Arrange
            var service = CreateService();
            var userId = Guid.NewGuid();
            var expectedData = new SecurityStampCacheData
            {
                UserId = userId,
                SecurityStamp = "test-stamp",
                LastPasswordChangeDate = DateTime.UtcNow
            };

            _cacheServiceMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<SecurityStampCacheData?>>>(),
                    It.IsAny<TimeSpan?>()))
                .ReturnsAsync(expectedData);

            // Act
            var result = await service.GetUserSecurityDataAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.UserId);
            Assert.Equal("test-stamp", result.SecurityStamp);
        }

        [Fact]
        public async Task GetUserSecurityDataAsync_FetchesFromDatabase_WhenCacheMiss()
        {
            // Arrange
            var service = CreateService();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "test@example.com",
                SecurityStamp = "db-stamp",
                LastPasswordChangeDate = DateTime.UtcNow,
                ActivationCode = "code",
                Roles = new List<Role>(),
                Passwords = new List<Password>(),
                Blocks = new List<Block>()
            };

            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });

            SecurityStampCacheData? capturedData = null;
            _cacheServiceMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<SecurityStampCacheData?>>>(),
                    It.IsAny<TimeSpan?>()))
                .Callback<string, Func<Task<SecurityStampCacheData?>>, TimeSpan?>(
                    async (key, factory, expiry) => capturedData = await factory())
                .ReturnsAsync((string key, Func<Task<SecurityStampCacheData?>> factory, TimeSpan? expiry) => factory().Result);

            // Act
            var result = await service.GetUserSecurityDataAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.UserId);
            Assert.Equal("db-stamp", result.SecurityStamp);
        }

        [Fact]
        public async Task GetUserSecurityDataAsync_ReturnsNull_WhenUserNotFound()
        {
            // Arrange
            var service = CreateService();
            var userId = Guid.NewGuid();

            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>()))
                .ReturnsAsync(new List<User>());

            _cacheServiceMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<SecurityStampCacheData?>>>(),
                    It.IsAny<TimeSpan?>()))
                .ReturnsAsync((string key, Func<Task<SecurityStampCacheData?>> factory, TimeSpan? expiry) => factory().Result);

            // Act
            var result = await service.GetUserSecurityDataAsync(userId);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task InvalidateUserSecurityCacheAsync_CallsRemoveAsync()
        {
            // Arrange
            var service = CreateService();
            var userId = Guid.NewGuid();

            // Act
            await service.InvalidateUserSecurityCacheAsync(userId);

            // Assert
            _cacheServiceMock.Verify(c => c.RemoveAsync(It.Is<string>(key => key.Contains(userId.ToString()))), Times.Once);
        }
    }
}
