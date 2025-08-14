using Shared.Entities;

namespace GearRecord.Entities
{
    public class GearType : IIdentifier, INamedEntity
    {
        public string Name { get; set; }
        public Guid Id { get; set; }
        public string Description { get; set; }
    }
}
