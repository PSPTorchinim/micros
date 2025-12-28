using Microsoft.Extensions.Options;
using Serilog;
using Shared.Services.App;
using Shared.Services.Run;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.BuildBasicServices(builder.Configuration, "ApiGateway", "v0.0.1", true);
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();

var app = builder.Build();

app.BuildBasicApp(null, options =>
{
    options.SwaggerEndpoint($"/swagger/v1/swagger.json", "Api Gateway");
    // Swagger endpoints for downstream services are now configured manually
    // You can add individual service endpoints here if needed
});
app.MapReverseProxy();

app.Run();
Log.CloseAndFlush();
