using Shared.Entities;

namespace Music.Entities
{
    public class AlbumArtist : IIdentifier
    {
        public Guid Id { get; set; }
        public virtual Artist Artist { get; set; }
        public virtual Album Album { get; set; }
        public ArtistType ArtistType { get; set; }
    }

    public enum ArtistType
    {
        AlbumArtist, FeaturingArtist
    }
}
