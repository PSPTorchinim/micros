using Microsoft.Extensions.Logging;
using Moq;
using Music.Data;
using Music.Entities;
using Music.Repositories;
using Shared.Tests;

namespace MusicAPI.Tests
{
    public class LabelsRepositoryIntegrationTests
    {
        private readonly LabelsRepository _repository;
        private readonly InMemoryDbContextFactory<MusicContext> _factory;

        public LabelsRepositoryIntegrationTests()
        {
            _factory = new InMemoryDbContextFactory<MusicContext>();
            var loggerMock = new Mock<ILogger<ILabelsRepository>>();
            _repository = new LabelsRepository(_factory, loggerMock.Object);
        }

        [Fact]
        public async Task Add_Label_PersistsToDatabase()
        {
            // Arrange
            var label = new Label { Id = Guid.NewGuid(), Name = "Warner Records" };

            // Act
            var result = await _repository.Add(label);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task Get_AfterAdd_ReturnsAddedLabel()
        {
            // Arrange
            var label = new Label { Id = Guid.NewGuid(), Name = "Sony Music" };
            await _repository.Add(label);

            // Act
            var result = await _repository.Get();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Sony Music", result[0].Name);
        }

        [Fact]
        public async Task Get_WithExpression_ReturnsMatchingLabel()
        {
            // Arrange
            var targetId = Guid.NewGuid();
            await _repository.Add(new Label { Id = Guid.NewGuid(), Name = "Universal Music" });
            await _repository.Add(new Label { Id = targetId, Name = "Atlantic Records" });

            // Act
            var result = await _repository.Get(l => l.Id == targetId);

            // Assert
            Assert.Single(result);
            Assert.Equal("Atlantic Records", result[0].Name);
        }

        [Fact]
        public async Task Update_ExistingLabel_UpdatesName()
        {
            // Arrange
            var label = new Label { Id = Guid.NewGuid(), Name = "Old Label Name" };
            await _repository.Add(label);
            label.Name = "New Label Name";

            // Act
            var result = await _repository.Update(label);
            var updated = (await _repository.Get(l => l.Id == label.Id)).FirstOrDefault();

            // Assert
            Assert.True(result);
            Assert.NotNull(updated);
            Assert.Equal("New Label Name", updated.Name);
        }

        [Fact]
        public async Task Delete_ExistingLabel_RemovesFromDatabase()
        {
            // Arrange
            var label = new Label { Id = Guid.NewGuid(), Name = "Island Records" };
            await _repository.Add(label);

            // Act
            var result = await _repository.Delete(label);
            var remaining = await _repository.Get();

            // Assert
            Assert.True(result);
            Assert.Empty(remaining);
        }

        [Fact]
        public async Task Exists_KnownLabel_ReturnsTrue()
        {
            // Arrange
            var label = new Label { Id = Guid.NewGuid(), Name = "RCA Records" };
            await _repository.Add(label);

            // Act
            var exists = await _repository.Exists(l => l.Name == "RCA Records");

            // Assert
            Assert.True(exists);
        }

        [Fact]
        public async Task Exists_UnknownLabel_ReturnsFalse()
        {
            // Act
            var exists = await _repository.Exists(l => l.Name == "Nonexistent Label");

            // Assert
            Assert.False(exists);
        }

        [Fact]
        public async Task Count_WithExpression_ReturnsCorrectCount()
        {
            // Arrange
            await _repository.Add(new Label { Id = Guid.NewGuid(), Name = "Label A" });
            await _repository.Add(new Label { Id = Guid.NewGuid(), Name = "Label B" });

            // Act
            var count = await _repository.Count(l => l.Name.StartsWith("Label"));

            // Assert
            Assert.Equal(2, count);
        }
    }
}
