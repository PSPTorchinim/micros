using Shared.Entities;

namespace Music.Entities
{
    public class Tag : IIdentifier, INamedEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual List<Song> Songs { get; set; }
    }
}
