using AutoMapper;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Services.MessagesBroker.RabbitMQ;
using System.Linq.Expressions;

namespace IdentityAPI.Tests
{
    public class AuthServiceTests
    {
        private readonly Mock<ILogger<IAuthService>> _mockLogger = new();
        private readonly Mock<IMapper> _mockMapper = new();
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor = new();
        private readonly Mock<IServiceProvider> _mockServiceProvider = new();
        private readonly Mock<IUsersRepository> _mockUsersRepo = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceMock = null!;

        private AuthService CreateService(string jwtKey = "supersecretkeysupersecretkeysupersecr")
        {
            var configDict = new List<KeyValuePair<string, string?>>
            {
                new KeyValuePair<string, string?>("TokenConfiguration:Key", jwtKey),
                new KeyValuePair<string, string?>("TokenConfiguration:Issuer", "TestIssuer"),
                new KeyValuePair<string, string?>("TokenConfiguration:Audience", "TestAudience"),
                new KeyValuePair<string, string?>("TokenConfiguration:TokenExpireTime", "3600"),
                new KeyValuePair<string, string?>("TokenConfiguration:RefreshTokenExpireTime", "7200")
            };
            var config = new ConfigurationBuilder().AddInMemoryCollection(configDict).Build();
            _mockServiceProvider.Setup(x => x.GetService(typeof(IUsersRepository))).Returns(_mockUsersRepo.Object);
            return new AuthService(config, _mockLogger.Object, _mockMapper.Object, _mockHttpContextAccessor.Object, _rabbitMQProducerServiceMock, _mockServiceProvider.Object);
        }

        private User GetTestUser()
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Roles = new List<Role>
                {
                    new Role
                    {
                        Permissions = new List<Permission>
                        {
                            new Permission { Name = "Admin" },
                            new Permission { Name = "User" }
                        }
                    }
                },
                RefreshToken = "refresh-token"
            };
        }

        [Fact]
        public void GenerateAccessToken_ReturnsTokens()
        {
            var service = CreateService();
            var user = GetTestUser();
            var result = service.GenerateAccessToken(user);
            Assert.False(string.IsNullOrWhiteSpace(result.AccessToken));
            Assert.False(string.IsNullOrWhiteSpace(result.RefreshToken));
        }

        [Fact]
        public async Task RefreshTokenAsync_ValidToken_ReturnsNewTokens()
        {
            var service = CreateService();
            var user = GetTestUser();
            _mockUsersRepo.Setup(r => r.Get(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });
            var result = await service.RefreshTokenAsync(user.RefreshToken!, user.Id.ToString());
            Assert.False(string.IsNullOrWhiteSpace(result.AccessToken));
            Assert.False(string.IsNullOrWhiteSpace(result.RefreshToken));
        }

        [Fact]
        public async Task RefreshTokenAsync_InvalidToken_Throws()
        {
            var service = CreateService();
            var user = GetTestUser();
            _mockUsersRepo.Setup(r => r.Get(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });
            await Assert.ThrowsAsync<Shared.Data.Exceptions.AppException>(() => service.RefreshTokenAsync("bad-token", user.Id.ToString()));
        }

        [Fact]
        public void ValidateToken_ValidToken_ReturnsTrue()
        {
            var service = CreateService();
            var user = GetTestUser();
            var tokens = service.GenerateAccessToken(user);
            var result = service.ValidateToken(tokens.AccessToken);
            Assert.True(result);
        }

        [Fact]
        public void ValidateToken_InvalidToken_Throws()
        {
            var service = CreateService();
            Assert.Throws<Exception>(() => service.ValidateToken("invalid.token.value"));
        }
    }
}
