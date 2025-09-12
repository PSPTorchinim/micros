using Shared.Entities;

namespace IdentityAPI.Entities
{
    public class Block : IIdentifier, ICreationDate
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? To { get; set; }
        public string? Reason { get; set; }
        public bool Deactivated { get; set; }
        public bool Pernament { get; set; }
        public DateTime? DeactivationTime { get; set; }
    }
}
