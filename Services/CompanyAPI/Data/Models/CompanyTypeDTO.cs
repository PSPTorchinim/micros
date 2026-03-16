using System.ComponentModel.DataAnnotations;

namespace CompanyAPI.Data.Models
{
    public class CompanyTypeDTO
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string CountryCode { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class CompanyTypeWithFieldsDTO
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string CountryCode { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<CompanyTypeFieldDTO> Fields { get; set; } = new();
    }

    public class CompanyTypeFieldDTO
    {
        public Guid Id { get; set; }
        public string FieldKey { get; set; } = string.Empty;
        public string FieldType { get; set; } = "text";
        public bool IsRequired { get; set; }
        public string? ValidationRegex { get; set; }
        public string? ValidationMessage { get; set; }
        public int DisplayOrder { get; set; }
        public string? DefaultValue { get; set; }
        public string? Placeholder { get; set; }
        public int? MaxLength { get; set; }
        public int? MinLength { get; set; }
        public string Label { get; set; } = string.Empty;
        public string? HelpText { get; set; }
        public List<CompanyTypeFieldOptionDTO> Options { get; set; } = new();
    }

    public class CompanyTypeFieldOptionDTO
    {
        public Guid Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public string Label { get; set; } = string.Empty;
    }

    public class CreateCompanyTypeDTO
    {
        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        [StringLength(2, MinimumLength = 2)]
        public string CountryCode { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; }

        [Required]
        public List<CreateCompanyTypeTranslationDTO> Translations { get; set; } = new();
    }

    public class CreateCompanyTypeTranslationDTO
    {
        [Required]
        [StringLength(5, MinimumLength = 2)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }

    public class UpdateCompanyTypeDTO
    {
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public List<CreateCompanyTypeTranslationDTO> Translations { get; set; } = new();
    }

    public class CreateCompanyTypeFieldDTO
    {
        [Required]
        public string FieldKey { get; set; } = string.Empty;

        [Required]
        public string FieldType { get; set; } = "text";

        public bool IsRequired { get; set; }

        public string? ValidationRegex { get; set; }

        public string? ValidationMessage { get; set; }

        public int DisplayOrder { get; set; }

        public string? DefaultValue { get; set; }

        public string? Placeholder { get; set; }

        public int? MaxLength { get; set; }

        public int? MinLength { get; set; }

        [Required]
        public List<CreateCompanyTypeFieldTranslationDTO> Translations { get; set; } = new();
    }

    public class CreateCompanyTypeFieldTranslationDTO
    {
        [Required]
        [StringLength(5, MinimumLength = 2)]
        public string LanguageCode { get; set; } = string.Empty;

        [Required]
        public string Label { get; set; } = string.Empty;

        public string? HelpText { get; set; }

        public string? ValidationMessage { get; set; }
    }

    public class UpdateFieldTranslationsDTO
    {
        [Required]
        public List<CreateCompanyTypeFieldTranslationDTO> Translations { get; set; } = new();
    }
}
