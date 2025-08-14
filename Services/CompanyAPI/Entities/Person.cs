using Shared.Entities;
namespace CompanyAPI.Entities
{
    public class Person : IIdentifier, INamedEntity, ICreationDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
        public string AddresLine1 { get; set; }
        public string? AddresLine2 { get; set; }
    }
}