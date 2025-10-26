using AutoMapper;
using CompanyAPI.Data.Models;
using CompanyAPI.Entities;
using CompanyAPI.Repositories;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace CompanyAPI.Tests
{
    public class BrandsServiceTests
    {
        private readonly Mock<IBrandsRepository> _brandsRepositoryMock = new();
        private readonly Mock<ILogger<IBrandsService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceMock = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();
        private readonly IBrandsService _brandsService;

        public BrandsServiceTests()
        {
            _brandsRepositoryMock = new Mock<IBrandsRepository>();
            _loggerMock = new Mock<ILogger<IBrandsService>>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _serviceProviderMock.Setup(x => x.GetService(typeof(IBrandsRepository))).Returns(_brandsRepositoryMock.Object);
            _brandsService = new BrandsService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceMock,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public async Task Get_ReturnsListOfBrands()
        {
            // Arrange
            var brands = new List<Brand> { new Brand { BrandEmail = "test@email.com" } };
            _brandsRepositoryMock.Setup(r => r.Get()).ReturnsAsync(brands);

            // Act
            var result = await _brandsService.Get();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("test@email.com", result[0].BrandEmail);
        }

        [Fact]
        public async Task RegisterBrand_ReturnsFalse()
        {
            // Arrange
            var dto = new RegisterBrandDTO();

            // Act
            var result = await _brandsService.RegisterBrand(dto);

            // Assert
            Assert.False(result);
        }
    }
}
