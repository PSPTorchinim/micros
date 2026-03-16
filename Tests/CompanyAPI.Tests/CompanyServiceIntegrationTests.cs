using AutoMapper;
using CompanyAPI.Data;
using CompanyAPI.Data.Models;
using CompanyAPI.Entities;
using CompanyAPI.Repositories;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Data.Exceptions;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;
using Shared.Tests;

namespace CompanyAPI.Tests
{
    public class CompanyServiceIntegrationTests
    {
        private readonly InMemoryDbContextFactory<BrandContext> _factory;
        private readonly BrandsRepository _brandsRepository;
        private readonly BrandUsersRepository _brandUsersRepository;
        private readonly Mock<ICacheService> _cacheServiceMock;
        private readonly Mock<ILogger<ICompanyService>> _loggerMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly RabbitMQProducerService _rabbitMQProducerServiceStub = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock;

        public CompanyServiceIntegrationTests()
        {
            _factory = new InMemoryDbContextFactory<BrandContext>();
            _brandsRepository = new BrandsRepository(_factory, new Mock<ILogger<IBrandsRepository>>().Object);
            _brandUsersRepository = new BrandUsersRepository(_factory, new Mock<ILogger<IBrandUsersRepository>>().Object);

            _cacheServiceMock = new Mock<ICacheService>();
            _loggerMock = new Mock<ILogger<ICompanyService>>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _serviceProviderMock = new Mock<IServiceProvider>();

            // Wire up the NoOp cache so that the factory function is always called
            _cacheServiceMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<CompanyDTO?>>>(),
                    It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<CompanyDTO?>>, TimeSpan?>(
                    async (_, factory, __) => await factory());

            _cacheServiceMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<List<CompanyUserDTO>?>>>(),
                    It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<List<CompanyUserDTO>?>>, TimeSpan?>(
                    async (_, factory, __) => await factory());

            _cacheServiceMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<List<CompanyStructureNodeDTO>?>>>(),
                    It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<List<CompanyStructureNodeDTO>?>>, TimeSpan?>(
                    async (_, factory, __) => await factory());

            _cacheServiceMock
                .Setup(c => c.RemoveAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);

            _serviceProviderMock
                .Setup(sp => sp.GetService(typeof(IBrandsRepository)))
                .Returns(_brandsRepository);
            _serviceProviderMock
                .Setup(sp => sp.GetService(typeof(IBrandUsersRepository)))
                .Returns(_brandUsersRepository);
            _serviceProviderMock
                .Setup(sp => sp.GetService(typeof(ICacheService)))
                .Returns(_cacheServiceMock.Object);
        }

        private CompanyService CreateService(string? userIdClaim = null)
        {
            if (userIdClaim != null)
            {
                var claims = new List<System.Security.Claims.Claim>
                {
                    new System.Security.Claims.Claim("sub", userIdClaim)
                };
                var identity = new System.Security.Claims.ClaimsIdentity(claims);
                var principal = new System.Security.Claims.ClaimsPrincipal(identity);
                var httpContext = new DefaultHttpContext { User = principal };
                _httpContextAccessorMock.Setup(h => h.HttpContext).Returns(httpContext);
            }
            else
            {
                _httpContextAccessorMock.Setup(h => h.HttpContext).Returns((HttpContext?)null);
            }

            return new CompanyService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceStub,
                _serviceProviderMock.Object);
        }

        private Brand CreateTestBrand(string name = "Test Company") => new Brand
        {
            Id = Guid.NewGuid(),
            Name = name,
            BrandEmail = "company@test.com",
            BrandPhone = "123456789",
            Country = "US",
            City = "New York",
            PostCode = "10001",
            AddresLine1 = "123 Test St",
            CreatedDate = DateTime.UtcNow,
            BrandCustomFields = new List<BrandCustomField>(),
            Packages = new List<Package>(),
            Clients = new List<Client>(),
            BrandUsers = new List<BrandUser>()
        };

        [Fact]
        public async Task GetCompany_WhenNoBrandExists_ReturnsNull()
        {
            // Arrange
            var service = CreateService();

            // Act
            var result = await service.GetCompany();

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetCompany_WhenBrandExists_ReturnsMappedDto()
        {
            // Arrange
            var brand = CreateTestBrand("Acme Corp");
            await _brandsRepository.Add(brand);
            var service = CreateService();

            // Act
            var result = await service.GetCompany();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Acme Corp", result.Name);
            Assert.Equal("company@test.com", result.Email);
        }

        [Fact]
        public async Task UpdateCompany_WhenNoBrandExists_CreatesNewBrand()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var service = CreateService(userId.ToString());
            var dto = new UpdateCompanyDTO
            {
                Name = "New Company",
                Email = "new@company.com",
                Phone = "987654321",
                Country = "UK",
                City = "London",
                PostCode = "SW1A 1AA",
                AddressLine1 = "10 Downing St"
            };

            // Act
            var result = await service.UpdateCompany(dto);
            var brands = await _brandsRepository.Get();

            // Assert
            Assert.True(result);
            Assert.Single(brands);
            Assert.Equal("New Company", brands[0].Name);
        }

        [Fact]
        public async Task UpdateCompany_WhenBrandExists_UpdatesExistingBrand()
        {
            // Arrange
            var brand = CreateTestBrand("Old Name");
            await _brandsRepository.Add(brand);
            var service = CreateService();
            var dto = new UpdateCompanyDTO
            {
                Name = "Updated Name",
                Email = "updated@company.com",
                Phone = "111222333",
                Country = "CA",
                City = "Toronto",
                PostCode = "M5H 2N2",
                AddressLine1 = "100 King St"
            };

            // Act
            var result = await service.UpdateCompany(dto);
            var brands = await _brandsRepository.Get();

            // Assert
            Assert.True(result);
            Assert.Single(brands);
            Assert.Equal("Updated Name", brands[0].Name);
            Assert.Equal("updated@company.com", brands[0].BrandEmail);
        }

        [Fact]
        public async Task GetCompanyUsers_WhenNoUsers_ReturnsEmptyList()
        {
            // Arrange
            var service = CreateService();

            // Act
            var result = await service.GetCompanyUsers();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetCompanyUsers_WithUsers_ReturnsAllUsers()
        {
            // Arrange
            var brand = CreateTestBrand();
            await _brandsRepository.Add(brand);
            var brandUser = new BrandUser
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                BrandId = brand.Id,
                Role = BrandUserRole.Member
            };
            await _brandUsersRepository.Add(brandUser);
            var service = CreateService();

            // Act
            var result = await service.GetCompanyUsers();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
        }

        [Fact]
        public async Task AddCompanyUser_WhenBrandExists_AddsUser()
        {
            // Arrange
            var brand = CreateTestBrand();
            await _brandsRepository.Add(brand);
            var service = CreateService();
            var dto = new AddCompanyUserDTO
            {
                UserId = Guid.NewGuid(),
                Role = "Member"
            };

            // Act
            var result = await service.AddCompanyUser(dto);
            var brandUsers = await _brandUsersRepository.Get();

            // Assert
            Assert.True(result);
            Assert.Single(brandUsers);
        }

        [Fact]
        public async Task AddCompanyUser_WhenNoBrandExists_ThrowsAppException()
        {
            // Arrange
            var service = CreateService();
            var dto = new AddCompanyUserDTO
            {
                UserId = Guid.NewGuid(),
                Role = "Member"
            };

            // Act & Assert
            var ex = await Assert.ThrowsAsync<AppException>(() => service.AddCompanyUser(dto));
            Assert.Equal(ExceptionCodes.CompanyNotFound, ex.Message);
        }

        [Fact]
        public async Task RemoveCompanyUser_WhenUserExists_RemovesUser()
        {
            // Arrange
            var brand = CreateTestBrand();
            await _brandsRepository.Add(brand);
            var userId = Guid.NewGuid();
            var brandUser = new BrandUser
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                BrandId = brand.Id,
                Role = BrandUserRole.Member
            };
            await _brandUsersRepository.Add(brandUser);
            var service = CreateService();

            // Act
            var result = await service.RemoveCompanyUser(userId);
            var brandUsers = await _brandUsersRepository.Get();

            // Assert
            Assert.True(result);
            Assert.Empty(brandUsers);
        }

        [Fact]
        public async Task RemoveCompanyUser_WhenUserNotFound_ReturnsFalse()
        {
            // Arrange
            var service = CreateService();

            // Act
            var result = await service.RemoveCompanyUser(Guid.NewGuid());

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetCompanyStructure_ReturnsEmptyList()
        {
            // Arrange
            var service = CreateService();

            // Act
            var result = await service.GetCompanyStructure();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task UpdateCompanyStructure_ReturnsTrue()
        {
            // Arrange
            var service = CreateService();
            var dto = new UpdateCompanyStructureDTO
            {
                Nodes = new List<CompanyStructureNodeDTO>()
            };

            // Act
            var result = await service.UpdateCompanyStructure(dto);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task IsUserCompanyMember_WhenUserInCompany_ReturnsTrue()
        {
            // Arrange
            var brand = CreateTestBrand();
            await _brandsRepository.Add(brand);
            var userId = Guid.NewGuid();
            var brandUser = new BrandUser
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                BrandId = brand.Id,
                Role = BrandUserRole.Member
            };
            await _brandUsersRepository.Add(brandUser);
            var service = CreateService(userId.ToString());

            // Act
            var result = await service.IsUserCompanyMember();

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task IsUserCompanyMember_WhenUserNotInCompany_ReturnsFalse()
        {
            // Arrange
            var service = CreateService(Guid.NewGuid().ToString());

            // Act
            var result = await service.IsUserCompanyMember();

            // Assert
            Assert.False(result);
        }
    }
}
