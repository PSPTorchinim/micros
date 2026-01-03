using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Shared.Helpers;
using System.Security.Cryptography;
using System.Text;

namespace Shared.Services.Security
{
    public class SecureMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SecureMiddleware> _logger;
        private readonly string _secureKeyHash;

        public SecureMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<SecureMiddleware> logger)
        {
            _next = next;
            _logger = logger;
            var secureKey = Environment.GetEnvironmentVariable("ASPNETCORE_SECURE_KEY");

            if (string.IsNullOrEmpty(secureKey))
            {
                throw new InvalidOperationException("SecureKey configuration is missing.");
            }

            _secureKeyHash = secureKey;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            context.Request.Headers.TryGetValue("secure_key", out StringValues headerValue);
            var hash = headerValue.FirstOrDefault();

            _logger.LogInformation("Received request for path: {Path} with secure_key header: {Hash}", 
                StringHelper.SanitizeForLog(context.Request.Path), StringHelper.SanitizeForLog(hash));

            // Compare directly if client sends hash
            if (string.IsNullOrEmpty(hash) || hash != _secureKeyHash)
            {
                _logger.LogWarning("Unauthorized request for path: {Path} with hash: {Hash}, secure_key_hash: {SecureKeyHash}", 
                    StringHelper.SanitizeForLog(context.Request.Path), StringHelper.SanitizeForLog(hash), StringHelper.SanitizeForLog(_secureKeyHash));
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("UNAUTHORIZED");
                return;
            }

            _logger.LogInformation("Authorized request for path: {Path}", StringHelper.SanitizeForLog(context.Request.Path));

            await _next(context);
        }

        private static string ComputeSha256Hash(string rawData)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                var builder = new StringBuilder();
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}