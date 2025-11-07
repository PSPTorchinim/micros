using Music.Data;
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.BuildBasicServices(builder.Configuration, "Music", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, MusicScope>(UseDatabase.ConfigureSqlServer<MusicContext>);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<MusicContext, Program>);

app.Run();
Log.CloseAndFlush();
