using CompanyAPI.Data;
using CompanyAPI.Entities;
using Shared.Repositories;

namespace CompanyAPI.Repositories
{
    public interface IBrandCustomFieldsRepository : IRepository<BrandCustomField>
    {

    }
    public class BrandCustomFieldsRepository : Repository<BrandCustomField, BrandContext>, IBrandCustomFieldsRepository
    {
        public BrandCustomFieldsRepository(BrandContext context, ILogger<IBrandCustomFieldsRepository> logger) : base(context, logger)
        {
        }
    }
}