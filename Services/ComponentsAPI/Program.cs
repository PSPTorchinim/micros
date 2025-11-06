using ComponentsAPI.Data;
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();
builder.Services.BuildBasicServices(builder.Configuration, "Components", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, ComponentsScope>(UseDatabase.ConfigureSqlServer<ComponentsContext>);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<ComponentsContext, Program>);

app.Run();
Log.CloseAndFlush();
