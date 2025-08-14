using DocumentsAPI.Data;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Services.BuildBasicServices(builder.Configuration, "Documents", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, DocumentsScope>(UseDatabase.ConfigureMongoDBServer);

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>();

app.Run();
