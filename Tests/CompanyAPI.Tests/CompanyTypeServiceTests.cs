using AutoMapper;
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

namespace CompanyAPI.Tests
{
    public class CompanyTypeServiceTests
    {
        private readonly Mock<ICompanyTypeRepository> _repoMock = new();
        private readonly Mock<ICacheService> _cacheMock = new();
        private readonly Mock<IExternalCompanyTypeApiClient> _externalApiMock = new();
        private readonly Mock<ILogger<ICompanyTypeService>> _loggerMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IHttpContextAccessor> _httpMock = new();
        private readonly Mock<IServiceProvider> _spMock = new();
        private readonly RabbitMQProducerService _rabbitStub = null!;

        public CompanyTypeServiceTests()
        {
            _spMock.Setup(sp => sp.GetService(typeof(ICompanyTypeRepository))).Returns(_repoMock.Object);
            _spMock.Setup(sp => sp.GetService(typeof(ICacheService))).Returns(_cacheMock.Object);
            _spMock.Setup(sp => sp.GetService(typeof(IExternalCompanyTypeApiClient))).Returns(_externalApiMock.Object);

            // Wire cache to always invoke factory (no-op cache)
            _cacheMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<List<CompanyTypeDTO>?>>>(),
                    It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<List<CompanyTypeDTO>?>>, TimeSpan?>(
                    async (_, factory, __) => await factory());

            _cacheMock
                .Setup(c => c.GetOrCreateAsync(
                    It.IsAny<string>(),
                    It.IsAny<Func<Task<CompanyTypeWithFieldsDTO?>>>(),
                    It.IsAny<TimeSpan?>()))
                .Returns<string, Func<Task<CompanyTypeWithFieldsDTO?>>, TimeSpan?>(
                    async (_, factory, __) => await factory());

            _cacheMock
                .Setup(c => c.RemoveAsync(It.IsAny<string>()))
                .Returns(Task.CompletedTask);
        }

        private CompanyTypeService CreateService() =>
            new CompanyTypeService(
                _loggerMock.Object,
                _mapperMock.Object,
                _httpMock.Object,
                _rabbitStub,
                _spMock.Object);

        private static CompanyType BuildUsLlc()
        {
            var id = Guid.NewGuid();
            return new CompanyType
            {
                Id = id,
                Code = "LLC",
                CountryCode = "US",
                IsActive = true,
                DisplayOrder = 1,
                CreatedAt = DateTime.UtcNow,
                Translations = new List<CompanyTypeTranslation>
                {
                    new() { Id = Guid.NewGuid(), CompanyTypeId = id, LanguageCode = "en", Name = "Limited Liability Company (LLC)", Description = "A flexible structure." },
                    new() { Id = Guid.NewGuid(), CompanyTypeId = id, LanguageCode = "de", Name = "Gesellschaft mbH (LLC)", Description = "Eine flexible Struktur." }
                },
                Fields = new List<CompanyTypeField>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        CompanyTypeId = id,
                        FieldKey = "ein",
                        FieldType = "text",
                        IsRequired = true,
                        ValidationRegex = @"^\d{2}-\d{7}$",
                        DisplayOrder = 1,
                        Translations = new List<CompanyTypeFieldTranslation>
                        {
                            new() { Id = Guid.NewGuid(), LanguageCode = "en", Label = "EIN", HelpText = "Format XX-XXXXXXX" }
                        },
                        Options = new List<CompanyTypeFieldOption>()
                    }
                }
            };
        }

        [Fact]
        public async Task GetByCountry_ReturnsLocalisedList()
        {
            // Arrange
            var ct = BuildUsLlc();
            _repoMock.Setup(r => r.GetByCountry("US")).ReturnsAsync(new List<CompanyType> { ct });
            var svc = CreateService();

            // Act
            var result = await svc.GetByCountry("US", "en");

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("LLC", result[0].Code);
            Assert.Equal("Limited Liability Company (LLC)", result[0].Name);
        }

        [Fact]
        public async Task GetByCountry_FallsBackToEnglishWhenRequestedLangMissing()
        {
            // Arrange
            var ct = BuildUsLlc(); // only has en + de translations
            _repoMock.Setup(r => r.GetByCountry("US")).ReturnsAsync(new List<CompanyType> { ct });
            var svc = CreateService();

            // Act
            var result = await svc.GetByCountry("US", "fr"); // French not available

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Limited Liability Company (LLC)", result[0].Name); // falls back to "en"
        }

        [Fact]
        public async Task GetByCountry_WhenNoTypes_ReturnsEmptyList()
        {
            // Arrange
            _repoMock.Setup(r => r.GetByCountry("AU")).ReturnsAsync(new List<CompanyType>());
            var svc = CreateService();

            // Act
            var result = await svc.GetByCountry("AU", "en");

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetWithFields_ReturnsTypeWithLocalisedFields()
        {
            // Arrange
            var ct = BuildUsLlc();
            _repoMock.Setup(r => r.GetById(ct.Id)).ReturnsAsync(ct);
            var svc = CreateService();

            // Act
            var result = await svc.GetWithFields(ct.Id, "en");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("LLC", result!.Code);
            Assert.Single(result.Fields);
            Assert.Equal("EIN", result.Fields[0].Label);
        }

        [Fact]
        public async Task GetWithFields_WhenNotFound_ReturnsNull()
        {
            // Arrange
            _repoMock.Setup(r => r.GetById(It.IsAny<Guid>())).ReturnsAsync((CompanyType?)null);
            var svc = CreateService();

            // Act
            var result = await svc.GetWithFields(Guid.NewGuid(), "en");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task Create_AddsEntityAndReturnsDto()
        {
            // Arrange
            _repoMock.Setup(r => r.Add(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();
            var dto = new CreateCompanyTypeDTO
            {
                Code = "LTD",
                CountryCode = "GB",
                IsActive = true,
                DisplayOrder = 1,
                Translations = new List<CreateCompanyTypeTranslationDTO>
                {
                    new() { LanguageCode = "en", Name = "Private Limited Company (Ltd)", Description = "A UK private limited company." }
                }
            };

            // Act
            var result = await svc.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("LTD", result!.Code);
            Assert.Equal("GB", result.CountryCode);
            _repoMock.Verify(r => r.Add(It.IsAny<CompanyType>()), Times.Once);
        }

        [Fact]
        public async Task Update_WhenTypeExists_UpdatesAndReturnsTrue()
        {
            // Arrange
            var ct = BuildUsLlc();
            _repoMock.Setup(r => r.GetById(ct.Id)).ReturnsAsync(ct);
            _repoMock.Setup(r => r.Update(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();
            var dto = new UpdateCompanyTypeDTO { IsActive = false, DisplayOrder = 99, Translations = new() };

            // Act
            var result = await svc.Update(ct.Id, dto);

            // Assert
            Assert.True(result);
            _repoMock.Verify(r => r.Update(It.Is<CompanyType>(ct => !ct.IsActive && ct.DisplayOrder == 99)), Times.Once);
        }

        [Fact]
        public async Task Update_WhenTypeNotFound_ThrowsAppException()
        {
            // Arrange
            _repoMock.Setup(r => r.GetById(It.IsAny<Guid>())).ReturnsAsync((CompanyType?)null);
            var svc = CreateService();

            // Act & Assert
            var ex = await Assert.ThrowsAsync<AppException>(() =>
                svc.Update(Guid.NewGuid(), new UpdateCompanyTypeDTO { Translations = new() }));
            Assert.Equal(ExceptionCodes.NotFound, ex.Message);
        }

        [Fact]
        public async Task Delete_WhenTypeExists_DeletesAndReturnsTrue()
        {
            // Arrange
            var ct = BuildUsLlc();
            _repoMock.Setup(r => r.GetById(ct.Id)).ReturnsAsync(ct);
            _repoMock.Setup(r => r.Delete(ct.Id)).ReturnsAsync(true);
            var svc = CreateService();

            // Act
            var result = await svc.Delete(ct.Id);

            // Assert
            Assert.True(result);
            _repoMock.Verify(r => r.Delete(ct.Id), Times.Once);
        }

        [Fact]
        public async Task Delete_WhenTypeNotFound_ThrowsAppException()
        {
            // Arrange
            _repoMock.Setup(r => r.GetById(It.IsAny<Guid>())).ReturnsAsync((CompanyType?)null);
            var svc = CreateService();

            // Act & Assert
            var ex = await Assert.ThrowsAsync<AppException>(() => svc.Delete(Guid.NewGuid()));
            Assert.Equal(ExceptionCodes.NotFound, ex.Message);
        }

        [Fact]
        public async Task AddField_WhenTypeExists_AddsFieldAndReturnsTrue()
        {
            // Arrange
            var ct = BuildUsLlc();
            _repoMock.Setup(r => r.GetById(ct.Id)).ReturnsAsync(ct);
            _repoMock.Setup(r => r.Update(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();
            var dto = new CreateCompanyTypeFieldDTO
            {
                FieldKey = "stateOfFormation",
                FieldType = "text",
                IsRequired = true,
                DisplayOrder = 2,
                Translations = new List<CreateCompanyTypeFieldTranslationDTO>
                {
                    new() { LanguageCode = "en", Label = "State of Formation" }
                }
            };

            // Act
            var result = await svc.AddField(ct.Id, dto);

            // Assert
            Assert.True(result);
            _repoMock.Verify(r => r.Update(It.Is<CompanyType>(ct => ct.Fields.Any(f => f.FieldKey == "stateOfFormation"))), Times.Once);
        }

        [Fact]
        public async Task AddField_WhenTypeNotFound_ThrowsAppException()
        {
            // Arrange
            _repoMock.Setup(r => r.GetById(It.IsAny<Guid>())).ReturnsAsync((CompanyType?)null);
            var svc = CreateService();

            // Act & Assert
            var ex = await Assert.ThrowsAsync<AppException>(() =>
                svc.AddField(Guid.NewGuid(), new CreateCompanyTypeFieldDTO
                {
                    FieldKey = "test",
                    FieldType = "text",
                    Translations = new()
                }));
            Assert.Equal(ExceptionCodes.NotFound, ex.Message);
        }

        [Fact]
        public async Task UpdateFieldTranslations_WhenFieldExists_UpdatesAndReturnsTrue()
        {
            // Arrange
            var ct = BuildUsLlc();
            var fieldId = ct.Fields[0].Id;
            _repoMock.Setup(r => r.GetById(ct.Id)).ReturnsAsync(ct);
            _repoMock.Setup(r => r.Update(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();
            var dto = new UpdateFieldTranslationsDTO
            {
                Translations = new List<CreateCompanyTypeFieldTranslationDTO>
                {
                    new() { LanguageCode = "en", Label = "Updated EIN Label" },
                    new() { LanguageCode = "de", Label = "Aktualisiertes EIN-Label" }
                }
            };

            // Act
            var result = await svc.UpdateFieldTranslations(ct.Id, fieldId, dto);

            // Assert
            Assert.True(result);
            _repoMock.Verify(r => r.Update(It.Is<CompanyType>(ct =>
                ct.Fields.First(f => f.Id == fieldId).Translations.Count == 2)), Times.Once);
        }

        [Fact]
        public async Task UpdateFieldTranslations_WhenFieldNotFound_ThrowsAppException()
        {
            // Arrange
            var ct = BuildUsLlc();
            _repoMock.Setup(r => r.GetById(ct.Id)).ReturnsAsync(ct);
            var svc = CreateService();

            // Act & Assert
            var ex = await Assert.ThrowsAsync<AppException>(() =>
                svc.UpdateFieldTranslations(ct.Id, Guid.NewGuid(), new UpdateFieldTranslationsDTO { Translations = new() }));
            Assert.Equal(ExceptionCodes.NotFound, ex.Message);
        }

        // ── SyncFromExternalApiAsync tests ────────────────────────────────────

        [Fact]
        public async Task SyncFromExternalApi_WhenNoExternalTypes_ReturnsEmptyResult()
        {
            // Arrange
            _externalApiMock.Setup(c => c.FetchCompanyTypesAsync("AU")).ReturnsAsync(new List<ExternalCompanyTypeDefinition>());
            _repoMock.Setup(r => r.GetByCountry("AU")).ReturnsAsync(new List<CompanyType>());
            var svc = CreateService();

            // Act
            var result = await svc.SyncFromExternalApiAsync("AU");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("AU", result.CountryCode);
            Assert.Equal(0, result.Created);
            Assert.Equal(0, result.Updated);
            Assert.Equal(0, result.Failed);
        }

        [Fact]
        public async Task SyncFromExternalApi_WhenNewType_CreatesInRepository()
        {
            // Arrange
            var externalType = new ExternalCompanyTypeDefinition
            {
                Code = "SARL",
                CountryCode = "FR",
                IsActive = true,
                DisplayOrder = 2,
                Translations = new List<CreateCompanyTypeTranslationDTO>
                {
                    new() { LanguageCode = "en", Name = "Limited Liability Company (SARL)", Description = "A French private company." },
                    new() { LanguageCode = "fr", Name = "Société à Responsabilité Limitée (SARL)", Description = "Une société française à responsabilité limitée." }
                },
                Fields = new List<ExternalCompanyTypeFieldDefinition>
                {
                    new()
                    {
                        FieldKey = "siret",
                        FieldType = "text",
                        IsRequired = true,
                        ValidationRegex = @"^\d{14}$",
                        DisplayOrder = 1,
                        Translations = new List<CreateCompanyTypeFieldTranslationDTO>
                        {
                            new() { LanguageCode = "en", Label = "SIRET Number", HelpText = "14-digit business ID" }
                        }
                    }
                }
            };

            _externalApiMock.Setup(c => c.FetchCompanyTypesAsync("FR")).ReturnsAsync(new List<ExternalCompanyTypeDefinition> { externalType });
            _repoMock.Setup(r => r.GetByCountry("FR")).ReturnsAsync(new List<CompanyType>()); // no existing types
            _repoMock.Setup(r => r.Add(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();

            // Act
            var result = await svc.SyncFromExternalApiAsync("FR");

            // Assert
            Assert.Equal(1, result.Created);
            Assert.Equal(0, result.Updated);
            _repoMock.Verify(r => r.Add(It.Is<CompanyType>(ct =>
                ct.Code == "SARL" &&
                ct.CountryCode == "FR" &&
                ct.Fields.Count == 1 &&
                ct.Fields[0].FieldKey == "siret")), Times.Once);
        }

        [Fact]
        public async Task SyncFromExternalApi_WhenExistingType_UpdatesInRepository()
        {
            // Arrange
            var existing = BuildUsLlc();

            var externalType = new ExternalCompanyTypeDefinition
            {
                Code = "LLC",
                CountryCode = "US",
                IsActive = false, // deactivated in external API
                DisplayOrder = 99,
                Translations = new List<CreateCompanyTypeTranslationDTO>
                {
                    new() { LanguageCode = "en", Name = "Updated LLC Name", Description = "Updated description." }
                },
                Fields = new List<ExternalCompanyTypeFieldDefinition>()
            };

            _externalApiMock.Setup(c => c.FetchCompanyTypesAsync("US")).ReturnsAsync(new List<ExternalCompanyTypeDefinition> { externalType });
            _repoMock.Setup(r => r.GetByCountry("US")).ReturnsAsync(new List<CompanyType> { existing });
            _repoMock.Setup(r => r.Update(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();

            // Act
            var result = await svc.SyncFromExternalApiAsync("US");

            // Assert
            Assert.Equal(0, result.Created);
            Assert.Equal(1, result.Updated);
            _repoMock.Verify(r => r.Update(It.Is<CompanyType>(ct =>
                ct.Code == "LLC" &&
                !ct.IsActive &&
                ct.DisplayOrder == 99)), Times.Once);
        }

        [Fact]
        public async Task SyncFromExternalApi_MixedNewAndExisting_ReturnsCorrectCounts()
        {
            // Arrange
            var existingLlc = BuildUsLlc();
            var externalTypes = new List<ExternalCompanyTypeDefinition>
            {
                new() // matches existing LLC
                {
                    Code = "LLC", CountryCode = "US", IsActive = true, DisplayOrder = 1,
                    Translations = new List<CreateCompanyTypeTranslationDTO>
                    {
                        new() { LanguageCode = "en", Name = "LLC", Description = "" }
                    },
                    Fields = new List<ExternalCompanyTypeFieldDefinition>()
                },
                new() // new type
                {
                    Code = "C-CORP", CountryCode = "US", IsActive = true, DisplayOrder = 2,
                    Translations = new List<CreateCompanyTypeTranslationDTO>
                    {
                        new() { LanguageCode = "en", Name = "C-Corporation", Description = "" }
                    },
                    Fields = new List<ExternalCompanyTypeFieldDefinition>()
                }
            };

            _externalApiMock.Setup(c => c.FetchCompanyTypesAsync("US")).ReturnsAsync(externalTypes);
            _repoMock.Setup(r => r.GetByCountry("US")).ReturnsAsync(new List<CompanyType> { existingLlc });
            _repoMock.Setup(r => r.Add(It.IsAny<CompanyType>())).ReturnsAsync(true);
            _repoMock.Setup(r => r.Update(It.IsAny<CompanyType>())).ReturnsAsync(true);
            var svc = CreateService();

            // Act
            var result = await svc.SyncFromExternalApiAsync("US");

            // Assert
            Assert.Equal(1, result.Created);
            Assert.Equal(1, result.Updated);
            Assert.Equal(0, result.Failed);
        }
    }
}
