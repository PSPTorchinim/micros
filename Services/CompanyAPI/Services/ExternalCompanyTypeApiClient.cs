using CompanyAPI.Data.Models;
using Shared.Helpers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace CompanyAPI.Services
{
    public interface IExternalCompanyTypeApiClient
    {
        /// <summary>
        /// Fetches company type definitions for a given country from the GLEIF entity-legal-forms API
        /// (or a custom override configured via <c>ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_URL</c>).
        /// </summary>
        /// <param name="countryCode">ISO 3166-1 alpha-2 country code (e.g. "US", "DE")</param>
        Task<List<ExternalCompanyTypeDefinition>> FetchCompanyTypesAsync(string countryCode);
    }

    /// <summary>
    /// Fetches legal entity types from the public <b>GLEIF entity-legal-forms API</b>
    /// (https://api.gleif.org/api/v1/entity-legal-forms) and maps them to the internal
    /// <see cref="ExternalCompanyTypeDefinition"/> contract.
    ///
    /// The GLEIF API is freely accessible without authentication and covers all jurisdictions
    /// worldwide, providing standardised ISO 20275 legal-form codes with multilingual names.
    ///
    /// Registration field definitions (e.g. EIN for US LLC) are not available via any public API;
    /// they are codified as domain knowledge in <see cref="KnownRegistrationFields"/>.
    ///
    /// The base URL defaults to <c>https://api.gleif.org/api/v1</c> but can be overridden with
    /// the <c>ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_URL</c> environment variable (useful for
    /// testing or pointing at a mirror).
    /// </summary>
    public class ExternalCompanyTypeApiClient : IExternalCompanyTypeApiClient
    {
        /// <summary>Named HttpClient key registered in BrandScope.</summary>
        public const string HttpClientName = "ExternalCompanyTypesApi";

        /// <summary>
        /// Default base URL — the public GLEIF REST API v1.
        /// No API key is required; the service is freely accessible.
        /// </summary>
        public const string GleifApiBaseUrl = "https://api.gleif.org/api/v1";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<IExternalCompanyTypeApiClient> _logger;

        private static string GetApiBaseUrl() =>
            Environment.GetEnvironmentVariable("ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_URL")
            ?? GleifApiBaseUrl;

        public ExternalCompanyTypeApiClient(IHttpClientFactory httpClientFactory, ILogger<IExternalCompanyTypeApiClient> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        /// <inheritdoc />
        public async Task<List<ExternalCompanyTypeDefinition>> FetchCompanyTypesAsync(string countryCode)
        {
            var normalizedCountry = countryCode.ToUpperInvariant();
            var baseUrl = GetApiBaseUrl().TrimEnd('/');

            // GLEIF entity-legal-forms endpoint — filter by country, fetch up to 200 per page
            var url = $"{baseUrl}/entity-legal-forms?filter[country]={Uri.EscapeDataString(normalizedCountry)}&page[size]=200";

            _logger.LogInformation(
                "Fetching entity legal forms for country {CountryCode} from GLEIF API ({Url})",
                StringHelper.SanitizeForLog(normalizedCountry), StringHelper.SanitizeForLog(url));

            var client = _httpClientFactory.CreateClient(HttpClientName);

            // GLEIF is an open API — no authentication header needed.
            // A custom override URL may require an API key; support that via a per-request header.
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            var apiKey = Environment.GetEnvironmentVariable("ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_KEY");
            if (!string.IsNullOrEmpty(apiKey))
            {
                request.Headers.Add("X-API-Key", apiKey);
            }

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "GLEIF entity-legal-forms API returned {StatusCode} for country {CountryCode}",
                    response.StatusCode, StringHelper.SanitizeForLog(normalizedCountry));
                return new List<ExternalCompanyTypeDefinition>();
            }

            var gleifResponse = await response.Content.ReadFromJsonAsync<GleifEntityLegalFormsResponse>();
            if (gleifResponse?.Data == null || gleifResponse.Data.Count == 0)
            {
                _logger.LogWarning("GLEIF returned no entity legal forms for country {CountryCode}", StringHelper.SanitizeForLog(normalizedCountry));
                return new List<ExternalCompanyTypeDefinition>();
            }

            var definitions = gleifResponse.Data
                .Where(d => d.Attributes.Status == "ACTIVE")
                .Select((d, index) => MapGleifToDefinition(d, index))
                .ToList();

            _logger.LogInformation(
                "Mapped {Count} active entity legal forms for country {CountryCode} from GLEIF",
                definitions.Count, StringHelper.SanitizeForLog(normalizedCountry));

            return definitions;
        }

        // ── GLEIF → internal model mapping ───────────────────────────────────────

        private static ExternalCompanyTypeDefinition MapGleifToDefinition(GleifEntityLegalFormData gleifForm, int displayOrder)
        {
            // Prefer the first abbreviation as the code; fall back to the GLEIF 4-char ELF code
            var code = gleifForm.Attributes.Abbreviations.FirstOrDefault(a => !string.IsNullOrWhiteSpace(a))
                ?? gleifForm.Id;

            var country = gleifForm.Attributes.Country.ToUpperInvariant();

            var translations = gleifForm.Attributes.Names
                .Where(n => !string.IsNullOrWhiteSpace(n.LanguageCode) && !string.IsNullOrWhiteSpace(n.LocalName))
                .Select(n => new CreateCompanyTypeTranslationDTO
                {
                    LanguageCode = NormalizeLanguageCode(n.LanguageCode),
                    Name = n.LocalName,
                    Description = $"{n.LocalName} ({code})"
                })
                .GroupBy(t => t.LanguageCode)        // deduplicate per language
                .Select(g => g.First())
                .ToList();

            // Guarantee an English translation so the fallback chain always works
            if (!translations.Any(t => t.LanguageCode == "en"))
            {
                var fallbackName = gleifForm.Attributes.Names.FirstOrDefault()?.LocalName ?? code;
                translations.Insert(0, new CreateCompanyTypeTranslationDTO
                {
                    LanguageCode = "en",
                    Name = fallbackName,
                    Description = $"{fallbackName} ({code})"
                });
            }

            return new ExternalCompanyTypeDefinition
            {
                Code = code.ToUpperInvariant(),
                CountryCode = country,
                IsActive = true,
                DisplayOrder = displayOrder,
                Translations = translations,
                Fields = KnownRegistrationFields.GetFields(code, country)
            };
        }

        /// <summary>
        /// Normalises GLEIF language codes to ISO 639-1 (2-letter) codes used by the system.
        /// GLEIF mostly uses 2-letter codes but occasionally includes longer BCP-47 tags.
        /// </summary>
        private static string NormalizeLanguageCode(string gleifCode)
        {
            if (string.IsNullOrWhiteSpace(gleifCode)) return "en";

            // Already 2-letter — return as-is (lower-cased)
            var lower = gleifCode.ToLowerInvariant().Trim();
            if (lower.Length == 2) return lower;

            // Strip region/script subtags (e.g. "en-US" → "en", "zh-Hant" → "zh")
            var dashIdx = lower.IndexOf('-');
            if (dashIdx == 2) return lower[..2];

            // Map common ISO 639-2/T three-letter codes
            return lower switch
            {
                "eng" => "en",
                "deu" or "ger" => "de",
                "fra" or "fre" => "fr",
                "spa" => "es",
                "pol" => "pl",
                "ita" => "it",
                "por" => "pt",
                "nld" or "dut" => "nl",
                "swe" => "sv",
                "nor" => "no",
                "dan" => "da",
                "fin" => "fi",
                "ces" or "cze" => "cs",
                "slk" or "slo" => "sk",
                "hun" => "hu",
                "ron" or "rum" => "ro",
                "bul" => "bg",
                "hrv" => "hr",
                "slv" => "sl",
                "ell" or "gre" => "el",
                "tur" => "tr",
                "jpn" => "ja",
                "zho" or "chi" => "zh",
                "kor" => "ko",
                "ara" => "ar",
                "rus" => "ru",
                _ => lower.Length >= 2 ? lower[..2] : "en"
            };
        }

        // ── GLEIF JSON response models ────────────────────────────────────────────

        private class GleifEntityLegalFormsResponse
        {
            [JsonPropertyName("data")]
            public List<GleifEntityLegalFormData> Data { get; set; } = new();

            [JsonPropertyName("meta")]
            public GleifMeta? Meta { get; set; }
        }

        private class GleifMeta
        {
            [JsonPropertyName("total")]
            public int Total { get; set; }

            [JsonPropertyName("count")]
            public int Count { get; set; }
        }

        private class GleifEntityLegalFormData
        {
            [JsonPropertyName("type")]
            public string Type { get; set; } = string.Empty;

            /// <summary>GLEIF 4-character ELF code (e.g. "54M6" for US LLC).</summary>
            [JsonPropertyName("id")]
            public string Id { get; set; } = string.Empty;

            [JsonPropertyName("attributes")]
            public GleifEntityLegalFormAttributes Attributes { get; set; } = new();
        }

        private class GleifEntityLegalFormAttributes
        {
            /// <summary>ISO 3166-1 alpha-2 country code.</summary>
            [JsonPropertyName("country")]
            public string Country { get; set; } = string.Empty;

            /// <summary>Common abbreviations for this legal form (e.g. ["LLC", "L.L.C."]).</summary>
            [JsonPropertyName("abbreviations")]
            public List<string> Abbreviations { get; set; } = new();

            [JsonPropertyName("names")]
            public List<GleifEntityLegalFormName> Names { get; set; } = new();

            /// <summary>"ACTIVE" or "INACTIVE".</summary>
            [JsonPropertyName("status")]
            public string Status { get; set; } = string.Empty;
        }

        private class GleifEntityLegalFormName
        {
            [JsonPropertyName("languageCode")]
            public string LanguageCode { get; set; } = string.Empty;

            [JsonPropertyName("localName")]
            public string LocalName { get; set; } = string.Empty;

            [JsonPropertyName("transliteratedName")]
            public string? TransliteratedName { get; set; }
        }
    }

    // ── Regulatory registration-field definitions ─────────────────────────────
    // No public API exposes the exact form fields required to register each legal
    // entity type in each jurisdiction; this knowledge is codified here from
    // official regulatory sources.

    public static class KnownRegistrationFields
    {
        /// <summary>
        /// Returns the known required registration fields for a given entity type code
        /// and country.  Returns an empty list for unknown combinations.
        /// </summary>
        public static List<ExternalCompanyTypeFieldDefinition> GetFields(string code, string countryCode) =>
            countryCode.ToUpperInvariant() switch
            {
                "US" => GetUsFields(code.ToUpperInvariant()),
                "DE" => GetDeFields(code.ToUpperInvariant()),
                "FR" => GetFrFields(code.ToUpperInvariant()),
                "GB" => GetGbFields(code.ToUpperInvariant()),
                "NL" => GetNlFields(code.ToUpperInvariant()),
                "AT" => GetAtFields(code.ToUpperInvariant()),
                "CH" => GetChFields(code.ToUpperInvariant()),
                "PL" => GetPlFields(code.ToUpperInvariant()),
                _ => new List<ExternalCompanyTypeFieldDefinition>()
            };

        // ── United States ──────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetUsFields(string code) => code switch
        {
            "LLC" or "L.L.C." => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "ein", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{2}-\d{7}$", DisplayOrder = 1,
                    Placeholder = "12-3456789", MaxLength = 10, MinLength = 10,
                    Translations = BaseField("Employer Identification Number (EIN)", "EIN / Arbeitgeberkennzahl", "Numéro d'identification de l'employeur (EIN)")
                },
                new()
                {
                    FieldKey = "stateOfFormation", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^[A-Z]{2}$", DisplayOrder = 2,
                    Placeholder = "DE", MaxLength = 2, MinLength = 2,
                    Translations = BaseField("State of Formation", "Gründungsstaat", "État de formation")
                },
                new()
                {
                    FieldKey = "registeredAgent", FieldType = "text", IsRequired = true,
                    DisplayOrder = 3, MaxLength = 255,
                    Translations = BaseField("Registered Agent", "Eingetragener Agent", "Agent enregistré")
                }
            },
            "C-CORP" or "INC" or "CORP" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "ein", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{2}-\d{7}$", DisplayOrder = 1,
                    Placeholder = "12-3456789", MaxLength = 10, MinLength = 10,
                    Translations = BaseField("Employer Identification Number (EIN)", "EIN / Arbeitgeberkennzahl", "Numéro d'identification de l'employeur (EIN)")
                },
                new()
                {
                    FieldKey = "stateOfIncorporation", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^[A-Z]{2}$", DisplayOrder = 2,
                    Placeholder = "DE", MaxLength = 2, MinLength = 2,
                    Translations = BaseField("State of Incorporation", "Gründungsstaat", "État de constitution")
                },
                new()
                {
                    FieldKey = "authorizedShares", FieldType = "number", IsRequired = true,
                    DisplayOrder = 3,
                    Translations = BaseField("Number of Authorized Shares", "Anzahl genehmigter Aktien", "Nombre d'actions autorisées")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── Germany ────────────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetDeFields(string code) => code switch
        {
            "GMBH" or "GESELLSCHAFT MIT BESCHRÄNKTER HAFTUNG" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "hrb", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^HRB\s?\d+$", DisplayOrder = 1,
                    Placeholder = "HRB 12345", MaxLength = 20,
                    Translations = BaseField("Commercial Register Number (HRB)", "Handelsregisternummer (HRB)", "Numéro du registre du commerce (HRB)")
                },
                new()
                {
                    FieldKey = "amtsgericht", FieldType = "text", IsRequired = true,
                    DisplayOrder = 2, MaxLength = 100,
                    Translations = BaseField("Local Court (Amtsgericht)", "Amtsgericht", "Tribunal de district (Amtsgericht)")
                },
                new()
                {
                    FieldKey = "stammkapital", FieldType = "number", IsRequired = true,
                    DisplayOrder = 3,
                    Translations = BaseField("Share Capital (Stammkapital) in EUR", "Stammkapital in EUR", "Capital social (Stammkapital) en EUR")
                }
            },
            "AG" or "AKTIENGESELLSCHAFT" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "hrb", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^HRB\s?\d+$", DisplayOrder = 1,
                    Placeholder = "HRB 12345", MaxLength = 20,
                    Translations = BaseField("Commercial Register Number (HRB)", "Handelsregisternummer (HRB)", "Numéro du registre du commerce (HRB)")
                },
                new()
                {
                    FieldKey = "grundkapital", FieldType = "number", IsRequired = true,
                    DisplayOrder = 2,
                    Translations = BaseField("Share Capital (Grundkapital) in EUR", "Grundkapital in EUR", "Capital social (Grundkapital) en EUR")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── France ─────────────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetFrFields(string code) => code switch
        {
            "SAS" or "SOCIÉTÉ PAR ACTIONS SIMPLIFIÉE" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "siret", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{14}$", DisplayOrder = 1,
                    Placeholder = "12345678901234", MaxLength = 14, MinLength = 14,
                    Translations = BaseField("SIRET Number", "SIRET-Nummer", "Numéro SIRET")
                },
                new()
                {
                    FieldKey = "siren", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{9}$", DisplayOrder = 2,
                    Placeholder = "123456789", MaxLength = 9, MinLength = 9,
                    Translations = BaseField("SIREN Number", "SIREN-Nummer", "Numéro SIREN")
                },
                new()
                {
                    FieldKey = "capitalSocial", FieldType = "number", IsRequired = true,
                    DisplayOrder = 3,
                    Translations = BaseField("Share Capital (Capital Social) in EUR", "Stammkapital (Capital Social) in EUR", "Capital social en EUR")
                }
            },
            "SARL" or "SOCIÉTÉ À RESPONSABILITÉ LIMITÉE" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "siret", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{14}$", DisplayOrder = 1,
                    Placeholder = "12345678901234", MaxLength = 14, MinLength = 14,
                    Translations = BaseField("SIRET Number", "SIRET-Nummer", "Numéro SIRET")
                },
                new()
                {
                    FieldKey = "siren", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{9}$", DisplayOrder = 2,
                    Placeholder = "123456789", MaxLength = 9, MinLength = 9,
                    Translations = BaseField("SIREN Number", "SIREN-Nummer", "Numéro SIREN")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── United Kingdom ─────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetGbFields(string code) => code switch
        {
            "LTD" or "LIMITED" or "PLC" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "companiesHouseNumber", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^[A-Z0-9]{8}$", DisplayOrder = 1,
                    Placeholder = "12345678", MaxLength = 8, MinLength = 8,
                    Translations = BaseField("Companies House Number", "Companies House Nummer", "Numéro du registre des sociétés (Companies House)")
                },
                new()
                {
                    FieldKey = "vatNumber", FieldType = "text", IsRequired = false,
                    ValidationRegex = @"^GB\d{9}$", DisplayOrder = 2,
                    Placeholder = "GB123456789", MaxLength = 11,
                    Translations = BaseField("VAT Registration Number", "USt-IdNr.", "Numéro de TVA")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── Netherlands ────────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetNlFields(string code) => code switch
        {
            "BV" or "B.V." or "BESLOTEN VENNOOTSCHAP" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "kvkNumber", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d{8}$", DisplayOrder = 1,
                    Placeholder = "12345678", MaxLength = 8, MinLength = 8,
                    Translations = BaseField("KvK Number (Chamber of Commerce)", "KvK-Nummer (Handelskammer)", "Numéro KvK (Chambre de commerce)")
                },
                new()
                {
                    FieldKey = "btwNumber", FieldType = "text", IsRequired = false,
                    ValidationRegex = @"^NL\d{9}B\d{2}$", DisplayOrder = 2,
                    Placeholder = "NL123456789B01",
                    Translations = BaseField("BTW (VAT) Number", "BTW-Nummer (USt-IdNr.)", "Numéro BTW (TVA)")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── Austria ────────────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetAtFields(string code) => code switch
        {
            "GMBH" or "GESELLSCHAFT MIT BESCHRÄNKTER HAFTUNG" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "firmenbuchnummer", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^\d+[a-zA-Z]$", DisplayOrder = 1,
                    Placeholder = "123456a",
                    Translations = BaseField("Firmenbuchnummer (Company Register Number)", "Firmenbuchnummer", "Numéro du registre des sociétés (Firmenbuchnummer)")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── Switzerland ────────────────────────────────────────────────────────

        private static List<ExternalCompanyTypeFieldDefinition> GetChFields(string code) => code switch
        {
            "GMBH" or "SARL" or "SAGL" => new List<ExternalCompanyTypeFieldDefinition>
            {
                new()
                {
                    FieldKey = "uid", FieldType = "text", IsRequired = true,
                    ValidationRegex = @"^CHE-\d{3}\.\d{3}\.\d{3}$", DisplayOrder = 1,
                    Placeholder = "CHE-123.456.789",
                    Translations = BaseField("UID Number (Unternehmens-Identifikationsnummer)", "UID-Nummer", "Numéro UID")
                }
            },
            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        // ── Poland ─────────────────────────────────────────────────────────────
        // Sources: KRS (National Court Register), NIP (Tax Identification Number),
        //          REGON (Statistical Number), GUS open data.

        private static List<ExternalCompanyTypeFieldDefinition> GetPlFields(string code) => code switch
        {
            // Spółka z ograniczoną odpowiedzialnością (Sp. z o.o.) — Private limited
            "SP. Z O.O." or "SP.Z O.O." or "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ" => PlCommonFields(),

            // Spółka Akcyjna (S.A.) — Joint-stock company
            "S.A." or "SA" or "SPÓŁKA AKCYJNA" => new List<ExternalCompanyTypeFieldDefinition>
            {
                NipField(1),
                KrsField(2),
                RegonField(3),
                new()
                {
                    FieldKey = "shareCapital", FieldType = "number", IsRequired = true,
                    DisplayOrder = 4,
                    Translations = LocalisedField(
                        "Share Capital (Kapitał zakładowy) in PLN",
                        "Grundkapital (Kapitał zakładowy) in PLN",
                        "Capital social (Kapitał zakładowy) en PLN",
                        "Kapitał zakładowy w PLN")
                },
                RegisteredAddressField(5)
            },

            // Spółka komandytowa (Sp. k.) — Limited partnership
            "SP. K." or "SP.K." or "SPÓŁKA KOMANDYTOWA" => PlCommonFields(),

            // Spółka jawna (Sp. j.) — General partnership
            "SP. J." or "SP.J." or "SPÓŁKA JAWNA" => PlCommonFields(),

            // Prosta Spółka Akcyjna (P.S.A.) — Simple joint-stock company (since 2021)
            "P.S.A." or "PSA" or "PROSTA SPÓŁKA AKCYJNA" => PlCommonFields(),

            _ => new List<ExternalCompanyTypeFieldDefinition>()
        };

        /// <summary>Fields required by all Polish company forms (NIP + KRS + REGON + address).</summary>
        private static List<ExternalCompanyTypeFieldDefinition> PlCommonFields() =>
            new()
            {
                NipField(1),
                KrsField(2),
                RegonField(3),
                RegisteredAddressField(4)
            };

        private static ExternalCompanyTypeFieldDefinition NipField(int order) => new()
        {
            FieldKey = "nip", FieldType = "text", IsRequired = true,
            // NIP accepts:
            //   • 10 consecutive digits:          1234567890
            //   • XXX-XXX-XX-XX (entity format):  123-456-78-90
            //   • XXX-XX-XX-XXX (org format):     123-45-67-890
            ValidationRegex = @"^\d{10}$|^\d{3}-\d{3}-\d{2}-\d{2}$|^\d{3}-\d{2}-\d{2}-\d{3}$",
            ValidationMessage = "Enter NIP as 10 digits (1234567890) or formatted (123-456-78-90 / 123-45-67-890)",
            DisplayOrder = order, Placeholder = "1234567890", MaxLength = 13, MinLength = 10,
            Translations = LocalisedField(
                "NIP (Tax Identification Number)",
                "NIP (Steueridentifikationsnummer)",
                "NIP (Numéro d'identification fiscale)",
                "NIP (Numer Identyfikacji Podatkowej)")
        };

        private static ExternalCompanyTypeFieldDefinition KrsField(int order) => new()
        {
            FieldKey = "krs", FieldType = "text", IsRequired = true,
            ValidationRegex = @"^\d{10}$",
            DisplayOrder = order, Placeholder = "0000123456", MaxLength = 10, MinLength = 10,
            Translations = LocalisedField(
                "KRS (National Court Register Number)",
                "KRS (Handelsregisternummer)",
                "KRS (Numéro du registre national des tribunaux)",
                "KRS (Numer w Krajowym Rejestrze Sądowym)")
        };

        private static ExternalCompanyTypeFieldDefinition RegonField(int order) => new()
        {
            FieldKey = "regon", FieldType = "text", IsRequired = true,
            // REGON: 9 digits (entity) or 14 digits (local unit)
            ValidationRegex = @"^\d{9}$|^\d{14}$",
            DisplayOrder = order, Placeholder = "123456789", MaxLength = 14, MinLength = 9,
            Translations = LocalisedField(
                "REGON (Statistical Identification Number)",
                "REGON (Statistische Kennnummer)",
                "REGON (Numéro d'identification statistique)",
                "REGON (Numer identyfikacyjny REGON)")
        };

        private static ExternalCompanyTypeFieldDefinition RegisteredAddressField(int order) => new()
        {
            FieldKey = "registeredAddress", FieldType = "text", IsRequired = true,
            DisplayOrder = order, MaxLength = 500,
            Translations = LocalisedField(
                "Registered Address",
                "Eingetragene Adresse",
                "Adresse enregistrée",
                "Adres siedziby")
        };

        // ── Shared helpers ─────────────────────────────────────────────────────

        /// <summary>
        /// Builds a translation list with English, German, French, and Polish labels for a field.
        /// </summary>
        private static List<CreateCompanyTypeFieldTranslationDTO> LocalisedField(
            string en, string de, string fr, string pl) =>
            new()
            {
                new() { LanguageCode = "en", Label = en },
                new() { LanguageCode = "de", Label = de },
                new() { LanguageCode = "fr", Label = fr },
                new() { LanguageCode = "pl", Label = pl }
            };

        /// <summary>
        /// Builds a translation list with English, German, and French labels for a field
        /// (used for non-Polish jurisdictions).
        /// </summary>
        private static List<CreateCompanyTypeFieldTranslationDTO> BaseField(
            string en, string de, string fr) =>
            new()
            {
                new() { LanguageCode = "en", Label = en },
                new() { LanguageCode = "de", Label = de },
                new() { LanguageCode = "fr", Label = fr }
            };
    }
}
