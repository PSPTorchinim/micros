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
        private readonly RabbitMQProducerService _rabbitMQProducerServiceStub = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();
        private readonly IDocumentTemplatesService _service;

        public DocumentTemplatesServiceTests()
        {
            _repoMock = new Mock<IDocumentTemplatesRepository>();
            _serviceProviderMock.Setup(x => x.GetService(typeof(IDocumentTemplatesRepository))).Returns(_repoMock.Object);
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
            Assert.Equal("Test", ((List<DocumentTemplate>)result)[0].Name);
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
        public async Task Get_ById_ThrowsNotImplemented()
        {
            await Assert.ThrowsAsync<NotImplementedException>(() => _service.Get(Guid.NewGuid()));
        }

        [Fact]
        public async Task Update_ThrowsNotImplemented()
        {
            await Assert.ThrowsAsync<NotImplementedException>(() => _service.Update(Guid.NewGuid(), new DocumentTemplate()));
        }
    }
}
