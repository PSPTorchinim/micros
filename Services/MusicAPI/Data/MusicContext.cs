using Microsoft.EntityFrameworkCore;
using Music.Entities;

namespace Music.Data
{
    public class MusicContext : DbContext
    {
        public DbSet<Album> Albums { get; set; }
        public DbSet<AlbumArtist> AlbumArtists { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Entities.Directory> Directories { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public MusicContext(DbContextOptions<MusicContext> options)
        : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}