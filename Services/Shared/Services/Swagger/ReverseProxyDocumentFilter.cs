using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Reader;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Shared.Services.Swagger
{
    /// <summary>
    /// Custom implementation of ReverseProxyDocumentFilter compatible with Swashbuckle.AspNetCore 10.x
    /// This replaces the incompatible Treyt.Yarp.ReverseProxy.Swagger package
    /// </summary>
    public class ReverseProxyDocumentFilter : IDocumentFilter
    {
        private readonly ReverseProxyDocumentFilterConfig _config;
        private readonly ILogger<ReverseProxyDocumentFilter> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public ReverseProxyDocumentFilter(
            IOptions<ReverseProxyDocumentFilterConfig> config,
            ILogger<ReverseProxyDocumentFilter> logger,
            IHttpClientFactory httpClientFactory)
        {
            _config = config.Value;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            try
            {
                // Get the current document name from context
                var documentName = context.DocumentName;
                
                _logger.LogInformation("Applying ReverseProxyDocumentFilter for document: {DocumentName}", documentName);

                // If this is not a cluster-specific document, skip
                if (documentName == "v1" || !_config.Clusters.ContainsKey(documentName))
                {
                    _logger.LogDebug("Document {DocumentName} is not a cluster document, skipping", documentName);
                    return;
                }

                // Get the cluster configuration
                var cluster = _config.Clusters[documentName];
                
                // Process each destination in the cluster
                foreach (var destination in cluster.Destinations.Values)
                {
                    if (destination.Swaggers == null || !destination.Swaggers.Any())
                    {
                        _logger.LogDebug("No swagger configs for destination at {Address}", destination.Address);
                        continue;
                    }

                    foreach (var swaggerConfig in destination.Swaggers)
                    {
                        foreach (var path in swaggerConfig.Paths)
                        {
                            try
                            {
                                var swaggerUrl = $"{destination.Address.TrimEnd('/')}/{path.TrimStart('/')}";
                                _logger.LogInformation("Fetching swagger from: {SwaggerUrl}", swaggerUrl);

                                // Fetch and merge the swagger document
                                // Using ConfigureAwait(false) to reduce deadlock risk in sync context
                                var remoteDoc = FetchSwaggerDocumentAsync(swaggerUrl).ConfigureAwait(false).GetAwaiter().GetResult();
                                
                                if (remoteDoc != null)
                                {
                                    MergeSwaggerDocument(swaggerDoc, remoteDoc, swaggerConfig.PrefixPath);
                                    _logger.LogInformation("Successfully merged swagger from {SwaggerUrl}", swaggerUrl);
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "Failed to fetch swagger from {Address}/{Path}", destination.Address, path);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying ReverseProxyDocumentFilter");
            }
        }

        private async Task<OpenApiDocument?> FetchSwaggerDocumentAsync(string url)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(10);

                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to fetch swagger from {Url}: {StatusCode}", url, response.StatusCode);
                    return null;
                }

                var stream = await response.Content.ReadAsStreamAsync();
                var reader = new OpenApiJsonReader();
                var settings = new OpenApiReaderSettings();
                var document = await reader.ReadAsync(stream, new Uri(url, UriKind.Absolute), settings);

                if (document.Diagnostic?.Errors != null && document.Diagnostic.Errors.Any())
                {
                    _logger.LogWarning("OpenAPI document has errors: {Errors}", 
                        string.Join(", ", document.Diagnostic.Errors.Select(e => e.Message)));
                }

                return document.Document;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Exception while fetching swagger from {Url}", url);
                return null;
            }
        }

        private void MergeSwaggerDocument(OpenApiDocument target, OpenApiDocument source, string prefixPath)
        {
            // Normalize prefix path
            var prefix = prefixPath.Trim('/');
            if (!string.IsNullOrEmpty(prefix))
            {
                prefix = "/" + prefix;
            }

            // Merge paths
            foreach (var path in source.Paths)
            {
                var newPath = prefix + path.Key;
                
                if (!target.Paths.ContainsKey(newPath))
                {
                    target.Paths.Add(newPath, path.Value);
                }
                else
                {
                    _logger.LogDebug("Path {Path} already exists, skipping", newPath);
                }
            }

            // Merge components (schemas, security schemes, etc.)
            if (source.Components != null)
            {
                if (target.Components == null)
                {
                    target.Components = new OpenApiComponents();
                }

                // Merge schemas
                if (source.Components.Schemas != null)
                {
                    foreach (var schema in source.Components.Schemas)
                    {
                        if (!target.Components.Schemas.ContainsKey(schema.Key))
                        {
                            target.Components.Schemas.Add(schema.Key, schema.Value);
                        }
                    }
                }

                // Merge security schemes
                if (source.Components.SecuritySchemes != null)
                {
                    foreach (var securityScheme in source.Components.SecuritySchemes)
                    {
                        if (!target.Components.SecuritySchemes.ContainsKey(securityScheme.Key))
                        {
                            target.Components.SecuritySchemes.Add(securityScheme.Key, securityScheme.Value);
                        }
                    }
                }
            }

            // Merge tags
            if (source.Tags != null)
            {
                foreach (var tag in source.Tags)
                {
                    if (!target.Tags.Any(t => t.Name == tag.Name))
                    {
                        target.Tags.Add(tag);
                    }
                }
            }
        }
    }
}
