using Shared.Entities;

namespace IdentityAPI.Entities
{
    public class Role : IIdentifier, INamedEntity, ICreationDate
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual IEnumerable<User> Users { get; set; }
        public virtual IEnumerable<Permission> Permissions { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
