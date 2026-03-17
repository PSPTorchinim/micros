using AutoMapper;
using IdentityAPI.Data.DTO.Permission;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Tests
{
    public class PermissionsServiceTests
    {
        private readonly Mock<IPermissionsRepository> _permissionsRepositoryMock = new();
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly Mock<ILogger<IPermissionsService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceMock = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();

        private PermissionsService CreateService()
        {
            _serviceProviderMock.Setup(x => x.GetService(typeof(IPermissionsRepository))).Returns(_permissionsRepositoryMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ICacheService))).Returns(_cacheServiceMock.Object);

            // Setup default cache behavior - GetOrCreateAsync calls factory function (simulates cache miss)
            _cacheServiceMock.Setup(x => x.GetOrCreateAsync<List<GetPermissionsDTO>>(
                It.IsAny<string>(),
                It.IsAny<Func<Task<List<GetPermissionsDTO>?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<List<GetPermissionsDTO>?>>, TimeSpan?>(async (key, factory, expiry) => await factory());

            _cacheServiceMock.Setup(x => x.GetOrCreateAsync<GetPermissionDTO>(
                It.IsAny<string>(),
                It.IsAny<Func<Task<GetPermissionDTO?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<GetPermissionDTO?>>, TimeSpan?>(async (key, factory, expiry) => await factory());

            _cacheServiceMock.Setup(x => x.SetAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<TimeSpan?>()))
                .Returns(Task.CompletedTask);
            _cacheServiceMock.Setup(x => x.RemoveAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            return new PermissionsService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceMock,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public async Task GetPermissions_ReturnsMappedList()
        {
            var service = CreateService();
            var permissions = new List<Permission> { new Permission { Id = Guid.NewGuid(), Name = "perm1" } };
            _permissionsRepositoryMock.Setup(r => r.Get()).ReturnsAsync(permissions);
            _mapperMock.Setup(m => m.Map<List<GetPermissionsDTO>>(permissions)).Returns(new List<GetPermissionsDTO> { new GetPermissionsDTO() });
            var result = await service.GetPermissions();
            Assert.NotNull(result);
            Assert.Single(result);
        }

        [Fact]
        public async Task AddPermission_ReturnsFalse_IfExists()
        {
            var service = CreateService();
            var dto = new AddPermissionDTO { Name = "perm1" };
            _permissionsRepositoryMock.Setup(r => r.Exists(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(true);
            var result = await service.AddPermission(dto);
            Assert.False(result);
        }

        [Fact]
        public async Task AddPermission_AddsAndReturnsTrue_IfNotExists()
        {
            var service = CreateService();
            var dto = new AddPermissionDTO { Name = "perm2" };
            _permissionsRepositoryMock.Setup(r => r.Exists(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(false);
            _mapperMock.Setup(m => m.Map<Permission>(dto)).Returns(new Permission { Name = "perm2" });
            _permissionsRepositoryMock.Setup(r => r.Add(It.IsAny<Permission>())).ReturnsAsync(true);
            var result = await service.AddPermission(dto);
            Assert.True(result);
        }

        [Fact]
        public async Task GetPermission_ReturnsMappedDto_IfFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var permission = new Permission { Id = id, Name = "perm1" };
            _permissionsRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(new List<Permission> { permission });
            _mapperMock.Setup(m => m.Map<GetPermissionDTO>(permission)).Returns(new GetPermissionDTO());
            var result = await service.GetPermission(id);
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetPermission_ReturnsNull_IfNotFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            _permissionsRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(new List<Permission>());
            _mapperMock.Setup(m => m.Map<GetPermissionDTO>(It.IsAny<Permission>())).Returns(default(GetPermissionDTO));
            var result = await service.GetPermission(id);
            Assert.Null(result);
        }

        [Fact]
        public async Task EditPermission_ReturnsFalse_IfNotFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var dto = new EditPermissionDTO { Name = "perm1", Description = "desc" };
            _permissionsRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(new List<Permission>());
            var result = await service.EditPermission(id, dto);
            Assert.False(result);
        }

        [Fact]
        public async Task EditPermission_UpdatesAndReturnsTrue_IfFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var permission = new Permission { Id = id, Name = "perm1", Description = "desc" };
            var dto = new EditPermissionDTO { Name = "newname", Description = "newdesc" };
            _permissionsRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(new List<Permission> { permission });
            _permissionsRepositoryMock.Setup(r => r.Update(permission)).ReturnsAsync(true);
            var result = await service.EditPermission(id, dto);
            Assert.True(result);
            Assert.Equal("newname", permission.Name);
            Assert.Equal("newdesc", permission.Description);
        }

        [Fact]
        public async Task DeletePermission_ReturnsFalse_IfNotFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            _permissionsRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(new List<Permission>());
            var result = await service.DeletePermission(id);
            Assert.False(result);
        }

        [Fact]
        public async Task DeletePermission_DeletesAndReturnsTrue_IfFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var permission = new Permission { Id = id, Name = "perm1" };
            _permissionsRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Permission, bool>>>())).ReturnsAsync(new List<Permission> { permission });
            _permissionsRepositoryMock.Setup(r => r.Delete(permission)).ReturnsAsync(true);
            var result = await service.DeletePermission(id);
            Assert.True(result);
        }
    }
}
