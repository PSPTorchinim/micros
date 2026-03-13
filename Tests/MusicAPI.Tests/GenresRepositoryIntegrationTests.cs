using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Music.Data;
using Music.Entities;
using Music.Repositories;
using Shared.Tests;

namespace MusicAPI.Tests
{
    public class GenresRepositoryIntegrationTests
    {
        private readonly GenresRepository _repository;
        private readonly InMemoryDbContextFactory<MusicContext> _factory;

        public GenresRepositoryIntegrationTests()
        {
            _factory = new InMemoryDbContextFactory<MusicContext>();
            var loggerMock = new Mock<ILogger<IGenresRepository>>();
            _repository = new GenresRepository(_factory, loggerMock.Object);
        }

        [Fact]
        public async Task Add_Genre_PersistsToDatabase()
        {
            // Arrange
            var genre = new Genre { Id = Guid.NewGuid(), Name = "Rock" };

            // Act
            var result = await _repository.Add(genre);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task Get_AfterAdd_ReturnsAddedGenre()
        {
            // Arrange
            var genre = new Genre { Id = Guid.NewGuid(), Name = "Jazz" };
            await _repository.Add(genre);

            // Act
            var result = await _repository.Get();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Jazz", result[0].Name);
        }

        [Fact]
        public async Task Get_WithExpression_ReturnsMatchingGenre()
        {
            // Arrange
            var id = Guid.NewGuid();
            await _repository.Add(new Genre { Id = Guid.NewGuid(), Name = "Pop" });
            await _repository.Add(new Genre { Id = id, Name = "Classical" });

            // Act
            var result = await _repository.Get(g => g.Id == id);

            // Assert
            Assert.Single(result);
            Assert.Equal("Classical", result[0].Name);
        }

        [Fact]
        public async Task Update_ExistingGenre_UpdatesName()
        {
            // Arrange
            var genre = new Genre { Id = Guid.NewGuid(), Name = "Blues" };
            await _repository.Add(genre);
            genre.Name = "Rhythm & Blues";

            // Act
            var result = await _repository.Update(genre);
            var updated = (await _repository.Get(g => g.Id == genre.Id)).FirstOrDefault();

            // Assert
            Assert.True(result);
            Assert.NotNull(updated);
            Assert.Equal("Rhythm & Blues", updated.Name);
        }

        [Fact]
        public async Task Delete_ExistingGenre_RemovesFromDatabase()
        {
            // Arrange
            var genre = new Genre { Id = Guid.NewGuid(), Name = "Electronic" };
            await _repository.Add(genre);

            // Act
            var result = await _repository.Delete(genre);
            var remaining = await _repository.Get();

            // Assert
            Assert.True(result);
            Assert.Empty(remaining);
        }

        [Fact]
        public async Task Exists_WithMatchingExpression_ReturnsTrue()
        {
            // Arrange
            var genre = new Genre { Id = Guid.NewGuid(), Name = "Metal" };
            await _repository.Add(genre);

            // Act
            var exists = await _repository.Exists(g => g.Name == "Metal");

            // Assert
            Assert.True(exists);
        }

        [Fact]
        public async Task Exists_WithNoMatch_ReturnsFalse()
        {
            // Act
            var exists = await _repository.Exists(g => g.Name == "NonExistentGenre");

            // Assert
            Assert.False(exists);
        }

        [Fact]
        public async Task Empty_WhenNoRecords_ReturnsTrue()
        {
            // Act
            var isEmpty = await _repository.Empty();

            // Assert
            Assert.True(isEmpty);
        }

        [Fact]
        public async Task Empty_AfterAdd_ReturnsFalse()
        {
            // Arrange
            await _repository.Add(new Genre { Id = Guid.NewGuid(), Name = "Hip-Hop" });

            // Act
            var isEmpty = await _repository.Empty();

            // Assert
            Assert.False(isEmpty);
        }

        [Fact]
        public async Task Count_WithExpression_ReturnsCorrectCount()
        {
            // Arrange
            await _repository.Add(new Genre { Id = Guid.NewGuid(), Name = "Genre1" });
            await _repository.Add(new Genre { Id = Guid.NewGuid(), Name = "Genre2" });
            await _repository.Add(new Genre { Id = Guid.NewGuid(), Name = "Genre3" });

            // Act
            var count = await _repository.Count(g => g.Name.StartsWith("Genre"));

            // Assert
            Assert.Equal(3, count);
        }

        [Fact]
        public async Task AddRange_MultipleGenres_PersistsAll()
        {
            // Arrange
            var genres = new List<Genre>
            {
                new Genre { Id = Guid.NewGuid(), Name = "Folk" },
                new Genre { Id = Guid.NewGuid(), Name = "Country" },
                new Genre { Id = Guid.NewGuid(), Name = "Soul" }
            };

            // Act
            var result = await _repository.AddRange(genres);
            var all = await _repository.Get();

            // Assert
            Assert.True(result);
            Assert.Equal(3, all.Count);
        }

        [Fact]
        public async Task DeleteRange_MultipleGenres_RemovesAll()
        {
            // Arrange
            var genres = new List<Genre>
            {
                new Genre { Id = Guid.NewGuid(), Name = "Punk" },
                new Genre { Id = Guid.NewGuid(), Name = "Ska" }
            };
            await _repository.AddRange(genres);

            // Act
            var result = await _repository.DeleteRange(genres);
            var remaining = await _repository.Get();

            // Assert
            Assert.True(result);
            Assert.Empty(remaining);
        }
    }
}
