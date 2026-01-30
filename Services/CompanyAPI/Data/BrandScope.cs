using CompanyAPI.Repositories;
using CompanyAPI.Services;
using Shared.Services.App;

namespace CompanyAPI.Data
{
    public class BrandScope : Scope
    {
        public override void CreateScope(IServiceCollection services)
        {
            services.AddScoped<IBrandCustomFieldsRepository, BrandCustomFieldsRepository>();
            services.AddScoped<IBrandsRepository, BrandsRepository>();
            services.AddScoped<IBrandUsersRepository, BrandUsersRepository>();
            services.AddScoped<IClientCustomFieldsRepository, ClientCustomFieldsRepository>();
            services.AddScoped<IClientsRepository, ClientsRepository>();
            services.AddScoped<IElementsRepository, ElementsRepository>();
            services.AddScoped<IPackagesRepository, PackagesRepository>();

            services.AddScoped<IBrandsService, BrandsService>();
            services.AddScoped<IClientsService, ClientsService>();
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<IElementsService, ElementsService>();
        }
    }
}