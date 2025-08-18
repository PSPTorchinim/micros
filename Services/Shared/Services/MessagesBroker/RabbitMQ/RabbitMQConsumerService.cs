using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace Shared.Services.MessagesBroker.RabbitMQ
{
    public class RabbitMQConsumerService
    {
        private readonly ILogger<RabbitMQConsumerService> _logger;

        private IChannel Model
        {
            get
            {
                try
                {
                    _logger?.LogInformation("Creating RabbitMQ connection...");
                    var connection = new ConnectionFactory { Uri = new Uri(GetRabbitMQConnectionString) }.CreateConnectionAsync().Result;
                    _logger?.LogInformation("RabbitMQ connection created.");
                    return connection.CreateChannelAsync().Result;
                }
                catch (Exception ex)
                {
                    _logger?.LogError(ex, "Failed to create RabbitMQ connection or channel.");
                    throw;
                }
            }
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
                _logger?.LogInformation("Using RabbitMQ connection string.");
                return connStr;
            }
        }

        public RabbitMQConsumerService(ILogger<RabbitMQConsumerService> logger = null)
        {
            _logger = logger;
        }

        public async Task ReceiveMessageAsync<T>(Func<T, Task<bool>> action, string queueName)
        {
            try
            {
                _logger?.LogInformation("Declaring queue: {QueueName}", queueName);
                await Model.QueueDeclareAsync(queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
                var consumer = new AsyncEventingBasicConsumer(Model);
                consumer.ReceivedAsync += async (model, received) =>
                {
                    try
                    {
                        var body = received.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);
                        _logger?.LogInformation("Received message from queue {QueueName}: {Message}", queueName, message);
                        var converted = JsonConvert.DeserializeObject<T>(message);
                        var result = await action(converted);
                        _logger?.LogInformation("Message processed with result: {Result}", result);
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError(ex, "Error processing message from queue {QueueName}", queueName);
                    }
                };
                _logger?.LogInformation("Starting to consume queue: {QueueName}", queueName);
                await Model.BasicConsumeAsync(queue: queueName, autoAck: true, consumer: consumer);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error in ReceiveMessageAsync for queue {QueueName}", queueName);
                throw;
            }
        }
    }
}
