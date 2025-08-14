using Shared.Entities;

namespace Music.Entities
{
    public class Genre : IIdentifier, INamedEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual List<Song> Songs { get; set; }
    }
}
