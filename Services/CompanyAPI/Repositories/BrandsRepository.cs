using CompanyAPI.Data;
using CompanyAPI.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Repositories;

namespace CompanyAPI.Repositories
{
    public interface IBrandsRepository : IRepository<Brand>
    {

    }

    public class BrandsRepository : Repository<Brand, BrandContext>, IBrandsRepository
    {
        public BrandsRepository(IDbContextFactory<BrandContext> context, ILogger<IBrandsRepository> logger) : base(context, logger)
        {
        }
    }
}