using Microsoft.Extensions.Options;
using Serilog;
using Shared.Services.App;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.BuildBasicServices(builder.Configuration, "ApiGateway", "v0.0.1", true);

var app = builder.Build();

app.BuildBasicApp(null, options =>
{
    options.SwaggerEndpoint($"/swagger/v1/swagger.json", "Api Gateway");
    // To add downstream service Swagger endpoints, add them here:
    // options.SwaggerEndpoint($"/serviceName/swagger/v1/swagger.json", "Service Name");
});
app.MapReverseProxy();

app.Run();
Log.CloseAndFlush();
