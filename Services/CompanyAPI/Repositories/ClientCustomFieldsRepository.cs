using CompanyAPI.Data;
using CompanyAPI.Entities;

using Shared.Repositories;
namespace CompanyAPI.Repositories
{
    public interface IClientCustomFieldsRepository : IRepository<ClientCustomField>
    {

    }
    public class ClientCustomFieldsRepository : Repository<ClientCustomField, BrandContext>, IClientCustomFieldsRepository
    {
        public ClientCustomFieldsRepository(BrandContext context, ILogger<IClientCustomFieldsRepository> logger) : base(context, logger)
        {
        }
    }
}