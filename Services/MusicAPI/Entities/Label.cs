using Shared.Entities;

namespace Music.Entities
{
    public class Label : IIdentifier, INamedEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual List<Album> Albums { get; set; }
    }
}
