using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Yarp.ReverseProxy.Swagger;

namespace Shared.Services.Run
{
    using Microsoft.Extensions.Logging;

    public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly ReverseProxyDocumentFilterConfig _reverseProxyDocumentFilterConfig;
        private readonly ILogger<ConfigureSwaggerOptions> _logger;

        public ConfigureSwaggerOptions(
            IOptionsMonitor<ReverseProxyDocumentFilterConfig> reverseProxyDocumentFilterConfigOptions,
            ILogger<ConfigureSwaggerOptions> logger)
        {
            _reverseProxyDocumentFilterConfig = reverseProxyDocumentFilterConfigOptions.CurrentValue;
            _logger = logger;
        }

        public void Configure(SwaggerGenOptions options)
        {
            var filterDescriptors = new List<FilterDescriptor>();

            foreach (var cluster in _reverseProxyDocumentFilterConfig.Clusters)
            {
                options.SwaggerDoc(cluster.Key, new OpenApiInfo { Title = cluster.Key, Version = cluster.Key });
                _logger.LogInformation("Added SwaggerDoc for cluster: {ClusterKey}", cluster.Key);
            }

            filterDescriptors.Add(new FilterDescriptor
            {
                Type = typeof(ReverseProxyDocumentFilter),
                Arguments = Array.Empty<object>()
            });

            options.DocumentFilterDescriptors = filterDescriptors;
            _logger.LogInformation("Configured DocumentFilterDescriptors with ReverseProxyDocumentFilter.");
        }
    }
}
