namespace Shared.Data.Models
{
    public class Response<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }
        public List<string> Errors { get; set; }

        public Response() { }

        public Response(T data, string message = null)
        {
            Success = true;
            Data = data;
            Message = message;
            Errors = null;
        }

        public Response(string message, List<string> errors)
        {
            Success = false;
            Data = default;
            Message = message;
            Errors = errors;
        }
    }
}