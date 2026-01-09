using CompanyAPI.Services;
using Shared.Services.App;

namespace CompanyAPI.Data
{
    public class BrandScope : Scope
    {
        public override void CreateScope(IServiceCollection services)
        {
            services.AddScoped<ICompanyService, CompanyService>();
        }
    }
}