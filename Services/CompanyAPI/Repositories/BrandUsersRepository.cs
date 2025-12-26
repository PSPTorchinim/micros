using CompanyAPI.Data;
using CompanyAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Repositories;
namespace CompanyAPI.Repositories
{
    public interface IBrandUsersRepository : IRepository<BrandUser>
    {

    }

    public class BrandUsersRepository : Repository<BrandUser, BrandContext>, IBrandUsersRepository
    {
        public BrandUsersRepository(IDbContextFactory<BrandContext> context, ILogger<IBrandUsersRepository> logger) : base(context, logger)
        {
        }
    }
}