namespace DocumentsAPI.Entities
{
    public class Document
    {
        public string Id { get; set; }
        public List<DocumentOption> Options { get; set; }
        public Guid BrandId { get; set; }
        public Guid UserId { get; set; }
        public Guid ClientId { get; set; }
    }

    public class DocumentOption
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}