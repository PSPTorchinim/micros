using Microsoft.EntityFrameworkCore;
using Music.Data;
using Music.Entities;
using Shared.Repositories;

namespace Music.Repositories
{
    public class LabelsRepository : Repository<Label, MusicContext>, ILabelsRepository
    {
        public LabelsRepository(IDbContextFactory<MusicContext> context, ILogger<ILabelsRepository> logger) : base(context, logger)
        {
        }
    }

    public interface ILabelsRepository : IRepository<Label>
    {
    }
}
