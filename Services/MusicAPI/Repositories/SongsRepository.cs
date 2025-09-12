using Music.Data;
using Music.Entities;
using Shared.Repositories;

namespace Music.Repositories
{
    public class SongsRepository : Repository<Song, MusicContext>, ISongsRepository
    {
        public SongsRepository(MusicContext context, ILogger<ISongsRepository> logger) : base(context, logger)
        {
        }
    }

    public interface ISongsRepository : IRepository<Song>
    {
    }
}
