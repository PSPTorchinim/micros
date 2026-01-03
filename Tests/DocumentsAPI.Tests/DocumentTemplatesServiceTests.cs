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
    public class DocumentTemplatesServiceTests
    {
        private readonly Mock<IDocumentTemplatesRepository> _repoMock = new();
        private readonly Mock<ILogger<IDocumentTemplatesService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly Mock<ICacheService> _cacheServiceMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceStub = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();
        private readonly IDocumentTemplatesService _service;

        public DocumentTemplatesServiceTests()
        {
            _repoMock = new Mock<IDocumentTemplatesRepository>();
            _cacheServiceMock = new Mock<ICacheService>();
            
            // Setup cache service mock to call through to factory for list operations
            _cacheServiceMock.Setup(x => x.GetOrCreateAsync(
                It.IsAny<string>(),
                It.IsAny<Func<Task<List<DocumentTemplate>?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns((string key, Func<Task<List<DocumentTemplate>?>> factory, TimeSpan? expiration) => factory());
            
            // Setup cache service mock for single item operations
            _cacheServiceMock.Setup(x => x.GetOrCreateAsync(
                It.IsAny<string>(),
                It.IsAny<Func<Task<DocumentTemplate?>>>(),
                It.IsAny<TimeSpan?>()))
                .Returns((string key, Func<Task<DocumentTemplate?>> factory, TimeSpan? expiration) => factory());
            
            // Setup RemoveAsync mock
            _cacheServiceMock.Setup(x => x.RemoveAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            
            _serviceProviderMock.Setup(x => x.GetService(typeof(IDocumentTemplatesRepository))).Returns(_repoMock.Object);
            _serviceProviderMock.Setup(x => x.GetService(typeof(ICacheService))).Returns(_cacheServiceMock.Object);
            _service = new DocumentTemplatesService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object,
                _rabbitMQProducerServiceStub,
                _serviceProviderMock.Object
            );
        }

        [Fact]
        public async Task Get_ReturnsTemplates()
        {
            var templates = new List<DocumentTemplate> { new DocumentTemplate { Name = "Test" } };
            _repoMock.Setup(r => r.Get()).ReturnsAsync(templates);
            var result = await _service.Get();
            Assert.NotNull(result);
            Assert.Single(result);
            var resultList = result.ToList();
            Assert.Equal("Test", resultList[0].Name);
        }

        [Fact]
        public async Task Add_ReturnsTrue()
        {
            var template = new DocumentTemplate { Name = "Test" };
            _repoMock.Setup(r => r.Add(template)).ReturnsAsync(true);
            var result = await _service.Add(template);
            Assert.True(result);
        }

        [Fact]
        public async Task Get_ById_ReturnsTemplateFromCache()
        {
            var templateId = Guid.NewGuid();
            var templates = new List<DocumentTemplate> { new DocumentTemplate { Id = templateId.ToString(), Name = "Test" } };
            _repoMock.Setup(r => r.Get(It.IsAny<Func<DocumentTemplate, bool>>())).ReturnsAsync(templates);
            
            var result = await _service.Get(templateId);
            
            Assert.NotNull(result);
            Assert.Equal("Test", result.Name);
        }

        [Fact]
        public async Task Update_ThrowsNotImplemented()
        {
            await Assert.ThrowsAsync<NotImplementedException>(() => _service.Update(Guid.NewGuid(), new DocumentTemplate()));
        }
    }
}
