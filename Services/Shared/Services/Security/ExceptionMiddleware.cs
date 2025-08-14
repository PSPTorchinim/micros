using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Shared.Data.Models;
using System.Net;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        _logger.LogInformation("Handling request: {Method} {Path}", httpContext.Request.Method, httpContext.Request.Path);
        try
        {
            await _next(httpContext);
            _logger.LogInformation("Request handled successfully: {StatusCode}", httpContext.Response.StatusCode);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred while processing the request.");
            await HandleExceptionAsync(httpContext, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        _logger.LogError("Returning Internal Server Error response: {Message}", exception.Message);

        var response = new Response<string>("Internal Server Error", new List<string> { exception.Message });

        return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
    }
}