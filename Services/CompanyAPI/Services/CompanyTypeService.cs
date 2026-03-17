using AutoMapper;
using CompanyAPI.Data.Models;
using CompanyAPI.Entities;
using CompanyAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Services.App;
using Shared.Services.Cache;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace CompanyAPI.Services
{
    public interface ICompanyTypeService : IService
    {
        Task<List<CompanyTypeDTO>> GetByCountry(string countryCode, string languageCode);
        Task<List<CompanyTypeDTO>> GetAll(string languageCode = "en");
        Task<CompanyTypeWithFieldsDTO?> GetWithFields(Guid id, string languageCode);
        Task<CompanyTypeDTO?> Create(CreateCompanyTypeDTO dto);
        Task<bool> Update(Guid id, UpdateCompanyTypeDTO dto);
        Task<bool> AddField(Guid companyTypeId, CreateCompanyTypeFieldDTO dto);
        Task<bool> UpdateFieldTranslations(Guid companyTypeId, Guid fieldId, UpdateFieldTranslationsDTO dto);
        Task<bool> Delete(Guid id);
        Task<CompanyTypeSyncResultDTO> SyncFromExternalApiAsync(string countryCode);
        Task<CompanyTypeSyncResultDTO> ImportFromDefinitionsAsync(List<ExternalCompanyTypeDefinition> definitions);
    }

    public class CompanyTypeService : BaseService<ICompanyTypeService>, ICompanyTypeService
    {
        private readonly ICompanyTypeRepository _companyTypeRepository;
        private readonly IExternalCompanyTypeApiClient _externalApiClient;
        private readonly ICacheService _cacheService;

        private const string CachePrefix = "CompanyType_";
        private static readonly TimeSpan CountryCacheExpiration = TimeSpan.FromMinutes(5);
        private static readonly TimeSpan FieldsCacheExpiration = TimeSpan.FromMinutes(10);

        public CompanyTypeService(
            ILogger<ICompanyTypeService> logger,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            RabbitMQProducerService rabbitMQProducerService,
            IServiceProvider serviceProvider)
            : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _companyTypeRepository = serviceProvider.GetRequiredService<ICompanyTypeRepository>();
            _externalApiClient = serviceProvider.GetRequiredService<IExternalCompanyTypeApiClient>();
            _cacheService = serviceProvider.GetRequiredService<ICacheService>();
        }

        public async Task<List<CompanyTypeDTO>> GetByCountry(string countryCode, string languageCode)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{CachePrefix}Country_{countryCode}_{languageCode}";

                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for company types by country {CountryCode}.", countryCode);
                        var types = await _companyTypeRepository.GetByCountry(countryCode);

                        return types.Select(ct => MapToDto(ct, languageCode)).ToList();
                    },
                    CountryCacheExpiration
                );

                return result ?? new List<CompanyTypeDTO>();
            }, _logger);
        }

        public async Task<List<CompanyTypeDTO>> GetAll(string languageCode = "en")
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var types = await _companyTypeRepository.Get();
                return types.Select(ct => MapToDto(ct, languageCode)).ToList();
            }, _logger);
        }

        public async Task<CompanyTypeWithFieldsDTO?> GetWithFields(Guid id, string languageCode)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var cacheKey = $"{CachePrefix}Fields_{id}_{languageCode}";

                var result = await _cacheService.GetOrCreateAsync(
                    cacheKey,
                    async () =>
                    {
                        _logger.LogDebug("Cache miss for company type fields {Id}.", id);
                        var ct = await _companyTypeRepository.GetById(id);
                        if (ct == null) return null;

                        return MapToWithFieldsDto(ct, languageCode);
                    },
                    FieldsCacheExpiration
                );

                return result;
            }, _logger);
        }

        public async Task<CompanyTypeDTO?> Create(CreateCompanyTypeDTO dto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var entity = new CompanyType
                {
                    Id = Guid.NewGuid(),
                    Code = dto.Code.ToUpperInvariant(),
                    CountryCode = dto.CountryCode.ToUpperInvariant(),
                    IsActive = dto.IsActive,
                    DisplayOrder = dto.DisplayOrder,
                    CreatedAt = DateTime.UtcNow,
                    Translations = dto.Translations.Select(t => new CompanyTypeTranslation
                    {
                        Id = Guid.NewGuid(),
                        LanguageCode = t.LanguageCode.ToLowerInvariant(),
                        Name = t.Name,
                        Description = t.Description
                    }).ToList(),
                    Fields = new List<CompanyTypeField>()
                };

                foreach (var translation in entity.Translations)
                {
                    translation.CompanyTypeId = entity.Id;
                }

                await _companyTypeRepository.Add(entity);
                await InvalidateCountryCacheAsync(entity.CountryCode);

                return MapToDto(entity, dto.Translations.FirstOrDefault()?.LanguageCode ?? "en");
            }, _logger);
        }

        public async Task<bool> Update(Guid id, UpdateCompanyTypeDTO dto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var entity = await _companyTypeRepository.GetById(id);
                if (entity == null)
                {
                    throw new AppException(ExceptionCodes.NotFound);
                }

                entity.IsActive = dto.IsActive;
                entity.DisplayOrder = dto.DisplayOrder;

                if (dto.Translations.Any())
                {
                    entity.Translations = dto.Translations.Select(t => new CompanyTypeTranslation
                    {
                        Id = Guid.NewGuid(),
                        CompanyTypeId = entity.Id,
                        LanguageCode = t.LanguageCode.ToLowerInvariant(),
                        Name = t.Name,
                        Description = t.Description
                    }).ToList();
                }

                var result = await _companyTypeRepository.Update(entity);
                if (result)
                {
                    await InvalidateCountryCacheAsync(entity.CountryCode);
                    await _cacheService.RemoveAsync($"{CachePrefix}Fields_{id}_*");
                }

                return result;
            }, _logger);
        }

        public async Task<bool> AddField(Guid companyTypeId, CreateCompanyTypeFieldDTO dto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var entity = await _companyTypeRepository.GetById(companyTypeId);
                if (entity == null)
                {
                    throw new AppException(ExceptionCodes.NotFound);
                }

                var field = new CompanyTypeField
                {
                    Id = Guid.NewGuid(),
                    CompanyTypeId = companyTypeId,
                    FieldKey = dto.FieldKey,
                    FieldType = dto.FieldType,
                    IsRequired = dto.IsRequired,
                    ValidationRegex = dto.ValidationRegex,
                    ValidationMessage = dto.ValidationMessage,
                    DisplayOrder = dto.DisplayOrder,
                    DefaultValue = dto.DefaultValue,
                    Placeholder = dto.Placeholder,
                    MaxLength = dto.MaxLength,
                    MinLength = dto.MinLength,
                    Translations = dto.Translations.Select(t => new CompanyTypeFieldTranslation
                    {
                        Id = Guid.NewGuid(),
                        LanguageCode = t.LanguageCode.ToLowerInvariant(),
                        Label = t.Label,
                        HelpText = t.HelpText,
                        ValidationMessage = t.ValidationMessage
                    }).ToList(),
                    Options = new List<CompanyTypeFieldOption>()
                };

                foreach (var translation in field.Translations)
                {
                    translation.CompanyTypeFieldId = field.Id;
                }

                entity.Fields.Add(field);
                var result = await _companyTypeRepository.Update(entity);

                if (result)
                {
                    await InvalidateFieldsCacheAsync(companyTypeId);
                }

                return result;
            }, _logger);
        }

        public async Task<bool> UpdateFieldTranslations(Guid companyTypeId, Guid fieldId, UpdateFieldTranslationsDTO dto)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var entity = await _companyTypeRepository.GetById(companyTypeId);
                if (entity == null)
                {
                    throw new AppException(ExceptionCodes.NotFound);
                }

                var field = entity.Fields.FirstOrDefault(f => f.Id == fieldId);
                if (field == null)
                {
                    throw new AppException(ExceptionCodes.NotFound);
                }

                field.Translations = dto.Translations.Select(t => new CompanyTypeFieldTranslation
                {
                    Id = Guid.NewGuid(),
                    CompanyTypeFieldId = fieldId,
                    LanguageCode = t.LanguageCode.ToLowerInvariant(),
                    Label = t.Label,
                    HelpText = t.HelpText,
                    ValidationMessage = t.ValidationMessage
                }).ToList();

                var result = await _companyTypeRepository.Update(entity);

                if (result)
                {
                    await InvalidateFieldsCacheAsync(companyTypeId);
                }

                return result;
            }, _logger);
        }

        public async Task<bool> Delete(Guid id)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var entity = await _companyTypeRepository.GetById(id);
                if (entity == null)
                {
                    throw new AppException(ExceptionCodes.NotFound);
                }

                var result = await _companyTypeRepository.Delete(id);
                if (result)
                {
                    await InvalidateCountryCacheAsync(entity.CountryCode);
                    await InvalidateFieldsCacheAsync(id);
                }

                return result;
            }, _logger);
        }

        public async Task<CompanyTypeSyncResultDTO> ImportFromDefinitionsAsync(List<ExternalCompanyTypeDefinition> definitions)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var syncResult = new CompanyTypeSyncResultDTO { CountryCode = "MULTI" };
                var affectedCountries = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

                foreach (var definition in definitions)
                {
                    try
                    {
                        var normalizedCode = definition.Code.ToUpperInvariant();
                        var normalizedCountry = definition.CountryCode.ToUpperInvariant();

                        var allTypes = await _companyTypeRepository.GetByCountry(normalizedCountry);
                        var existing = allTypes.FirstOrDefault(ct =>
                            ct.Code.Equals(normalizedCode, StringComparison.OrdinalIgnoreCase));

                        if (existing != null)
                        {
                            existing.IsActive = definition.IsActive;
                            existing.DisplayOrder = definition.DisplayOrder;
                            existing.Translations = MapExternalTranslations(definition.Translations, existing.Id);
                            existing.Fields = MapExternalFields(definition.Fields, existing.Id);
                            await _companyTypeRepository.Update(existing);
                            syncResult.Updated++;
                        }
                        else
                        {
                            var newType = BuildEntityFromExternal(definition);
                            await _companyTypeRepository.Add(newType);
                            syncResult.Created++;
                        }

                        affectedCountries.Add(normalizedCountry);
                    }
                    catch (Exception ex)
                    {
                        syncResult.Failed++;
                        syncResult.Errors.Add($"{definition.Code}: {ex.Message}");
                        _logger.LogError(ex, "Failed to import company type {Code}", definition.Code);
                    }
                }

                foreach (var country in affectedCountries)
                {
                    await InvalidateCountryCacheAsync(country);
                }

                _logger.LogInformation(
                    "Import completed: {Created} created, {Updated} updated, {Failed} failed",
                    syncResult.Created, syncResult.Updated, syncResult.Failed);

                return syncResult;
            }, _logger);
        }

        public async Task<CompanyTypeSyncResultDTO> SyncFromExternalApiAsync(string countryCode)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var syncResult = new CompanyTypeSyncResultDTO { CountryCode = countryCode.ToUpperInvariant() };

                var externalTypes = await _externalApiClient.FetchCompanyTypesAsync(countryCode);

                if (!externalTypes.Any())
                {
                    _logger.LogWarning("No company type definitions returned from external API for country {CountryCode}", countryCode);
                    return syncResult;
                }

                var existingTypes = await _companyTypeRepository.GetByCountry(countryCode);

                foreach (var externalType in externalTypes)
                {
                    try
                    {
                        // Normalize once before comparison
                        var normalizedCode = externalType.Code.ToUpperInvariant();
                        var normalizedCountry = externalType.CountryCode.ToUpperInvariant();

                        var existing = existingTypes.FirstOrDefault(ct =>
                            ct.Code == normalizedCode &&
                            ct.CountryCode == normalizedCountry);

                        if (existing != null)
                        {
                            existing.IsActive = externalType.IsActive;
                            existing.DisplayOrder = externalType.DisplayOrder;
                            // MongoDB uses a full-document replace (ReplaceOneAsync), so overwriting
                            // embedded collections is safe and atomic — there are no orphaned rows.
                            existing.Translations = MapExternalTranslations(externalType.Translations, existing.Id);
                            existing.Fields = MapExternalFields(externalType.Fields, existing.Id);
                            await _companyTypeRepository.Update(existing);
                            syncResult.Updated++;
                            _logger.LogDebug("Updated company type {Code} for country {CountryCode}", normalizedCode, normalizedCountry);
                        }
                        else
                        {
                            var newType = BuildEntityFromExternal(externalType);
                            await _companyTypeRepository.Add(newType);
                            syncResult.Created++;
                            _logger.LogDebug("Created company type {Code} for country {CountryCode}", normalizedCode, normalizedCountry);
                        }
                    }
                    catch (Exception ex)
                    {
                        syncResult.Failed++;
                        syncResult.Errors.Add($"{externalType.Code}: {ex.Message}");
                        _logger.LogError(ex, "Failed to sync company type {Code} for country {CountryCode}", externalType.Code, countryCode);
                    }
                }

                await InvalidateCountryCacheAsync(countryCode.ToUpperInvariant());

                _logger.LogInformation(
                    "Sync completed for country {CountryCode}: {Created} created, {Updated} updated, {Failed} failed",
                    countryCode, syncResult.Created, syncResult.Updated, syncResult.Failed);

                return syncResult;
            }, _logger);
        }

        private static CompanyTypeDTO MapToDto(CompanyType ct, string languageCode)
        {
            var translation = ct.Translations.FirstOrDefault(t => t.LanguageCode == languageCode.ToLowerInvariant())
                ?? ct.Translations.FirstOrDefault(t => t.LanguageCode == "en")
                ?? ct.Translations.FirstOrDefault();

            return new CompanyTypeDTO
            {
                Id = ct.Id,
                Code = ct.Code,
                CountryCode = ct.CountryCode,
                IsActive = ct.IsActive,
                DisplayOrder = ct.DisplayOrder,
                Name = translation?.Name ?? ct.Code,
                Description = translation?.Description ?? string.Empty
            };
        }

        private static CompanyTypeWithFieldsDTO MapToWithFieldsDto(CompanyType ct, string languageCode)
        {
            var lang = languageCode.ToLowerInvariant();

            var translation = ct.Translations.FirstOrDefault(t => t.LanguageCode == lang)
                ?? ct.Translations.FirstOrDefault(t => t.LanguageCode == "en")
                ?? ct.Translations.FirstOrDefault();

            return new CompanyTypeWithFieldsDTO
            {
                Id = ct.Id,
                Code = ct.Code,
                CountryCode = ct.CountryCode,
                IsActive = ct.IsActive,
                DisplayOrder = ct.DisplayOrder,
                Name = translation?.Name ?? ct.Code,
                Description = translation?.Description ?? string.Empty,
                Fields = ct.Fields
                    .OrderBy(f => f.DisplayOrder)
                    .Select(f => MapFieldToDto(f, lang))
                    .ToList()
            };
        }

        private static CompanyTypeFieldDTO MapFieldToDto(CompanyTypeField field, string languageCode)
        {
            var translation = field.Translations.FirstOrDefault(t => t.LanguageCode == languageCode)
                ?? field.Translations.FirstOrDefault(t => t.LanguageCode == "en")
                ?? field.Translations.FirstOrDefault();

            return new CompanyTypeFieldDTO
            {
                Id = field.Id,
                FieldKey = field.FieldKey,
                FieldType = field.FieldType,
                IsRequired = field.IsRequired,
                ValidationRegex = field.ValidationRegex,
                ValidationMessage = translation?.ValidationMessage ?? field.ValidationMessage,
                DisplayOrder = field.DisplayOrder,
                DefaultValue = field.DefaultValue,
                Placeholder = field.Placeholder,
                MaxLength = field.MaxLength,
                MinLength = field.MinLength,
                Label = translation?.Label ?? field.FieldKey,
                HelpText = translation?.HelpText,
                Options = field.Options
                    .OrderBy(o => o.DisplayOrder)
                    .Select(o => MapOptionToDto(o, languageCode))
                    .ToList()
            };
        }

        private static CompanyTypeFieldOptionDTO MapOptionToDto(CompanyTypeFieldOption option, string languageCode)
        {
            var translation = option.Translations.FirstOrDefault(t => t.LanguageCode == languageCode)
                ?? option.Translations.FirstOrDefault(t => t.LanguageCode == "en")
                ?? option.Translations.FirstOrDefault();

            return new CompanyTypeFieldOptionDTO
            {
                Id = option.Id,
                Value = option.Value,
                DisplayOrder = option.DisplayOrder,
                Label = translation?.Label ?? option.Value
            };
        }

        private static readonly string[] SupportedLanguageCodes = { "en", "de", "fr", "es", "pl" };

        private async Task InvalidateCountryCacheAsync(string countryCode)
        {
            foreach (var lang in SupportedLanguageCodes)
            {
                await _cacheService.RemoveAsync($"{CachePrefix}Country_{countryCode}_{lang}");
            }
        }

        private async Task InvalidateFieldsCacheAsync(Guid companyTypeId)
        {
            foreach (var lang in SupportedLanguageCodes)
            {
                await _cacheService.RemoveAsync($"{CachePrefix}Fields_{companyTypeId}_{lang}");
            }
        }

        private static CompanyType BuildEntityFromExternal(ExternalCompanyTypeDefinition ext)
        {
            var id = Guid.NewGuid();
            return new CompanyType
            {
                Id = id,
                Code = ext.Code.ToUpperInvariant(),
                CountryCode = ext.CountryCode.ToUpperInvariant(),
                IsActive = ext.IsActive,
                DisplayOrder = ext.DisplayOrder,
                CreatedAt = DateTime.UtcNow,
                Translations = MapExternalTranslations(ext.Translations, id),
                Fields = MapExternalFields(ext.Fields, id)
            };
        }

        private static List<CompanyTypeTranslation> MapExternalTranslations(
            List<CreateCompanyTypeTranslationDTO> source, Guid companyTypeId) =>
            source.Select(t => new CompanyTypeTranslation
            {
                Id = Guid.NewGuid(),
                CompanyTypeId = companyTypeId,
                LanguageCode = t.LanguageCode.ToLowerInvariant(),
                Name = t.Name,
                Description = t.Description
            }).ToList();

        private static List<CompanyTypeField> MapExternalFields(
            List<ExternalCompanyTypeFieldDefinition> source, Guid companyTypeId) =>
            source.Select(f =>
            {
                var fieldId = Guid.NewGuid();
                return new CompanyTypeField
                {
                    Id = fieldId,
                    CompanyTypeId = companyTypeId,
                    FieldKey = f.FieldKey,
                    FieldType = f.FieldType,
                    IsRequired = f.IsRequired,
                    ValidationRegex = f.ValidationRegex,
                    ValidationMessage = f.ValidationMessage,
                    DisplayOrder = f.DisplayOrder,
                    DefaultValue = f.DefaultValue,
                    Placeholder = f.Placeholder,
                    MaxLength = f.MaxLength,
                    MinLength = f.MinLength,
                    Translations = f.Translations.Select(t => new CompanyTypeFieldTranslation
                    {
                        Id = Guid.NewGuid(),
                        CompanyTypeFieldId = fieldId,
                        LanguageCode = t.LanguageCode.ToLowerInvariant(),
                        Label = t.Label,
                        HelpText = t.HelpText,
                        ValidationMessage = t.ValidationMessage
                    }).ToList(),
                    Options = new List<CompanyTypeFieldOption>()
                };
            }).ToList();
    }
}
