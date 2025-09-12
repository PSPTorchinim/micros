using Shared.Entities;

namespace IdentityAPI.Entities
{
    public class Permission : IIdentifier, INamedEntity, ICreationDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual IEnumerable<Role> Roles { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
