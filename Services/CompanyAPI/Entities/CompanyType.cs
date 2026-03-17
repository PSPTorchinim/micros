using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CompanyAPI.Entities
{
    public class CompanyType
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        /// <summary>
        /// Short code identifier, e.g. "LLC", "GMBH", "SAS"
        /// </summary>
        public string Code { get; set; } = string.Empty;

        /// <summary>
        /// ISO 3166-1 alpha-2 country code, e.g. "US", "DE", "FR"
        /// </summary>
        public string CountryCode { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public int DisplayOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public List<CompanyTypeTranslation> Translations { get; set; } = new();

        public List<CompanyTypeField> Fields { get; set; } = new();
    }

    public class CompanyTypeTranslation
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Guid CompanyTypeId { get; set; }

        /// <summary>
        /// ISO 639-1 language code, e.g. "en", "de", "fr"
        /// </summary>
        public string LanguageCode { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }

    public class CompanyTypeField
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Guid CompanyTypeId { get; set; }

        /// <summary>
        /// Field key identifier, e.g. "taxId", "registrationNumber"
        /// </summary>
        public string FieldKey { get; set; } = string.Empty;

        /// <summary>
        /// Field type: "text", "number", "email", "select"
        /// </summary>
        public string FieldType { get; set; } = "text";

        public bool IsRequired { get; set; }

        public string? ValidationRegex { get; set; }

        public string? ValidationMessage { get; set; }

        public int DisplayOrder { get; set; }

        public string? DefaultValue { get; set; }

        public string? Placeholder { get; set; }

        public int? MaxLength { get; set; }

        public int? MinLength { get; set; }

        public List<CompanyTypeFieldTranslation> Translations { get; set; } = new();

        public List<CompanyTypeFieldOption> Options { get; set; } = new();
    }

    public class CompanyTypeFieldTranslation
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Guid CompanyTypeFieldId { get; set; }

        public string LanguageCode { get; set; } = string.Empty;

        public string Label { get; set; } = string.Empty;

        public string? HelpText { get; set; }

        public string? ValidationMessage { get; set; }
    }

    public class CompanyTypeFieldOption
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Guid CompanyTypeFieldId { get; set; }

        public string Value { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }

        public List<CompanyTypeFieldOptionTranslation> Translations { get; set; } = new();
    }

    public class CompanyTypeFieldOptionTranslation
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }

        [BsonRepresentation(BsonType.String)]
        public Guid CompanyTypeFieldOptionId { get; set; }

        public string LanguageCode { get; set; } = string.Empty;

        public string Label { get; set; } = string.Empty;
    }
}
