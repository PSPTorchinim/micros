using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using Shared.Services.Database;
using Shared.Services.Security;

namespace DocumentsAPI.Data
{
    public class SeedData : IDatabaseInitializer
    {

        private readonly DocumentTemplatesRepository documentTemplatesRepository;
        private readonly PermissionSeeder _permissionSeeder;
        private readonly ILogger<SeedData> _logger;

        public SeedData(DocumentTemplatesRepository documentTemplatesRepository, PermissionSeeder permissionSeeder, ILogger<SeedData> logger)
        {
            this.documentTemplatesRepository = documentTemplatesRepository;
            _permissionSeeder = permissionSeeder;
            _logger = logger;
        }

        public async Task InitializeAsync()
        {
            _logger.LogInformation("Initializing Documents API data at {Time}", DateTime.UtcNow);

            // Seed permissions first
            await SeedPermissions();

            // Then seed document templates
            if (await documentTemplatesRepository.Empty())
            {
                _logger.LogInformation("Seeding document templates at {Time}", DateTime.UtcNow);
                var x = new DocumentTemplate()
                {
                    Name = "Test",
                    DocumentType = DocumentType.Contracts,
                    DocumentSections = new List<DocumentSection>(){
                        new DocumentSection(){
                            SectionType = SectionType.One,
                            InputFields = new List<DocumentInputField>(){
                                new DocumentInputField() {
                                    FieldType = FieldType.TextBox,
                                    PathToValue = "Client.Name",
                                    Options = new List<InputFieldOption>(){
                                        new InputFieldOption(){
                                            Name = "Header",
                                            Value = "Name: "
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                await documentTemplatesRepository.Add(x);
                _logger.LogInformation("Document templates seeded successfully at {Time}", DateTime.UtcNow);
            }
        }

        private async Task SeedPermissions()
        {
            _logger.LogInformation("Seeding Documents API permissions at {Time}", DateTime.UtcNow);

            var permissions = new List<PermissionDefinition>
            {
                new PermissionDefinition("documents:read", "View documents and templates"),
                new PermissionDefinition("documents:create", "Create new documents and templates"),
                new PermissionDefinition("documents:update", "Update documents and templates"),
                new PermissionDefinition("documents:delete", "Delete documents and templates")
            };

            var success = await _permissionSeeder.SeedPermissionsAsync(permissions);
            
            if (success)
            {
                _logger.LogInformation("Documents API permissions seeded successfully at {Time}", DateTime.UtcNow);
            }
            else
            {
                _logger.LogWarning("Failed to seed some Documents API permissions, service will continue but authorization may not work correctly");
            }
        }
    }
}