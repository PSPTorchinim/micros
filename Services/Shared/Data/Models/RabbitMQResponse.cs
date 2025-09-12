namespace Shared.Data.Models
{
    public class RabbitMQResponse<T> : Response<T> where T : class
    {

        public RabbitMQResponse() { }

        public RabbitMQResponse(T data, string message = null) : base(data, message)
        {
        }

        public RabbitMQResponse(string message, List<string> errors) : base(message, errors) { }
    }
}
