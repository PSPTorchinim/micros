using CompanyAPI.Data;
using CompanyAPI.Entities;

using Shared.Repositories;
namespace CompanyAPI.Repositories
{
    public interface IElementsRepository : IRepository<Element>
    {

    }
    public class ElementsRepository : Repository<Element, BrandContext>, IElementsRepository
    {
        public ElementsRepository(BrandContext context, ILogger<IElementsRepository> logger) : base(context, logger)
        {
        }
    }
}