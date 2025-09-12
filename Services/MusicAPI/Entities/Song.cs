using Shared.Entities;

namespace Music.Entities
{
    public class Song : IIdentifier, INamedEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public virtual Album Album { get; set; }
        public virtual List<Genre> Genres { get; set; }
        public string Composer { get; set; }
        public double BPM { get; set; }
        public string Key { get; set; }
        public long Length { get; set; }
        public virtual List<Tag> Tags { get; set; }
        public virtual List<Playlist> Playlists { get; set; }
        public string Lyrics { get; set; }
    }
}
