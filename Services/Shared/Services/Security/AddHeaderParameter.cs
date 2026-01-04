using Microsoft.Extensions.Logging;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

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
                operation.Parameters = new List<IOpenApiParameter>();

            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "secure_key",
                In = ParameterLocation.Header,
                Required = true,
                Schema = new OpenApiSchema
                {
                    Type = JsonSchemaType.String
                }
            });

            _logger.LogInformation("Added 'secure_key' header parameter to operation {OperationId}", operation.OperationId);
        }
    }
}
