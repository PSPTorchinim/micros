using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System.Security.Cryptography;
using System.Text;

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
            _secureKey = configuration["SecureKey"] ?? Environment.GetEnvironmentVariable("SECURE_KEY");

            if (string.IsNullOrEmpty(_secureKey))
            {
                throw new InvalidOperationException("SecureKey configuration is missing.");
            }
        }

        public async Task InvokeAsync(HttpContext context)
        {
            context.Request.Headers.TryGetValue("secure_value", out StringValues headerValue);
            var hash = headerValue.FirstOrDefault();

            if (string.IsNullOrEmpty(hash) || !IsValidHash(hash))
            {
                _logger.LogWarning("Unauthorized request for path: {Path} with hash: {Hash}", context.Request.Path, hash);
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("UNAUTHORIZED");
                return;
            }

            await _next(context);
        }

        private bool IsValidHash(string hash)
        {
            try
            {
                var hashBytes = Convert.FromBase64String(hash);
                using var sha256 = SHA256.Create();
                var computedHashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(_secureKey));
                return hashBytes.SequenceEqual(computedHashBytes);
            }
            catch
            {
                return false;
            }
        }
    }
}