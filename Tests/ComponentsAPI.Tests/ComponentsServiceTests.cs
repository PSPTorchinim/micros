using ComponentsAPI.Entities;
using ComponentsAPI.Repositories;
using ComponentsAPI.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace ComponentsAPI.Tests
{
    public class ComponentsServiceTests
    {
        private readonly Mock<IComponentsRepository> _mockRepository;
        private readonly Mock<ILogger<ComponentsService>> _mockLogger;
        private readonly ComponentsService _service;

        public ComponentsServiceTests()
        {
            _mockRepository = new Mock<IComponentsRepository>();
            _mockLogger = new Mock<ILogger<ComponentsService>>();
            _service = new ComponentsService(_mockRepository.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllComponentsAsync_ReturnsAllComponents()
        {
            // Arrange
            var components = new List<Component>
            {
                new Component { Id = 1, Name = "Button", Description = "A button component", Category = "Form" },
                new Component { Id = 2, Name = "Card", Description = "A card component", Category = "Layout" }
            };
            _mockRepository.Setup(r => r.Get()).ReturnsAsync(components);

            // Act
            var result = await _service.GetAllComponentsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetComponentByIdAsync_ReturnsComponent()
        {
            // Arrange
            var component = new Component { Id = 1, Name = "Button", Description = "A button component", Category = "Form" };
            _mockRepository.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Component, bool>>>()))
                .ReturnsAsync(new List<Component> { component });

            // Act
            var result = await _service.GetComponentByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Button", result.Name);
        }

        [Fact]
        public async Task CreateComponentAsync_CreatesComponent()
        {
            // Arrange
            var component = new Component { Name = "Input", Description = "An input component", Category = "Form" };
            _mockRepository.Setup(r => r.Add(component)).ReturnsAsync(true);
            _mockRepository.Setup(r => r.Save()).ReturnsAsync(true);

            // Act
            var result = await _service.CreateComponentAsync(component);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Input", result.Name);
            _mockRepository.Verify(r => r.Add(component), Times.Once);
            _mockRepository.Verify(r => r.Save(), Times.Once);
        }

        [Fact]
        public async Task DeleteComponentAsync_DeletesComponent()
        {
            // Arrange
            var component = new Component { Id = 1, Name = "Button", Description = "A button component", Category = "Form" };
            _mockRepository.Setup(r => r.Get(It.IsAny<System.Linq.Expressions.Expression<Func<Component, bool>>>()))
                .ReturnsAsync(new List<Component> { component });
            _mockRepository.Setup(r => r.Delete(component)).ReturnsAsync(true);

            // Act
            var result = await _service.DeleteComponentAsync(1);

            // Assert
            Assert.True(result);
            _mockRepository.Verify(r => r.Delete(component), Times.Once);
        }
    }
}
