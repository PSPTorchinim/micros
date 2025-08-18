using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DocumentsAPI.Entities
{
    public enum DocumentType
    {
        Contracts, Invoices, Proposals, LeadCaptures, Agreements, Questionaires
    }

    public class DocumentTemplate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Name { get; set; }
        public DocumentType DocumentType { get; set; }
        public List<DocumentSection> DocumentSections { get; set; }
    }

    public enum SectionType
    {
        One = 1, Two = 2, Three = 3, Four = 4
    }

    public class DocumentSection
    {
        public SectionType SectionType { get; set; }
        public List<DocumentInputField> InputFields { get; set; }
        public List<DocumentSection> DocumentSections { get; set; }
        public string SectionContent { get; set; }
    }

    public enum FieldType
    {
        TextBox, ShortAnswer, FreeResponse, DateSelect, Package, Dropdown, CheckBoxes, MultipleCheckboxes
    }

    public class DocumentInputField
    {
        public FieldType FieldType { get; set; }
        public string PathToValue { get; set; }
        public List<InputFieldOption> Options { get; set; }
    }

    public class InputFieldOption
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
