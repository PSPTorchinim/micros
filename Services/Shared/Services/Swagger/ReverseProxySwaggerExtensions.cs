using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Yarp.ReverseProxy.Configuration;

namespace Shared.Services.Swagger
{
    /// <summary>
    /// Extension methods for configuring Swagger with YARP Reverse Proxy
    /// This replaces the AddSwagger extension from the incompatible Treyt.Yarp.ReverseProxy.Swagger package
    /// </summary>
    public static class ReverseProxySwaggerExtensions
    {
        public static IReverseProxyBuilder AddSwagger(this IReverseProxyBuilder builder, IConfigurationSection configSection)
        {
            // Configure the ReverseProxyDocumentFilterConfig from the configuration section
            builder.Services.Configure<ReverseProxyDocumentFilterConfig>(options =>
            {
                var clustersSection = configSection.GetSection("Clusters");
                
                foreach (var clusterSection in clustersSection.GetChildren())
                {
                    var clusterKey = clusterSection.Key;
                    var clusterConfig = new ClusterConfig();
                    
                    var destinationsSection = clusterSection.GetSection("Destinations");
                    foreach (var destSection in destinationsSection.GetChildren())
                    {
                        var destKey = destSection.Key;
                        var address = destSection.GetValue<string>("Address") ?? string.Empty;
                        
                        var destConfig = new DestinationConfig
                        {
                            Address = address
                        };

                        // Parse Swaggers configuration
                        var swaggersSection = destSection.GetSection("Swaggers");
                        if (swaggersSection.Exists())
                        {
                            destConfig.Swaggers = new List<SwaggerConfig>();
                            
                            foreach (var swaggerSection in swaggersSection.GetChildren())
                            {
                                var swaggerConfig = new SwaggerConfig
                                {
                                    PrefixPath = swaggerSection.GetValue<string>("PrefixPath") ?? string.Empty
                                };

                                var pathsSection = swaggerSection.GetSection("Paths");
                                if (pathsSection.Exists())
                                {
                                    swaggerConfig.Paths = pathsSection.Get<List<string>>() ?? new List<string>();
                                }

                                destConfig.Swaggers.Add(swaggerConfig);
                            }
                        }

                        clusterConfig.Destinations[destKey] = destConfig;
                    }

                    options.Clusters[clusterKey] = clusterConfig;
                }
            });

            return builder;
        }
    }
}
