using Microsoft.EntityFrameworkCore;
using Music.Data;
using Shared.Repositories;

namespace Music.Repositories
{
    public class DirectoriesRepository : Repository<Entities.Directory, MusicContext>, IDirectoriesRepository
    {
        public DirectoriesRepository(IDbContextFactory<MusicContext> context, ILogger<IDirectoriesRepository> logger) : base(context, logger)
        {
        }
    }

    public interface IDirectoriesRepository : IRepository<Entities.Directory>
    {
    }
}
