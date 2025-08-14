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
            context.Request.Headers.TryGetValue("secure_key", out StringValues headerValue);
            var hash = headerValue.FirstOrDefault();

            _logger.LogInformation("Received request for path: {Path} with secure_key header: {Hash}", context.Request.Path, hash);

            if (string.IsNullOrEmpty(hash) || !IsValidHash(hash))
            {
                _logger.LogWarning("Unauthorized request for path: {Path} with hash: {Hash}", context.Request.Path, hash);
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("UNAUTHORIZED");
                return;
            }

            _logger.LogInformation("Authorized request for path: {Path}", context.Request.Path);

            await _next(context);
        }

        private bool IsValidHash(string hash)
        {
            try
            {
                _logger.LogDebug("Validating secure_key header...");
                _logger.LogDebug("Header value (Base64): {Hash}", hash);
                var hashBytes = Convert.FromBase64String(hash);
                using var sha256 = SHA256.Create();
                var keyBytes = Encoding.UTF8.GetBytes(_secureKey);
                _logger.LogDebug("SECURE_KEY value: {SecureKey}", _secureKey);
                _logger.LogDebug("SECURE_KEY bytes (UTF8): {KeyBytes}", BitConverter.ToString(keyBytes));
                var computedHashBytes = sha256.ComputeHash(keyBytes);
                _logger.LogDebug("Computed hash bytes: {ComputedHash}", BitConverter.ToString(computedHashBytes));
                _logger.LogDebug("Header hash bytes: {HeaderHash}", BitConverter.ToString(hashBytes));
                bool isValid = hashBytes.SequenceEqual(computedHashBytes);
                _logger.LogDebug("Hash validation result: {Result}", isValid);
                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while validating secure_key header.");
                return false;
            }
        }
    }
}