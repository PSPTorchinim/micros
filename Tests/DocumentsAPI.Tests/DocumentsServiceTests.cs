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
    public class DocumentsServiceTests
    {
        private readonly Mock<IDocumentsRepository> _repoMock = new();
        private readonly Mock<ILogger<IDocumentsService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock = new();
        private readonly RabbitMQProducerService _rabbitMQProducerServiceStub = null!;
        private readonly Mock<IServiceProvider> _serviceProviderMock = new();
        private readonly IDocumentsService _service;

        public DocumentsServiceTests()
        {
            _repoMock = new Mock<IDocumentsRepository>();
            _serviceProviderMock.Setup(x => x.GetService(typeof(IDocumentsRepository))).Returns(_repoMock.Object);
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
            _repoMock.Setup(r => r.Get()).ReturnsAsync((List<Document>)null!);
            var result = await _service.Get();
            Assert.Null(result);
        }
    }
}
