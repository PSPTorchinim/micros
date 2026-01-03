using CompanyAPI.Data;
using CompanyAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Repositories;
namespace CompanyAPI.Repositories
{
    public interface IClientsRepository : IRepository<Client>
    {

    }

    public class ClientsRepository : Repository<Client, BrandContext>, IClientsRepository
    {
        public ClientsRepository(IDbContextFactory<BrandContext> context, ILogger<IClientsRepository> logger) : base(context, logger)
        {
        }
    }
}