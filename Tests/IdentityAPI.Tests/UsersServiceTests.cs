using AutoMapper;
using IdentityAPI.Data.DTO.User;
using IdentityAPI.DTO.User;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Data.Exceptions;
using Shared.Services.MessagesBroker.RabbitMQ;
using System.Security.Claims;

namespace IdentityAPI.Tests
{
    public class UsersServiceTests
    {
        private readonly Mock<IUsersRepository> _usersRepositoryMock = new();
        private readonly Mock<IAuthService> _authServiceMock = new();
        private readonly Mock<ISecurityStampService> _securityStampServiceMock = new();
        private readonly Mock<ILogger<IUsersService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly Mock<IConfiguration> _configurationMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceMock = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();

        private UsersService CreateService()
        {
            // Setup configuration mock with password settings
            _configurationMock.Setup(c => c["PasswordConfiguration:BCryptWorkFactor"]).Returns("12");
            _configurationMock.Setup(c => c["PasswordConfiguration:MaxPasswordHistoryToCheck"]).Returns("10");
            
            _serviceProviderMock.Setup(x => x.GetService(typeof(IUsersRepository))).Returns(_usersRepositoryMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(IAuthService))).Returns(_authServiceMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ISecurityStampService))).Returns(_securityStampServiceMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(IConfiguration))).Returns(_configurationMock.Object);
            return new UsersService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceMock,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public async Task Login_Throws_WhenUserNotFound()
        {
            // Arrange
            var service = CreateService();
            var loginDto = new LoginUserRequestDTO { Email = "notfound@example.com", Password = "pass" };
            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<IdentityAPI.Data.Specifications.UserWithRolesAndPermissions>()))
                .ReturnsAsync(new List<User>());
            // Act & Assert
            await Assert.ThrowsAsync<AppException>(() => service.Login(loginDto));
        }

        [Fact]
        public async Task Register_ReturnsTrue_WhenUserIsNew()
        {
            var service = CreateService();
            var registerDto = new RegisterUserRequestDTO { Email = "new@example.com", Password = "pass", Username = "user" };
            _usersRepositoryMock.Setup(r => r.Count(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(0);
            _usersRepositoryMock.Setup(r => r.Add(It.IsAny<User>())).ReturnsAsync(true);
            var result = await service.Register(registerDto);
            Assert.True(result);
        }

        [Fact]
        public async Task RefreshToken_Throws_WhenUserNotFound()
        {
            var service = CreateService();
            _authServiceMock
                .Setup(a => a.RefreshTokenAsync(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(new LoginResponseDTO { AccessToken = "token", RefreshToken = "refresh" });
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User>());
            // Mock ClaimsPrincipal with Id claim
            var userId = Guid.NewGuid().ToString();
            var claims = new List<Claim> { new Claim("Id", userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            var httpContext = new DefaultHttpContext { User = principal };
            httpContext.Request.Headers["Authorization"] = "Bearer test_token";
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
            await Assert.ThrowsAsync<AppException>(() => service.RefreshToken());
        }

        [Fact]
        public async Task RefreshToken_FallsBackToRawToken_WhenClaimsNotPopulated()
        {
            // Simulate an expired token scenario where HttpContext.User has no claims
            // (JWT middleware cannot authenticate because the token has expired), but
            // GetUserIdFromTokenIgnoreExpiry should recover the user ID from the raw token.
            var service = CreateService();
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = "user@example.com",
                Passwords = new List<Password>(),
                Blocks = new List<Block>(),
                Roles = new List<Role>()
            };

            // HttpContext.User has NO claims (as when JWT validation fails for an expired token)
            var httpContext = new DefaultHttpContext { User = new ClaimsPrincipal() };
            httpContext.Request.Headers["Authorization"] = "Bearer raw_token";
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            // AuthService returns the user ID from the raw (possibly expired) token
            _authServiceMock
                .Setup(a => a.GetUserIdFromTokenIgnoreExpiry("raw_token"))
                .Returns(userId.ToString());

            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });

            _authServiceMock
                .Setup(a => a.GenerateAccessToken(user))
                .Returns(new LoginResponseDTO { AccessToken = "new_token", RefreshToken = "new_refresh" });

            _mapperMock.Setup(m => m.Map<GetUserDTO>(user)).Returns(new GetUserDTO());

            var result = await service.RefreshToken();

            Assert.NotNull(result);
            Assert.Equal("new_token", result.AccessToken);
        }

        [Fact]
        public async Task RefreshToken_Throws_WhenClaimsEmptyAndRawTokenReturnsNullUserId()
        {
            // Both HttpContext.User claims and GetUserIdFromTokenIgnoreExpiry return nothing
            var service = CreateService();

            var httpContext = new DefaultHttpContext { User = new ClaimsPrincipal() };
            httpContext.Request.Headers["Authorization"] = "Bearer invalid_token";
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            _authServiceMock
                .Setup(a => a.GetUserIdFromTokenIgnoreExpiry("invalid_token"))
                .Returns((string?)null);

            await Assert.ThrowsAsync<AppException>(() => service.RefreshToken());
        }

        [Fact]
        public async Task BlockUser_Throws_WhenUserNotFound()
        {
            var service = CreateService();
            var dto = new BlockUserDTO { UserId = Guid.NewGuid() };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User>());
            await Assert.ThrowsAsync<AppException>(() => service.BlockUser(dto));
        }

        [Fact]
        public async Task ChangePassword_Throws_WhenUserNotFound()
        {
            var service = CreateService();
            var dto = new ChangePasswordRequestDTO { OldPassword = "old", NewPassword = "new" };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User>());
            await Assert.ThrowsAsync<AppException>(() => service.ChangePassword(dto));
        }

        [Fact]
        public async Task ForgotPassword_Throws_WhenUserNotFound()
        {
            var service = CreateService();
            var dto = new ForgotPasswordRequestDTO { Email = "notfound@example.com" };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User>());
            await Assert.ThrowsAsync<AppException>(() => service.ForgotPassword(dto));
        }

        [Fact]
        public async Task ActivateAccount_Throws_WhenUserNotFound()
        {
            var service = CreateService();
            var dto = new ActivateAccountRequestDTO { Email = "notfound@example.com", ActivationCode = "code" };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User>());
            await Assert.ThrowsAsync<AppException>(() => service.ActivateAccount(dto));
        }

        [Fact]
        public async Task GetLoggedUserData_Throws_WhenUserNotFound()
        {
            var service = CreateService();
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<IdentityAPI.Data.Specifications.UserWithRolesAndPermissions>())).ReturnsAsync(new List<User>());
            // Mock ClaimsPrincipal with Id claim
            var userId = Guid.NewGuid().ToString();
            var claims = new List<Claim> { new Claim("Id", userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            var httpContext = new DefaultHttpContext { User = principal };
            httpContext.Request.Headers["Authorization"] = "Bearer test_token";
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
            await Assert.ThrowsAsync<AppException>(() => service.GetLoggedUserData());
        }
        [Fact]
        public async Task Register_ReturnsFalse_WhenEmailExists()
        {
            var service = CreateService();
            var registerDto = new RegisterUserRequestDTO { Email = "exists@example.com", Password = "pass", Username = "user" };
            _usersRepositoryMock.Setup(r => r.Count(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(1);
            await Assert.ThrowsAsync<AppException>(() => service.Register(registerDto));
        }

        [Fact]
        public async Task Login_ReturnsUser_WhenCredentialsAreCorrect()
        {
            var service = CreateService();
            // Hash the password using BCrypt (same as what would be stored in the database)
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("pass", workFactor: 12);
            var password = new Password { Value = hashedPassword, CreatedDate = DateTime.Now };
            var user = new User { Email = "user@example.com", Passwords = new List<Password> { password }, Blocks = new List<Block>() };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<IdentityAPI.Data.Specifications.UserWithRolesAndPermissions>())).ReturnsAsync(new List<User> { user });
            _authServiceMock.Setup(a => a.GenerateAccessToken(user)).Returns(new LoginResponseDTO { AccessToken = "token", RefreshToken = "refresh" });
            _usersRepositoryMock.Setup(r => r.Update(user)).ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<GetUserDTO>(user)).Returns(new GetUserDTO());
            var loginDto = new LoginUserRequestDTO { Email = "user@example.com", Password = "pass" };
            var result = await service.Login(loginDto);
            Assert.NotNull(result);
            Assert.Equal("token", result.AccessToken);
        }

        [Fact]
        public async Task ForgotPassword_Succeeds_WhenUserExists()
        {
            var service = CreateService();
            var user = new User { Email = "user@example.com", Passwords = new List<Password>(), Blocks = new List<Block>() };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User> { user });
            _usersRepositoryMock.Setup(r => r.Update(user)).ReturnsAsync(true);
            var dto = new ForgotPasswordRequestDTO { Email = "user@example.com" };
            var result = await service.ForgotPassword(dto);
            Assert.True(result);
        }

        [Fact]
        public async Task BlockUser_Succeeds_WhenUserExists()
        {
            var service = CreateService();
            var user = new User { Id = Guid.NewGuid(), Blocks = new List<Block>(), Passwords = new List<Password>() };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User> { user });
            _mapperMock.Setup(m => m.Map<Block>(It.IsAny<BlockUserDTO>())).Returns(new Block());
            _usersRepositoryMock.Setup(r => r.Update(user)).ReturnsAsync(true);
            var dto = new BlockUserDTO { UserId = user.Id, Reason = "test", Pernament = false };
            var result = await service.BlockUser(dto);
            Assert.True(result);
        }

        [Fact]
        public async Task ChangePassword_Succeeds_WhenUserExistsAndOldPasswordMatches()
        {
            var service = CreateService();
            var userId = Guid.NewGuid().ToString();
            // Hash the old password using BCrypt
            var hashedOldPassword = BCrypt.Net.BCrypt.HashPassword("old", workFactor: 12);
            var user = new User { Id = Guid.Parse(userId), Passwords = new List<Password> { new Password { Value = hashedOldPassword, CreatedDate = DateTime.Now } }, Blocks = new List<Block>() };

            // Mock ClaimsPrincipal with Id claim
            var claims = new List<Claim> { new Claim("Id", userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            var httpContext = new DefaultHttpContext { User = principal };
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User> { user });
            _usersRepositoryMock.Setup(r => r.Update(user)).ReturnsAsync(true);
            var dto = new ChangePasswordRequestDTO { OldPassword = "old", NewPassword = "new" };
            var result = await service.ChangePassword(dto);
            Assert.True(result);
        }

        [Fact]
        public async Task ActivateAccount_Succeeds_WhenUserExistsAndCodeMatches()
        {
            var service = CreateService();
            var user = new User { Email = "user@example.com", ActivationCode = "code", Blocks = new List<Block>(), Passwords = new List<Password>() };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>())).ReturnsAsync(new List<User> { user });
            _usersRepositoryMock.Setup(r => r.Update(user)).ReturnsAsync(true);
            var dto = new ActivateAccountRequestDTO { Email = "user@example.com", ActivationCode = "code" };
            var result = await service.ActivateAccount(dto);
            Assert.True(result);
        }

        [Fact]
        public async Task GetLoggedUserData_Succeeds_WhenUserExists()
        {
            var service = CreateService();
            var user = new User { Id = Guid.NewGuid(), Email = "user@example.com", Passwords = new List<Password>(), Blocks = new List<Block>(), RefreshToken = "refresh" };
            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<IdentityAPI.Data.Specifications.UserWithRolesAndPermissions>())).ReturnsAsync(new List<User> { user });
            _mapperMock.Setup(m => m.Map<GetUserDTO>(user)).Returns(new GetUserDTO());
            // Mock ClaimsPrincipal with Id claim
            var userId = user.Id.ToString();
            var claims = new List<Claim> { new Claim("Id", userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            var httpContext = new DefaultHttpContext { User = principal };
            httpContext.Request.Headers["Authorization"] = "Bearer test_token";
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
            var result = await service.GetLoggedUserData();
            Assert.NotNull(result);
            Assert.Equal("refresh", result.RefreshToken);
        }

        [Fact]
        public async Task ValidateSecurityStamp_ReturnsValid_WhenStampsMatch()
        {
            var service = CreateService();
            var userId = Guid.NewGuid();
            var securityStamp = "valid-stamp";
            var request = new ValidateSecurityStampRequestDTO { UserId = userId, SecurityStamp = securityStamp };
            var cachedData = new SecurityStampCacheData
            {
                UserId = userId,
                SecurityStamp = securityStamp,
                LastPasswordChangeDate = DateTime.UtcNow
            };

            _securityStampServiceMock.Setup(s => s.GetUserSecurityDataAsync(userId)).ReturnsAsync(cachedData);

            var result = await service.ValidateSecurityStamp(request);
            Assert.NotNull(result);
            Assert.True(result.IsValid);
            Assert.Null(result.Reason);
        }

        [Fact]
        public async Task ValidateSecurityStamp_ReturnsInvalid_WhenStampsMismatch()
        {
            var service = CreateService();
            var userId = Guid.NewGuid();
            var request = new ValidateSecurityStampRequestDTO { UserId = userId, SecurityStamp = "old-stamp" };
            var cachedData = new SecurityStampCacheData
            {
                UserId = userId,
                SecurityStamp = "new-stamp",
                LastPasswordChangeDate = DateTime.UtcNow
            };

            _securityStampServiceMock.Setup(s => s.GetUserSecurityDataAsync(userId)).ReturnsAsync(cachedData);

            var result = await service.ValidateSecurityStamp(request);
            Assert.NotNull(result);
            Assert.False(result.IsValid);
            Assert.Equal("Security stamp mismatch - password was changed", result.Reason);
        }

        [Fact]
        public async Task ValidateSecurityStamp_ReturnsInvalid_WhenUserNotFound()
        {
            var service = CreateService();
            var userId = Guid.NewGuid();
            var request = new ValidateSecurityStampRequestDTO { UserId = userId, SecurityStamp = "stamp" };

            _securityStampServiceMock.Setup(s => s.GetUserSecurityDataAsync(userId)).ReturnsAsync((SecurityStampCacheData?)null);

            var result = await service.ValidateSecurityStamp(request);
            Assert.NotNull(result);
            Assert.False(result.IsValid);
            Assert.Equal("User not found", result.Reason);
        }

        [Fact]
        public async Task ValidateSecurityStamp_ReturnsInvalid_WhenStampEmpty()
        {
            var service = CreateService();
            var userId = Guid.NewGuid();
            var request = new ValidateSecurityStampRequestDTO { UserId = userId, SecurityStamp = "" };

            var result = await service.ValidateSecurityStamp(request);
            Assert.NotNull(result);
            Assert.False(result.IsValid);
            Assert.Equal("Invalid security stamp: stamp is empty", result.Reason);
        }

        [Fact]
        public async Task ChangePassword_InvalidatesCacheAndRegeneratesStamp()
        {
            var service = CreateService();
            var userId = Guid.NewGuid();
            // Hash the old password using BCrypt
            var hashedOldPassword = BCrypt.Net.BCrypt.HashPassword("oldpass", workFactor: 12);
            var user = new User
            {
                Id = userId,
                Email = "test@example.com",
                Passwords = new List<Password> { new Password { Value = hashedOldPassword, CreatedDate = DateTime.Now } },
                Blocks = new List<Block>(),
                ActivationCode = "code",
                Roles = new List<Role>(),
                SecurityStamp = "old-stamp"
            };
            var request = new ChangePasswordRequestDTO { OldPassword = "oldpass", NewPassword = "newpass" };

            _usersRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });
            _usersRepositoryMock.Setup(r => r.Update(It.IsAny<User>())).ReturnsAsync(true);
            _securityStampServiceMock.Setup(s => s.GenerateSecurityStamp()).Returns("new-stamp");

            var claims = new List<Claim> { new Claim("Id", userId.ToString()) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var principal = new ClaimsPrincipal(identity);
            var httpContext = new DefaultHttpContext { User = principal };
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            var result = await service.ChangePassword(request);

            Assert.True(result);
            _securityStampServiceMock.Verify(s => s.GenerateSecurityStamp(), Times.Once);
            _securityStampServiceMock.Verify(s => s.InvalidateUserSecurityCacheAsync(userId), Times.Once);
        }

        [Fact]
        public async Task UpdateUserRoles_RegeneratesSecurityStampAndInvalidatesCache()
        {
            var service = CreateService();
            var userId = Guid.NewGuid();
            var roleId = Guid.NewGuid();
            var role = new Role { Id = roleId, Name = "TestRole", Permissions = new List<Permission>() };
            var user = new User
            {
                Id = userId,
                SecurityStamp = "old-stamp",
                Roles = new List<Role>(),
                Blocks = new List<Block>(),
                Passwords = new List<Password>()
            };

            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<IdentityAPI.Data.Specifications.UserWithRolesAndPermissions>()))
                .ReturnsAsync(new List<User> { user });

            var mockRolesRepository = new Mock<IRolesRepository>();
            mockRolesRepository
                .Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>()))
                .ReturnsAsync(new List<Role> { role });
            _serviceProviderMock.Setup(x => x.GetService(typeof(IRolesRepository))).Returns(mockRolesRepository.Object);

            _usersRepositoryMock.Setup(r => r.Update(It.IsAny<User>())).ReturnsAsync(true);
            _securityStampServiceMock.Setup(s => s.GenerateSecurityStamp()).Returns("new-stamp");
            _securityStampServiceMock.Setup(s => s.InvalidateUserSecurityCacheAsync(It.IsAny<Guid>())).Returns(Task.CompletedTask);

            var request = new UpdateUserRolesDTO { UserId = userId, RoleIds = new List<Guid> { roleId } };
            var result = await service.UpdateUserRoles(request);

            Assert.True(result);
            _securityStampServiceMock.Verify(s => s.GenerateSecurityStamp(), Times.Once);
            _securityStampServiceMock.Verify(s => s.InvalidateUserSecurityCacheAsync(userId), Times.Once);
            Assert.Equal("new-stamp", user.SecurityStamp);
        }
    }
}
