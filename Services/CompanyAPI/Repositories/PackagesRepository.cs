using CompanyAPI.Data;
using CompanyAPI.Entities;

using Shared.Repositories;
namespace CompanyAPI.Repositories
{
    public interface IPackagesRepository : IRepository<Package>
    {

    }
    public class PackagesRepository : Repository<Package, BrandContext>, IPackagesRepository
    {
        public PackagesRepository(BrandContext context, ILogger<IPackagesRepository> logger) : base(context, logger)
        {
        }
    }
}