using Shared.Entities;

namespace CompanyAPI.Entities
{
    public class Element : IIdentifier, INamedEntity, ICreationDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public double Price { get; set; }
        public List<Package> Packages { get; set; }
    }
}
