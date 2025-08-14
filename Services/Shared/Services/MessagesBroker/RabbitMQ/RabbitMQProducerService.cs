using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;

namespace Shared.Services.MessagesBroker.RabbitMQ
{
    public class RabbitMQProducerService
    {
        private readonly ILogger<RabbitMQProducerService> _logger;

        public RabbitMQProducerService(ILogger<RabbitMQProducerService> logger)
        {
            _logger = logger;
        }

        private string GetRabbitMQConnectionString
        {
            get
            {
                var host = Environment.GetEnvironmentVariable("RABBITMQ_HOST");
                var port = Environment.GetEnvironmentVariable("RABBITMQ_PORT");
                var user = Environment.GetEnvironmentVariable("RABBITMQ_USER");
                var password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD");
                var connStr = $"amqp://{user}:{password}@{host}:{port}";
                _logger.LogInformation("Using RabbitMQ connection string: {ConnectionString}", connStr);
                return connStr;
            }
        }

        private IChannel Model
        {
            get
            {
                try
                {
                    _logger.LogInformation("Creating RabbitMQ connection...");
                    var connection = new ConnectionFactory { Uri = new Uri(GetRabbitMQConnectionString) }.CreateConnectionAsync().Result;
                    _logger.LogInformation("RabbitMQ connection created.");
                    var channel = connection.CreateChannelAsync().Result;
                    _logger.LogInformation("RabbitMQ channel created.");
                    return channel;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to create RabbitMQ connection or channel.");
                    throw;
                }
            }
        }

        public async Task SendMessage<T>(T message, string queueName)
        {
            try
            {
                _logger.LogInformation("Declaring queue: {QueueName}", queueName);
                await Model.QueueDeclareAsync(queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
                var body = JsonConvert.SerializeObject(message);
                var bytes = Encoding.UTF8.GetBytes(body);
                _logger.LogInformation("Publishing message to queue: {QueueName}", queueName);
                await Model.BasicPublishAsync(exchange: "", routingKey: queueName, mandatory: true, body: bytes);
                _logger.LogInformation("Message published to queue: {QueueName}", queueName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send message to queue: {QueueName}", queueName);
                throw;
            }
            await Task.CompletedTask;
        }
    }
}