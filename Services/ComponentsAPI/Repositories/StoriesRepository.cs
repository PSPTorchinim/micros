using ComponentsAPI.Data;
using ComponentsAPI.Entities;
using Shared.Repositories;

namespace ComponentsAPI.Repositories
{
    public class StoriesRepository : Repository<Story, ComponentsContext>, IStoriesRepository
    {
        public StoriesRepository(ComponentsContext context, ILogger<IStoriesRepository> logger) : base(context, logger)
        {
        }
    }
}
