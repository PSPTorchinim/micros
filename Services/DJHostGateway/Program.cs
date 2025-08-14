using Microsoft.Extensions.Options;
using Shared.Services.App;
using Shared.Services.Run;
using Swashbuckle.AspNetCore.SwaggerGen;
using Yarp.ReverseProxy.Swagger;

var builder = WebApplication.CreateBuilder(args);

builder.Services.BuildBasicServices(builder.Configuration, "ApiGateway", "v0.0.1", true);
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();

var app = builder.Build();

app.BuildBasicApp(null, options =>
{
    options.SwaggerEndpoint($"/swagger/v1/swagger.json", "Api Gateway");
    var config = app.Services.GetRequiredService<IOptionsMonitor<ReverseProxyDocumentFilterConfig>>().CurrentValue;
    foreach (var cluster in config.Clusters)
    {
        options.SwaggerEndpoint($"/swagger/{cluster.Key}/swagger.json", cluster.Key);
    }
});
app.MapReverseProxy();

app.Run();
