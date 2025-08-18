using Shared.Services.App;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Services.BuildBasicServices(builder.Configuration, "MailingMicroservice", "v0.0.1");
///builder.Services.AddHostedService<MailingBackgroundService>();
///builder.Services.BuildScope<Program, SeedData, IdentityScope>(UseDatabase.ConfigureSqlServer<IdentityContext>);

var app = builder.Build();

app.BuildBasicApp();
///await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<IdentityContext, Program>);

app.Run();
