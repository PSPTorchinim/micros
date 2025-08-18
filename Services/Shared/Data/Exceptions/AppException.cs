using System.Runtime.Serialization;

namespace Shared.Data.Exceptions
{
    public class AppException : Exception
    {
        public AppException() : base()
        {
        }

        public AppException(string? message) : base(message)
        {
        }

        public AppException(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        public AppException(SerializationInfo serializationEntries, StreamingContext context) : base(serializationEntries, context)
        {
        }
    }
}
