using CompanyAPI.Entities;
using CompanyAPI.Repositories;
using Shared.Services.Database;
using Shared.Services.Security;

namespace CompanyAPI.Data
{
    public class SeedData : IDatabaseInitializer
    {
        private readonly ICompanyTypeRepository _companyTypeRepository;
        private readonly PermissionSeeder _permissionSeeder;
        private readonly ILogger<SeedData> _logger;

        public SeedData(ICompanyTypeRepository companyTypeRepository, PermissionSeeder permissionSeeder, ILogger<SeedData> logger)
        {
            _companyTypeRepository = companyTypeRepository;
            _permissionSeeder = permissionSeeder;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            _logger.LogInformation("Initializing Company API data at {Time}", DateTime.UtcNow);
            
            // Seed permissions required by Company API
            await SeedPermissions();

            // Seed initial company types if none exist
            if (await _companyTypeRepository.Empty())
            {
                _logger.LogInformation("Seeding initial company types at {Time}", DateTime.UtcNow);
                await SeedCompanyTypes();
                _logger.LogInformation("Company types seeded successfully at {Time}", DateTime.UtcNow);
            }
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Company API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("company:read", "View company details, users, and structure"),
                new PermissionDefinition("company:update", "Update company details and structure"),
                new PermissionDefinition("company:users:manage", "Add and remove users from the company")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Company API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Company API permissions, service will continue but authorization may not work correctly");
            }
        }

        private async Task SeedCompanyTypes()
        {
            var companyTypes = BuildInitialCompanyTypes();
            foreach (var ct in companyTypes)
            {
                await _companyTypeRepository.Add(ct);
            }
        }

        private static List<CompanyType> BuildInitialCompanyTypes()
        {
            return new List<CompanyType>
            {
                // ── United States ──────────────────────────────────────────────
                BuildCompanyType("LLC", "US", 1, new[]
                {
                    ("en", "Limited Liability Company (LLC)",
                     "A flexible business structure combining pass-through taxation with limited liability protection."),
                    ("de", "Gesellschaft mit beschränkter Haftung (LLC)",
                     "Eine flexible Unternehmensstruktur, die Durchlaufbesteuerung mit beschränkter Haftung kombiniert."),
                    ("fr", "Société à responsabilité limitée (LLC)",
                     "Une structure flexible combinant la fiscalité des sociétés de personnes avec la responsabilité limitée."),
                    ("es", "Sociedad de Responsabilidad Limitada (LLC)",
                     "Una estructura empresarial flexible que combina la tributación de paso con la protección de responsabilidad limitada."),
                    ("pl", "Spółka z ograniczoną odpowiedzialnością (LLC)",
                     "Elastyczna struktura biznesowa łącząca podatek od przejścia z ochroną ograniczonej odpowiedzialności.")
                }, new[]
                {
                    BuildTextField("ein", 1, @"^\d{2}-\d{7}$", "EIN must be in format XX-XXXXXXX", true,
                        new[] {
                            ("en", "Employer Identification Number (EIN)", "Your 9-digit federal tax ID in format XX-XXXXXXX"),
                            ("de", "Arbeitgeber-Identifikationsnummer (EIN)", "Ihre 9-stellige Bundessteuer-ID im Format XX-XXXXXXX"),
                            ("fr", "Numéro d'identification de l'employeur (EIN)", "Votre numéro d'identification fiscale fédéral à 9 chiffres au format XX-XXXXXXX"),
                            ("es", "Número de Identificación del Empleador (EIN)", "Su número de identificación fiscal federal de 9 dígitos en formato XX-XXXXXXX"),
                            ("pl", "Numer Identyfikacji Pracodawcy (EIN)", "Twój 9-cyfrowy federalny numer identyfikacji podatkowej w formacie XX-XXXXXXX")
                        }),
                    BuildTextField("stateOfFormation", 2, null, null, true,
                        new[] {
                            ("en", "State of Formation", "The U.S. state where the LLC was formed"),
                            ("de", "Gründungsstaat", "Der US-Bundesstaat, in dem die LLC gegründet wurde"),
                            ("fr", "État de constitution", "L'État américain où la LLC a été constituée"),
                            ("es", "Estado de formación", "El estado de EE.UU. donde se formó la LLC"),
                            ("pl", "Stan rejestracji", "Stan USA, w którym zarejestrowano LLC")
                        }),
                    BuildTextField("registeredAgent", 3, null, null, true,
                        new[] {
                            ("en", "Registered Agent", "Name of the registered agent for service of process"),
                            ("de", "Eingetragener Vertreter", "Name des eingetragenen Vertreters für die Zustellung"),
                            ("fr", "Agent enregistré", "Nom de l'agent enregistré pour la signification des actes"),
                            ("es", "Agente registrado", "Nombre del agente registrado para notificaciones legales"),
                            ("pl", "Zarejestrowany agent", "Nazwa zarejestrowanego agenta do doręczeń")
                        })
                }),

                BuildCompanyType("C-CORP", "US", 2, new[]
                {
                    ("en", "C-Corporation", "A standard corporation with unlimited shareholders and the ability to go public."),
                    ("de", "C-Gesellschaft", "Eine Standardgesellschaft mit unbegrenzter Gesellschafterzahl und der Möglichkeit, an die Börse zu gehen."),
                    ("fr", "Société par actions de type C", "Une société standard avec un nombre illimité d'actionnaires et la possibilité d'être cotée en bourse."),
                    ("es", "Corporación C", "Una corporación estándar con accionistas ilimitados y la capacidad de cotizar en bolsa."),
                    ("pl", "Korporacja C", "Standardowa korporacja z nieograniczoną liczbą udziałowców i możliwością wejścia na giełdę.")
                }, new[]
                {
                    BuildTextField("ein", 1, @"^\d{2}-\d{7}$", "EIN must be in format XX-XXXXXXX", true,
                        new[] {
                            ("en", "Employer Identification Number (EIN)", "Your 9-digit federal tax ID in format XX-XXXXXXX"),
                            ("de", "Arbeitgeber-Identifikationsnummer (EIN)", "Ihre 9-stellige Bundessteuer-ID im Format XX-XXXXXXX"),
                            ("fr", "Numéro d'identification de l'employeur (EIN)", "Votre numéro d'identification fiscale fédéral à 9 chiffres au format XX-XXXXXXX"),
                            ("es", "Número de Identificación del Empleador (EIN)", "Su número de identificación fiscal federal de 9 dígitos en formato XX-XXXXXXX"),
                            ("pl", "Numer Identyfikacji Pracodawcy (EIN)", "Twój 9-cyfrowy federalny numer identyfikacji podatkowej w formacie XX-XXXXXXX")
                        }),
                    BuildTextField("stateOfIncorporation", 2, null, null, true,
                        new[] {
                            ("en", "State of Incorporation", "The U.S. state where the corporation was incorporated"),
                            ("de", "Gründungsstaat", "Der US-Bundesstaat, in dem die Gesellschaft gegründet wurde"),
                            ("fr", "État de constitution", "L'État américain où la société a été constituée"),
                            ("es", "Estado de incorporación", "El estado de EE.UU. donde se incorporó la corporación"),
                            ("pl", "Stan inkorporacji", "Stan USA, w którym zarejestrowano korporację")
                        })
                }),

                // ── Germany ────────────────────────────────────────────────────
                BuildCompanyType("GMBH", "DE", 1, new[]
                {
                    ("en", "Limited Liability Company (GmbH)", "A German private limited company with minimum capital of €25,000."),
                    ("de", "Gesellschaft mit beschränkter Haftung (GmbH)", "Eine deutsche Gesellschaft mit beschränkter Haftung und einem Mindestkapital von 25.000 €."),
                    ("fr", "Société à responsabilité limitée (GmbH)", "Une société privée allemande à responsabilité limitée avec un capital minimum de 25 000 €."),
                    ("es", "Sociedad de Responsabilidad Limitada (GmbH)", "Una empresa privada alemana con responsabilidad limitada y un capital mínimo de 25.000 €."),
                    ("pl", "Spółka z ograniczoną odpowiedzialnością (GmbH)", "Niemiecka spółka z ograniczoną odpowiedzialnością z minimalnym kapitałem 25 000 €.")
                }, new[]
                {
                    BuildTextField("handelsregisternummer", 1, @"^HRB\s?\d{1,6}$", "Handelsregisternummer must be in format HRB XXXXX", true,
                        new[] {
                            ("en", "Commercial Register Number (HRB)", "Registration number in format HRB XXXXX"),
                            ("de", "Handelsregisternummer (HRB)", "Registrierungsnummer im Format HRB XXXXX"),
                            ("fr", "Numéro du registre du commerce (HRB)", "Numéro d'enregistrement au format HRB XXXXX"),
                            ("es", "Número de Registro Mercantil (HRB)", "Número de registro en formato HRB XXXXX"),
                            ("pl", "Numer Rejestru Handlowego (HRB)", "Numer rejestracyjny w formacie HRB XXXXX")
                        }),
                    BuildTextField("amtsgericht", 2, null, null, true,
                        new[] {
                            ("en", "Local Court (Amtsgericht)", "The local court where the company is registered"),
                            ("de", "Amtsgericht", "Das Amtsgericht, bei dem die Gesellschaft eingetragen ist"),
                            ("fr", "Tribunal de district (Amtsgericht)", "Le tribunal local où la société est enregistrée"),
                            ("es", "Tribunal local (Amtsgericht)", "El tribunal local donde está registrada la empresa"),
                            ("pl", "Sąd Rejonowy (Amtsgericht)", "Sąd rejonowy, w którym spółka jest zarejestrowana")
                        }),
                    BuildTextField("geschaeftsfuehrer", 3, null, null, true,
                        new[] {
                            ("en", "Managing Director (Geschäftsführer)", "Name of the managing director(s)"),
                            ("de", "Geschäftsführer", "Name des/der Geschäftsführer(s)"),
                            ("fr", "Gérant (Geschäftsführer)", "Nom du ou des gérants"),
                            ("es", "Director gerente (Geschäftsführer)", "Nombre del o de los directores gerentes"),
                            ("pl", "Dyrektor zarządzający (Geschäftsführer)", "Imię i nazwisko dyrektora/dyrektorów zarządzających")
                        })
                }),

                // ── France ─────────────────────────────────────────────────────
                BuildCompanyType("SAS", "FR", 1, new[]
                {
                    ("en", "Simplified Joint-Stock Company (SAS)", "A flexible French corporate structure for businesses of all sizes."),
                    ("de", "Vereinfachte Aktiengesellschaft (SAS)", "Eine flexible französische Unternehmensstruktur für Unternehmen aller Größen."),
                    ("fr", "Société par Actions Simplifiée (SAS)", "Une structure sociétaire française flexible adaptée aux entreprises de toutes tailles."),
                    ("es", "Sociedad por Acciones Simplificada (SAS)", "Una estructura corporativa francesa flexible para empresas de todos los tamaños."),
                    ("pl", "Uproszczona Spółka Akcyjna (SAS)", "Elastyczna francuska struktura korporacyjna dla firm każdej wielkości.")
                }, new[]
                {
                    BuildTextField("siret", 1, @"^\d{14}$", "SIRET must be 14 digits", true,
                        new[] {
                            ("en", "SIRET Number", "14-digit business identification number"),
                            ("de", "SIRET-Nummer", "14-stellige Unternehmensidentifikationsnummer"),
                            ("fr", "Numéro SIRET", "Numéro d'identification à 14 chiffres"),
                            ("es", "Número SIRET", "Número de identificación empresarial de 14 dígitos"),
                            ("pl", "Numer SIRET", "14-cyfrowy numer identyfikacji firmy")
                        }),
                    BuildTextField("siren", 2, @"^\d{9}$", "SIREN must be 9 digits", true,
                        new[] {
                            ("en", "SIREN Number", "9-digit company identification number"),
                            ("de", "SIREN-Nummer", "9-stellige Unternehmensidentifikationsnummer"),
                            ("fr", "Numéro SIREN", "Numéro d'identification de l'entreprise à 9 chiffres"),
                            ("es", "Número SIREN", "Número de identificación de empresa de 9 dígitos"),
                            ("pl", "Numer SIREN", "9-cyfrowy numer identyfikacji spółki")
                        }),
                    BuildTextField("codeApe", 3, null, null, false,
                        new[] {
                            ("en", "APE Code", "Activity code identifying the main business activity"),
                            ("de", "APE-Code", "Aktivitätscode zur Identifizierung der Hauptgeschäftstätigkeit"),
                            ("fr", "Code APE", "Code d'activité identifiant l'activité principale"),
                            ("es", "Código APE", "Código de actividad que identifica la actividad empresarial principal"),
                            ("pl", "Kod APE", "Kod działalności identyfikujący główną działalność firmy")
                        })
                }),

                // ── United Kingdom ─────────────────────────────────────────────
                BuildCompanyType("LTD", "GB", 1, new[]
                {
                    ("en", "Private Limited Company (Ltd)", "A UK private company limited by shares with liability protection."),
                    ("de", "Gesellschaft mit beschränkter Haftung (Ltd)", "Eine britische Privatgesellschaft mit beschränkter Haftung."),
                    ("fr", "Société privée à responsabilité limitée (Ltd)", "Une société privée britannique à responsabilité limitée."),
                    ("es", "Sociedad de Responsabilidad Limitada Privada (Ltd)", "Una empresa privada del Reino Unido con responsabilidad limitada por acciones."),
                    ("pl", "Prywatna Spółka z Ograniczoną Odpowiedzialnością (Ltd)", "Brytyjska prywatna spółka z ograniczoną odpowiedzialnością.")
                }, new[]
                {
                    BuildTextField("companyNumber", 1, @"^\d{8}$", "Company number must be 8 digits", true,
                        new[] {
                            ("en", "Company Number", "8-digit Companies House registration number"),
                            ("de", "Unternehmensnummer", "8-stellige Registrierungsnummer beim Companies House"),
                            ("fr", "Numéro de société", "Numéro d'enregistrement à 8 chiffres au Companies House"),
                            ("es", "Número de empresa", "Número de registro de 8 dígitos en Companies House"),
                            ("pl", "Numer firmy", "8-cyfrowy numer rejestracyjny w Companies House")
                        }),
                    BuildTextField("registeredOfficeAddress", 2, null, null, true,
                        new[] {
                            ("en", "Registered Office Address", "Official registered office address in the UK"),
                            ("de", "Eingetragene Büroadresse", "Offizielle eingetragene Büroadresse im Vereinigten Königreich"),
                            ("fr", "Adresse du siège social enregistré", "Adresse officielle du siège social enregistré au Royaume-Uni"),
                            ("es", "Dirección del domicilio social registrado", "Dirección oficial del domicilio social registrado en el Reino Unido"),
                            ("pl", "Adres zarejestrowanego biura", "Oficjalny adres zarejestrowanego biura w Wielkiej Brytanii")
                        })
                })
            };
        }

        private static CompanyType BuildCompanyType(
            string code,
            string countryCode,
            int displayOrder,
            IEnumerable<(string lang, string name, string description)> translations,
            IEnumerable<CompanyTypeField> fields)
        {
            var id = Guid.NewGuid();
            var ct = new CompanyType
            {
                Id = id,
                Code = code,
                CountryCode = countryCode,
                IsActive = true,
                DisplayOrder = displayOrder,
                CreatedAt = DateTime.UtcNow,
                Translations = translations.Select(t => new CompanyTypeTranslation
                {
                    Id = Guid.NewGuid(),
                    CompanyTypeId = id,
                    LanguageCode = t.lang,
                    Name = t.name,
                    Description = t.description
                }).ToList(),
                Fields = fields.ToList()
            };

            foreach (var field in ct.Fields)
            {
                field.CompanyTypeId = id;
            }

            return ct;
        }

        private static CompanyTypeField BuildTextField(
            string fieldKey,
            int displayOrder,
            string? validationRegex,
            string? validationMessage,
            bool isRequired,
            IEnumerable<(string lang, string label, string helpText)> translations)
        {
            var fieldId = Guid.NewGuid();
            return new CompanyTypeField
            {
                Id = fieldId,
                FieldKey = fieldKey,
                FieldType = "text",
                IsRequired = isRequired,
                ValidationRegex = validationRegex,
                ValidationMessage = validationMessage,
                DisplayOrder = displayOrder,
                Translations = translations.Select(t => new CompanyTypeFieldTranslation
                {
                    Id = Guid.NewGuid(),
                    CompanyTypeFieldId = fieldId,
                    LanguageCode = t.lang,
                    Label = t.label,
                    HelpText = t.helpText
                }).ToList(),
                Options = new List<CompanyTypeFieldOption>()
            };
        }
    }
}