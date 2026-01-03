using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using DocumentsAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;
using Xunit;

namespace DocumentsAPI.Tests
{
    public class DocumentsServiceTests
    {
        private readonly Mock<IDocumentsRepository> _repoMock = new();
        private readonly Mock<ILogger<IDocumentsService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceStub = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();
        private readonly IDocumentsService _service;

        public DocumentsServiceTests()
        {
            _repoMock = new Mock<IDocumentsRepository>();
            _cacheServiceMock = new Mock<ICacheService>();
            
            // Setup cache service mock to call through to factory
            _cacheServiceMock.Setup(x => x.GetOrCreateAsync(
                It.IsAny<string>(),
                It.IsAny<Func<Task<List<Document>?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns((string key, Func<Task<List<Document>?>> factory, TimeSpan? expiration) => factory());
            
            _serviceProviderMock.Setup(x => x.GetService(typeof(IDocumentsRepository))).Returns(_repoMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ICacheService))).Returns(_cacheServiceMock.Object);
            _service = new DocumentsService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceStub,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public async Task Get_ReturnsNull()
        {
            _repoMock.Setup(r => r.Get()).ReturnsAsync((List<Document>?)null);
            var result = await _service.Get();
            Assert.Null(result);
        }
    }
}
