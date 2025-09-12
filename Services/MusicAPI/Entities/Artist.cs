using Shared.Entities;

namespace Music.Entities
{
    public class Artist : IIdentifier, INamedEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual List<AlbumArtist> Albums { get; set; }
        public virtual List<Song> Single { get; set; }
    }
}
