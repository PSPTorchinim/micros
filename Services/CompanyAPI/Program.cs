using CompanyAPI.Data;
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();
builder.Services.BuildBasicServices(builder.Configuration, "Company", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, BrandScope>(services =>
{
    UseDatabase.ConfigureSqlServer<BrandContext>(services);
    UseDatabase.ConfigureMongoDBServer(services);
});

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<BrandContext, Program>);

app.Run();
Log.CloseAndFlush();
