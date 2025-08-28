using Microsoft.Extensions.Hosting;

namespace Shared.Services.MessagesBroker.RabbitMQ
{
    using Microsoft.Extensions.Logging;

    public class RabbitMQBackgroundService : BackgroundService
    {
        private readonly RabbitMQConsumerService _consumerService;
        private readonly ILogger<RabbitMQBackgroundService> _logger;

        public RabbitMQBackgroundService(
            RabbitMQConsumerService consumerService,
            ILogger<RabbitMQBackgroundService> logger)
        {
            _consumerService = consumerService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("RabbitMQBackgroundService is starting.");

            try
            {
                //await _consumerService.StartConsumingAsync(stoppingToken);
                _logger.LogInformation("RabbitMQBackgroundService started consuming.");
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("RabbitMQBackgroundService is stopping due to cancellation.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in RabbitMQBackgroundService.");
            }
            finally
            {
                _logger.LogInformation("RabbitMQBackgroundService has stopped.");
            }
        }
    }
}
