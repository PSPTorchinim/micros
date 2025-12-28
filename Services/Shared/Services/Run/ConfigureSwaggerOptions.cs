using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Shared.Services.Run
{
    using Microsoft.Extensions.Logging;

    public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly ILogger<ConfigureSwaggerOptions> _logger;

        public ConfigureSwaggerOptions(ILogger<ConfigureSwaggerOptions> logger)
        {
            _logger = logger;
        }

        public void Configure(SwaggerGenOptions options)
        {
            // Basic swagger configuration for the API Gateway
            // Individual service swagger docs can be accessed through the reverse proxy
            _logger.LogInformation("Swagger options configured for API Gateway.");
        }
    }
}
