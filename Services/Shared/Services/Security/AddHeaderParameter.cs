using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

using Microsoft.Extensions.Logging;

namespace Shared.Services.Security
{
    public class AddHeaderParameter : IOperationFilter
    {
        private readonly ILogger<AddHeaderParameter> _logger;

        public AddHeaderParameter(ILogger<AddHeaderParameter> logger)
        {
            _logger = logger;
        }

        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.Parameters == null)
                operation.Parameters = new List<OpenApiParameter>();

            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "secure_value",
                In = ParameterLocation.Header,
                Required = true,
                Schema = new OpenApiSchema
                {
                    Type = "string"
                }
            });

            _logger.LogInformation("Added 'secure_value' header parameter to operation {OperationId}", operation.OperationId);
        }
    }
}
