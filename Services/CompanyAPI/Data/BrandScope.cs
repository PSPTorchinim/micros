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
            services.AddScoped<ICompanyTypeRepository, CompanyTypeRepository>();
            services.AddScoped<IExternalCompanyTypeApiClient, ExternalCompanyTypeApiClient>();

            // Named HTTP client for the GLEIF entity-legal-forms API.
            // Base address defaults to the public GLEIF API; override via
            // ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_URL for mirrors or testing.
            services.AddHttpClient(ExternalCompanyTypeApiClient.HttpClientName, client =>
            {
                client.BaseAddress = new Uri(ExternalCompanyTypeApiClient.GleifApiBaseUrl);
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("Accept", "application/vnd.api+json");
            });

            services.AddScoped<IBrandsService, BrandsService>();
            services.AddScoped<IClientsService, ClientsService>();
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<IElementsService, ElementsService>();
            services.AddScoped<ICompanyTypeService, CompanyTypeService>();
        }
    }
}