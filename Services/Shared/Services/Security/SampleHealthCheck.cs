using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Logging;

namespace Shared.Services.Security
{
    public class SampleHealthCheck : IHealthCheck
    {
        private readonly ILogger<SampleHealthCheck> _logger;

        public SampleHealthCheck(ILogger<SampleHealthCheck> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("SampleHealthCheck is running...");

            // Simulate a health check
            var isHealthy = true;

            if (isHealthy)
            {
                _logger.LogInformation("SampleHealthCheck is healthy.");
                // If healthy, return Healthy status
                return Task.FromResult(HealthCheckResult.Healthy("SampleHealthCheck is healthy."));
            }
            else
            {
                _logger.LogWarning("SampleHealthCheck is unhealthy.");
                // If unhealthy, return Unhealthy status
                return Task.FromResult(HealthCheckResult.Unhealthy("SampleHealthCheck is unhealthy."));
            }
        }
    }
}
