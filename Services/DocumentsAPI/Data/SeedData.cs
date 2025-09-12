using DocumentsAPI.Entities;
using DocumentsAPI.Repositories;
using Shared.Services.Database;

namespace DocumentsAPI.Data
{
    public class SeedData : IDatabaseInitializer
    {

        private readonly DocumentTemplatesRepository documentTemplatesRepository;

        public SeedData(DocumentTemplatesRepository documentTemplatesRepository)
        {
            this.documentTemplatesRepository = documentTemplatesRepository;
        }

        public async Task InitializeAsync()
        {
            if (await documentTemplatesRepository.Empty())
            {
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
            }
        }
    }
}