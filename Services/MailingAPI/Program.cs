using MailingAPI.BackgroundServices;
using MailingAPI.Data;
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();
builder.Services.BuildBasicServices(builder.Configuration, "MailingMicroservice", "v0.0.1");
///builder.Services.AddHostedService<MailingBackgroundService>();
builder.Services.BuildScope<Program, SeedData, MailingScope>(UseDatabase.ConfigureSqlServer<MailingContext>);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<MailingContext, Program>);

app.Run();
Log.CloseAndFlush();