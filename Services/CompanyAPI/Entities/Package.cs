using Shared.Entities;

namespace CompanyAPI.Entities
{
    public class Package : IIdentifier, INamedEntity, ICreationDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<Element> Elements { get; set; }
        public double Price { get; set; }
        public Brand Brand { get; set; }
    }
}
