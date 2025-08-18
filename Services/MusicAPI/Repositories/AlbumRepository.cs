using Music.Data;
using Music.Entities;
using Shared.Repositories;

namespace Music.Repositories
{
    public class AlbumRepository : Repository<Album, MusicContext>, IAlbumRepository
    {
        public AlbumRepository(MusicContext context, ILogger<IAlbumRepository> logger) : base(context, logger)
        {
        }
    }

    public interface IAlbumRepository : IRepository<Album>
    {
    }
}
