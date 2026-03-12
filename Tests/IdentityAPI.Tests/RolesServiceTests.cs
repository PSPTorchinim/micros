using AutoMapper;
using IdentityAPI.DTO.Role;
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
    public class RolesServiceTests
    {
        private readonly Mock<IRolesRepository> _rolesRepositoryMock = new();
        private readonly Mock<IPermissionsRepository> _permissionsRepositoryMock = new();
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly Mock<ILogger<IRolesService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceMock = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();
        private readonly Mock<IUsersRepository> _usersRepositoryMock = new();
        private readonly Mock<ISecurityStampService> _securityStampServiceMock = new();

        private RolesService CreateService()
        {
            _serviceProviderMock.Setup(x => x.GetService(typeof(IRolesRepository))).Returns(_rolesRepositoryMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(IPermissionsRepository))).Returns(_permissionsRepositoryMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ICacheService))).Returns(_cacheServiceMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(IUsersRepository))).Returns(_usersRepositoryMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ISecurityStampService))).Returns(_securityStampServiceMock.Object);

            // Default: users repository returns empty list for expression-based Gets
            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>()))
                .ReturnsAsync(new List<User>());

            // Setup default cache behavior - always return null (cache miss) for any type
            _cacheServiceMock.Setup(x => x.GetAsync<List<GetRoleDTO>>(It.IsAny<string>()))
                .ReturnsAsync(default(List<GetRoleDTO>));
            _cacheServiceMock.Setup(x => x.GetAsync<GetRoleDTO>(It.IsAny<string>()))
                .ReturnsAsync(default(GetRoleDTO));
            _cacheServiceMock.Setup(x => x.SetAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<TimeSpan?>()))
                .Returns(Task.CompletedTask);
            _cacheServiceMock.Setup(x => x.RemoveAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            _cacheServiceMock.Setup(x => x.RemoveByPrefixAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            // Setup GetOrCreateAsync to call the factory function (simulates cache miss)
            _cacheServiceMock.Setup(x => x.GetOrCreateAsync<List<GetRoleDTO>>(
                It.IsAny<string>(),
                It.IsAny<Func<Task<List<GetRoleDTO>?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<List<GetRoleDTO>?>>, TimeSpan?>(async (key, factory, expiry) => await factory());

            _cacheServiceMock.Setup(x => x.GetOrCreateAsync<GetRoleDTO>(
                It.IsAny<string>(),
                It.IsAny<Func<Task<GetRoleDTO?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<GetRoleDTO?>>, TimeSpan?>(async (key, factory, expiry) => await factory());

            return new RolesService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceMock,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public async Task GetRoles_ReturnsListOfRoles()
        {
            var service = CreateService();
            var roleId = Guid.NewGuid();
            var roles = new List<Role> { new Role { Id = roleId, Name = "Admin" } };
            // Setup for ISpecification-based Get (now using RolePermissionsSpec)
            _rolesRepositoryMock
                .Setup(r => r.Get(It.IsAny<Shared.Data.Specifications.ISpecification<Role>>()))
                .ReturnsAsync(roles);
            _mapperMock.Setup(m => m.Map<GetRoleDTO>(It.IsAny<Role>()))
                .Returns<Role>(r => new GetRoleDTO { Id = r.Id, Name = r.Name });
            var result = await service.GetRoles();
            Assert.Single(result);
            Assert.Equal("Admin", result[0].Name);
        }

        [Fact]
        public async Task GetRole_ReturnsMappedRole()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var roles = new List<Role> { new Role { Id = id, Name = "Admin" } };
            // Setup for ISpecification-based Get
            _rolesRepositoryMock
                .Setup(r => r.Get(It.IsAny<Shared.Data.Specifications.ISpecification<Role>>()))
                .ReturnsAsync(roles);
            var mapped = new GetRoleDTO();
            _mapperMock.Setup(m => m.Map<GetRoleDTO>(It.IsAny<object>())).Returns(mapped);
            var result = await service.GetRole(id);
            Assert.Equal(mapped, result);
        }

        [Fact]
        public async Task AddRole_Throws_WhenRoleExists()
        {
            var service = CreateService();
            var req = new AddRoleRequest { Name = "Admin", Permissions = new List<Guid>() };
            _rolesRepositoryMock.Setup(r => r.Exists(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>())).ReturnsAsync(true);
            await Assert.ThrowsAsync<AppException>(() => service.AddRole(req));
        }

        [Fact]
        public async Task AddRole_Succeeds_WhenRoleDoesNotExist()
        {
            var service = CreateService();
            var req = new AddRoleRequest { Name = "User", Permissions = new List<Guid>() };
            _rolesRepositoryMock.Setup(r => r.Exists(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>())).ReturnsAsync(false);
            _permissionsRepositoryMock.Setup(p => p.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Permission, bool>>>())).ReturnsAsync(new List<Permission>());
            _rolesRepositoryMock.Setup(r => r.Add(It.IsAny<Role>())).ReturnsAsync(true);

            // Mock for mapping role to DTO
            _mapperMock.Setup(m => m.Map<GetRoleDTO>(It.IsAny<Role>())).Returns(new GetRoleDTO());

            var result = await service.AddRole(req);
            Assert.True(result);
        }

        [Fact]
        public async Task AddRole_Succeeds_WithExistingPermissions()
        {
            var service = CreateService();
            var permissionId1 = Guid.NewGuid();
            var permissionId2 = Guid.NewGuid();
            var req = new AddRoleRequest 
            { 
                Name = "Editor", 
                Description = "Editor role with permissions",
                Permissions = new List<Guid> { permissionId1, permissionId2 }
            };
            
            var existingPermissions = new List<Permission>
            {
                new Permission { Id = permissionId1, Name = "Read" },
                new Permission { Id = permissionId2, Name = "Write" }
            };

            _rolesRepositoryMock.Setup(r => r.Exists(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>())).ReturnsAsync(false);
            _permissionsRepositoryMock.Setup(p => p.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Permission, bool>>>())).ReturnsAsync(existingPermissions);
            _rolesRepositoryMock.Setup(r => r.Add(It.IsAny<Role>())).ReturnsAsync(true);

            // Mock for mapping role to DTO
            _mapperMock.Setup(m => m.Map<GetRoleDTO>(It.IsAny<Role>())).Returns(new GetRoleDTO());

            var result = await service.AddRole(req);
            Assert.True(result);
            
            // Verify that Add was called with a role that has the correct permissions
            _rolesRepositoryMock.Verify(r => r.Add(It.Is<Role>(role => 
                role.Name == "Editor" && 
                role.Description == "Editor role with permissions" &&
                role.Permissions != null &&
                role.Permissions.Count() == 2
            )), Times.Once);
        }

        [Fact]
        public async Task EditRole_Throws_WhenRoleNotFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var req = new AddRoleRequest { Name = "User", Permissions = new List<Guid>() };
            _rolesRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>())).ReturnsAsync(new List<Role>());
            await Assert.ThrowsAsync<AppException>(() => service.EditRole(id, req));
        }

        [Fact]
        public async Task EditRole_Succeeds_WhenRoleExists()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var role = new Role { Id = id, Name = "Old", Description = "desc", Permissions = new List<Permission>() };
            var req = new AddRoleRequest { Name = "New", Description = "newdesc", Permissions = new List<Guid>() };
            _rolesRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>())).ReturnsAsync(new List<Role> { role });
            _permissionsRepositoryMock.Setup(p => p.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Permission, bool>>>())).ReturnsAsync(new List<Permission>());
            _rolesRepositoryMock.Setup(r => r.Update(role)).ReturnsAsync(true);
            // Mock for mapping role to DTO (used for caching the updated entity)
            _mapperMock.Setup(m => m.Map<GetRoleDTO>(It.IsAny<object>())).Returns(new GetRoleDTO());

            var result = await service.EditRole(id, req);
            Assert.True(result);
            Assert.Equal("New", role.Name);
            Assert.Equal("newdesc", role.Description);
        }

        [Fact]
        public async Task DeleteRole_Throws_WhenRoleNotFound()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            _rolesRepositoryMock.Setup(r => r.Get(It.IsAny<Shared.Data.Specifications.ISpecification<Role>>())).ReturnsAsync(new List<Role>());
            await Assert.ThrowsAsync<AppException>(() => service.DeleteRole(id));
        }

        [Fact]
        public async Task DeleteRole_Throws_WhenRoleHasUsers()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var role = new Role { Id = id, Users = new List<User> { new User() } };
            _rolesRepositoryMock.Setup(r => r.Get(It.IsAny<Shared.Data.Specifications.ISpecification<Role>>())).ReturnsAsync(new List<Role> { role });
            await Assert.ThrowsAsync<AppException>(() => service.DeleteRole(id));
        }

        [Fact]
        public async Task DeleteRole_Succeeds_WhenRoleExistsAndHasNoUsers()
        {
            var service = CreateService();
            var id = Guid.NewGuid();
            var role = new Role { Id = id, Users = new List<User>() };
            _rolesRepositoryMock.Setup(r => r.Get(It.IsAny<Shared.Data.Specifications.ISpecification<Role>>())).ReturnsAsync(new List<Role> { role });
            _rolesRepositoryMock.Setup(r => r.Delete(role)).ReturnsAsync(true);
            var result = await service.DeleteRole(id);
            Assert.True(result);
        }

        [Fact]
        public async Task EditRole_RegeneratesSecurityStampForAffectedUsers()
        {
            var service = CreateService();
            var roleId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var role = new Role { Id = roleId, Name = "Old", Description = "desc", Permissions = new List<Permission>() };
            var user = new User { Id = userId, SecurityStamp = "old-stamp", Roles = new List<Role> { role }, Blocks = new List<Block>(), Passwords = new List<Password>() };
            var req = new AddRoleRequest { Name = "New", Description = "newdesc", Permissions = new List<Guid>() };

            _rolesRepositoryMock.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Role, bool>>>())).ReturnsAsync(new List<Role> { role });
            _permissionsRepositoryMock.Setup(p => p.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<Permission, bool>>>())).ReturnsAsync(new List<Permission>());
            _rolesRepositoryMock.Setup(r => r.Update(role)).ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<GetRoleDTO>(It.IsAny<object>())).Returns(new GetRoleDTO());

            _usersRepositoryMock
                .Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<System.Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });
            _usersRepositoryMock.Setup(r => r.Update(It.IsAny<User>())).ReturnsAsync(true);
            _securityStampServiceMock.Setup(s => s.GenerateSecurityStamp()).Returns("new-stamp");
            _securityStampServiceMock.Setup(s => s.InvalidateUserSecurityCacheAsync(It.IsAny<Guid>())).Returns(Task.CompletedTask);

            var result = await service.EditRole(roleId, req);

            Assert.True(result);
            _securityStampServiceMock.Verify(s => s.GenerateSecurityStamp(), Times.Once);
            _securityStampServiceMock.Verify(s => s.InvalidateUserSecurityCacheAsync(userId), Times.Once);
            Assert.Equal("new-stamp", user.SecurityStamp);
        }
    }
}
