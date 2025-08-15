using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shared.Data.Exceptions;
using Shared.Data.Models;

namespace Shared.Services.App
{
    [EnableCors("cors")]
    [ApiVersion(1)]
    [ApiVersion(2)]
    [Route("api/v{v:apiVersion}/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BaseController<TController> : ControllerBase where TController : BaseController<TController>
    {
        public readonly ILogger<TController> _logger;
        public readonly IServiceProvider _serviceProvider;

        public BaseController(ILogger<TController> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        [HttpGet("Hello")]
        [AllowAnonymous]
        public async Task<IActionResult> Hello()
        {
            _logger.LogInformation("Hello endpoint called.");
            return await Handle<object>();
        }

        public async Task<IActionResult> Handle<T>(
            Func<Task<T>> action = null,
            Func<T, IActionResult> customResponse = null)
        {
            var response = new Response<T>(default);
            try
            {
                _logger.LogInformation("Handle<{Type}> called.", typeof(T).Name);

                if (action != null)
                {
                    _logger.LogDebug("Executing action in Handle<{Type}>.", typeof(T).Name);
                    var result = await ExceptionHandler.Handle(action, _logger);
                    if (result == null)
                    {
                        response.Success = false;
                        response.Message = "Not Found";
                        _logger.LogWarning("Handle<{Type}>: Result is null. Returning NotFound.", typeof(T).Name);
                        return NotFound(response);
                    }
                    response.Success = true;
                    response.Data = result;
                    _logger.LogInformation("Handle<{Type}>: Action executed successfully.", typeof(T).Name);

                    if (customResponse != null)
                        return customResponse(result);

                    return Ok(response);
                }
                else
                {
                    _logger.LogInformation("Handle<{Type}>: No action provided. Returning NoContent.", typeof(T).Name);
                    return NoContent();
                }
            }
            catch (AppException ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                _logger.LogWarning(ex, "AppException caught in Handle<{Type}>.", typeof(T).Name);
                return BadRequest(response);
            }
            catch (NotImplementedException ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                _logger.LogError(ex, "Unhandled exception in Handle<{Type}>.", typeof(T).Name);
                ExceptionHandler.LogException(ex, _logger);
                return StatusCode(StatusCodes.Status501NotImplemented, response);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                _logger.LogError(ex, "Unhandled exception in Handle<{Type}>.", typeof(T).Name);
                ExceptionHandler.LogException(ex, _logger);
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
        }
    }
}