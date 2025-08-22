using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace Shared.Services.Security
{
    public class SecureMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SecureMiddleware> _logger;
        private readonly string _secureKey;

        public SecureMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<SecureMiddleware> logger)
        {
            _next = next;
            _logger = logger;
            _secureKey = Environment.GetEnvironmentVariable("SECURE_KEY");

            if (string.IsNullOrEmpty(_secureKey))
            {
                throw new InvalidOperationException("SecureKey configuration is missing.");
            }
        }

        public async Task InvokeAsync(HttpContext context)
        {
            context.Request.Headers.TryGetValue("secure_key", out StringValues headerValue);
            var hash = headerValue.FirstOrDefault();

            _logger.LogInformation("Received request for path: {Path} with secure_key header: {Hash}", context.Request.Path, hash);

            if (string.IsNullOrEmpty(hash) || hash != _secureKey)
            {
                _logger.LogWarning("Unauthorized request for path: {Path} with hash: {Hash}, secure_key: {SecureKey}", context.Request.Path, hash, _secureKey);
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("UNAUTHORIZED");
                return;
            }

            _logger.LogInformation("Authorized request for path: {Path}", context.Request.Path);

            await _next(context);
        }
    }
}