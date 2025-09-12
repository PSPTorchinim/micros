using Shared.Data.Models;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace MailingAPI.BackgroundServices
{
    public class MailingBackgroundService : BackgroundService
    {
        private readonly RabbitMQConsumerService rabbitMQConsumerService;
        private readonly ILogger<MailingBackgroundService> logger;

        public MailingBackgroundService(IServiceProvider serviceProvider)
        {
            rabbitMQConsumerService = serviceProvider.GetRequiredService<RabbitMQConsumerService>();
            logger = serviceProvider.GetRequiredService<ILogger<MailingBackgroundService>>();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                ///logger.LogInformation("Running Mailing Background Service");
                ///receive message with mail from RabbitMQ
                await rabbitMQConsumerService.ReceiveMessageAsync<RabbitMQResponse<MailMessage>>(SendMail, "SendMail");

                await Task.Delay(1000, stoppingToken);
            }
        }

        private async Task<bool> SendMail(RabbitMQResponse<MailMessage> t)
        {
            logger.LogInformation("Ran SendMail");
            return true;
        }
    }
}
