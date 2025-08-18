using Music.Data;
using Music.Entities;
using Shared.Repositories;

namespace Music.Repositories
{
    public class GenresRepository : Repository<Genre, MusicContext>, IGenresRepository
    {
        public GenresRepository(MusicContext context, ILogger<IGenresRepository> logger) : base(context, logger)
        {
        }
    }

    public interface IGenresRepository : IRepository<Genre>
    {
    }
}
