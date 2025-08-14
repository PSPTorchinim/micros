using Shared.Entities;

namespace GearRecord.Entities
{
    public class Gear : IIdentifier, INamedEntity
    {
        public string Name { get; set; }
        public Guid Id { get; set; }
        public GearType GearType { get; set; }
        public string Description { get; set; }
        public double BuyPrice { get; set; }
    }
}
