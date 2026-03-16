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
        Task<CompanyTypeWithFieldsDTO?> GetWithFields(Guid id, string languageCode);
        Task<CompanyTypeDTO?> Create(CreateCompanyTypeDTO dto);
        Task<bool> Update(Guid id, UpdateCompanyTypeDTO dto);
        Task<bool> AddField(Guid companyTypeId, CreateCompanyTypeFieldDTO dto);
        Task<bool> UpdateFieldTranslations(Guid companyTypeId, Guid fieldId, UpdateFieldTranslationsDTO dto);
        Task<bool> Delete(Guid id);
    }

    public class CompanyTypeService : BaseService<ICompanyTypeService>, ICompanyTypeService
    {
        private readonly ICompanyTypeRepository _companyTypeRepository;
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
    }
}
