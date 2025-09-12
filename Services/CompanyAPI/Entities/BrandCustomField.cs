using Shared.Entities;

namespace CompanyAPI.Entities
{
    public class BrandCustomField : IIdentifier, INamedEntity, ICreationDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }

        public Brand Brand { get; set; }
    }
}
