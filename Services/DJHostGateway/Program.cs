using DJHostGateway.Transforms;
using Microsoft.Extensions.Options;
using Serilog;
using Shared.Services.App;
using Shared.Services.Run;
using Shared.Services.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

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

// Add security stamp validation transform
app.MapReverseProxy(async proxyPipeline =>
{
    proxyPipeline.Use(async (context, next) =>
    {
        var httpClientFactory = context.RequestServices.GetRequiredService<IHttpClientFactory>();
        var logger = context.RequestServices.GetRequiredService<ILogger<SecurityStampValidationTransform>>();
        var configuration = context.RequestServices.GetRequiredService<IConfiguration>();
        var transform = new SecurityStampValidationTransform(httpClientFactory, logger, configuration);
        
        var transformContext = new RequestTransformContext
        {
            HttpContext = context
        };
        
        await transform.ApplyAsync(transformContext);

        if (context.Response.HasStarted)
            return;

        await next();
    });
    
    proxyPipeline.UseSessionAffinity();
    proxyPipeline.UseLoadBalancing();
});

app.Run();
Log.CloseAndFlush();
