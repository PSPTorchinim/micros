using CompanyAPI.Data;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Services.BuildBasicServices(builder.Configuration, "Brand", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, BrandScope>(UseDatabase.ConfigureSqlServer<BrandContext>);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<BrandContext, Program>);

app.Run();