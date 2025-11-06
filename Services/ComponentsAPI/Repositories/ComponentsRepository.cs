using ComponentsAPI.Data;
using ComponentsAPI.Entities;
using Shared.Repositories;

namespace ComponentsAPI.Repositories
{
    public class ComponentsRepository : Repository<Component, ComponentsContext>, IComponentsRepository
    {
        public ComponentsRepository(ComponentsContext context, ILogger<IComponentsRepository> logger) : base(context, logger)
        {
        }
    }
}
