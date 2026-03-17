using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Microsoft.OpenApi.Reader;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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
        private const long MaxResponseSize = 10 * 1024 * 1024; // 10MB limit for swagger documents
        
        // IP address range constants for SSRF protection
        private const byte LinkLocalFirstOctet = 169;
        private const byte LinkLocalSecondOctet = 254;
        private const byte PrivateClassAFirstOctet = 10;
        private const byte PrivateClassBFirstOctet = 172;
        private const byte PrivateClassBSecondOctetMin = 16;
        private const byte PrivateClassBSecondOctetMax = 31;
        private const byte PrivateClassCFirstOctet = 192;
        private const byte PrivateClassCSecondOctet = 168;

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
                if (documentName == "v1" || !_config.Clusters.TryGetValue(documentName, out var cluster))
                {
                    _logger.LogDebug("Document {DocumentName} is not a cluster document, skipping", documentName);
                    return;
                }

                // cluster is now retrieved via TryGetValue
                
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
                                
                                // Validate URL before making request to prevent SSRF attacks
                                if (!IsValidSwaggerUrl(swaggerUrl))
                                {
                                    _logger.LogWarning("Invalid or unsafe swagger URL rejected: {SwaggerUrl}", swaggerUrl);
                                    continue;
                                }
                                
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
                            catch (HttpRequestException ex)
                            {
                                _logger.LogWarning(ex, "HTTP error fetching swagger from {Address}/{Path}", destination.Address, path);
                            }
                            catch (TaskCanceledException ex)
                            {
                                _logger.LogWarning(ex, "Timeout fetching swagger from {Address}/{Path}", destination.Address, path);
                            }
                            catch (UriFormatException ex)
                            {
                                _logger.LogWarning(ex, "Invalid URL format for {Address}/{Path}", destination.Address, path);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "Unexpected error fetching swagger from {Address}/{Path}", destination.Address, path);
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

        private bool IsDevelopmentEnvironment()
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            return environment.Contains("Development");
        }

        private bool IsValidSwaggerUrl(string url)
        {
            // Validate URL format and prevent SSRF attacks
            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            {
                return false;
            }

            // Only allow HTTP and HTTPS schemes
            if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
            {
                return false;
            }

            // Prevent access to localhost and loopback addresses to mitigate SSRF
            // Allow localhost only in development environment
            if (uri.IsLoopback && !IsDevelopmentEnvironment())
            {
                return false;
            }

            // Prevent access to private IP ranges to mitigate SSRF
            if ((uri.HostNameType == UriHostNameType.IPv4 || uri.HostNameType == UriHostNameType.IPv6)
                && IPAddress.TryParse(uri.Host, out var ipAddress))
            {
                if (IsRestrictedIpAddress(ipAddress))
                {
                    return false;
                }
            }

            return true;
        }

        private bool IsRestrictedIpAddress(IPAddress ipAddress)
        {
            var bytes = ipAddress.GetAddressBytes();

            // Allow private IPs only in development environment
            if (IsPrivateIPv4Address(ipAddress, bytes) && !IsDevelopmentEnvironment())
            {
                return true;
            }

            // Link-local addresses (169.254.0.0/16) - always block
            return bytes[0] == LinkLocalFirstOctet && bytes[1] == LinkLocalSecondOctet;
        }

        private static bool IsPrivateIPv4Address(IPAddress ipAddress, byte[] bytes)
        {
            if (ipAddress.AddressFamily != System.Net.Sockets.AddressFamily.InterNetwork)
            {
                return false;
            }

            // 10.0.0.0/8
            if (bytes[0] == PrivateClassAFirstOctet)
            {
                return true;
            }

            // 172.16.0.0/12
            if (bytes[0] == PrivateClassBFirstOctet
                && bytes[1] >= PrivateClassBSecondOctetMin
                && bytes[1] <= PrivateClassBSecondOctetMax)
            {
                return true;
            }

            // 192.168.0.0/16
            return bytes[0] == PrivateClassCFirstOctet && bytes[1] == PrivateClassCSecondOctet;
        }

        private async Task<OpenApiDocument?> FetchSwaggerDocumentAsync(string url)
        {
            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(10);
                
                // Set max response size to prevent resource exhaustion
                client.MaxResponseContentBufferSize = MaxResponseSize;

                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Failed to fetch swagger from {Url}: {StatusCode}", url, response.StatusCode);
                    return null;
                }

                // Check content length before reading to prevent resource exhaustion
                if (response.Content.Headers.ContentLength.HasValue && 
                    response.Content.Headers.ContentLength.Value > MaxResponseSize)
                {
                    _logger.LogWarning("Swagger document at {Url} exceeds maximum size limit of {MaxSize} bytes", 
                        url, MaxResponseSize);
                    return null;
                }

                var stream = await response.Content.ReadAsStreamAsync();
                var reader = new OpenApiJsonReader();
                var settings = new OpenApiReaderSettings();
                
                // Validate URL before creating Uri to prevent exceptions
                if (!Uri.TryCreate(url, UriKind.Absolute, out var documentUri))
                {
                    _logger.LogWarning("Invalid URL format for OpenAPI reader: {Url}", url);
                    return null;
                }
                
                var document = await reader.ReadAsync(stream, documentUri, settings);

                if (document.Diagnostic?.Errors != null && document.Diagnostic.Errors.Any())
                {
                    _logger.LogWarning("OpenAPI document has errors: {Errors}", 
                        string.Join(", ", document.Diagnostic.Errors.Select(e => e.Message)));
                }

                return document.Document;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "HTTP error while fetching swagger from {Url}", url);
                return null;
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogWarning(ex, "Timeout while fetching swagger from {Url}", url);
                return null;
            }
            catch (IOException ex)
            {
                _logger.LogWarning(ex, "IO error while fetching swagger from {Url}", url);
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
            if (source.Paths != null)
            {
                if (target.Paths == null)
                {
                    target.Paths = new OpenApiPaths();
                }
                
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
                    foreach (var schema in source.Components.Schemas.Where(s => !target.Components.Schemas.ContainsKey(s.Key)))
                    {
                        target.Components.Schemas.Add(schema.Key, schema.Value);
                    }
                }

                // Merge security schemes
                if (source.Components.SecuritySchemes != null)
                {
                    foreach (var securityScheme in source.Components.SecuritySchemes.Where(s => !target.Components.SecuritySchemes.ContainsKey(s.Key)))
                    {
                        target.Components.SecuritySchemes.Add(securityScheme.Key, securityScheme.Value);
                    }
                }
            }

            // Merge tags
            if (source.Tags != null)
            {
                if (target.Tags == null)
                {
                    target.Tags = new HashSet<OpenApiTag>();
                }
                
                foreach (var tag in source.Tags.Where(tag => !target.Tags.Any(t => t.Name == tag.Name)))
                {
                    target.Tags.Add(tag);
                }
            }
        }
    }
}
