using PartyAPI.Data;
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();
builder.Services.BuildBasicServices(builder.Configuration, "Party", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, PartyScope>(UseDatabase.ConfigureSqlServer<PartyContext>);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<PartyContext, Program>);

app.Run();
Log.CloseAndFlush();
