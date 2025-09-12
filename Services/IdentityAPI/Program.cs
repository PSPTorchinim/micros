using IdentityAPI.Data;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Services.BuildBasicServices(builder.Configuration, "Identity", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, IdentityScope>(UseDatabase.ConfigureSqlServer<IdentityContext>);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<IdentityContext, Program>);

app.Run();
