using Shared.Entities;

namespace Music.Entities
{
    public class Album : IIdentifier, INamedEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual List<Song> Songs { get; set; }
        public virtual List<AlbumArtist> Artists { get; set; }
        public virtual Label Label { get; set; }
        public string CoverImage { get; set; }
    }
}
