using Microsoft.EntityFrameworkCore;
using Music.Data;
using Music.Entities;
using Shared.Repositories;

namespace Music.Repositories
{
    public class ArtistsRepository : Repository<Album, MusicContext>, IArtistsRepository
    {
        public ArtistsRepository(IDbContextFactory<MusicContext> context, ILogger<IArtistsRepository> logger) : base(context, logger)
        {
        }
    }

    public interface IArtistsRepository : IRepository<Album>
    {
    }
}
