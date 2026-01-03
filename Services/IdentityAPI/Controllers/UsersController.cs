using IdentityAPI.Data.DTO.User;
using IdentityAPI.DTO.User;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Data.Models;
using Shared.Helpers;
using Shared.Services.App;

namespace IdentityAPI.Controllers
{
    public class UsersController : BaseController<UsersController>
    {
        private readonly IUsersService _usersService;

        public UsersController(ILogger<UsersController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            _usersService = serviceProvider.GetRequiredService<IUsersService>();
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<LoginResponseDTO>))]
        public async Task<IActionResult> LoginV1(LoginUserRequestDTO loginUser)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("LoginV1 called for user {Email} at {Time}", loginUser?.Email, DateTime.UtcNow);
                try
                {
                    var result = await _usersService.Login(loginUser);
                    _logger.LogInformation("LoginV1 succeeded for user {Email} at {Time}", loginUser?.Email, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "LoginV1 failed for user {Email} at {Time}", loginUser?.Email, DateTime.UtcNow);
                    throw;
                }
            });
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Response<bool>))]
        public async Task<IActionResult> RegisterV1(RegisterUserRequestDTO register)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("RegisterV1 called for user {Username} at {Time}", StringHelper.SanitizeForLog(register?.Username), DateTime.UtcNow);
                try
                {
                    var result = await _usersService.Register(register);
                    _logger.LogInformation("RegisterV1 succeeded for user {Username} at {Time}", StringHelper.SanitizeForLog(register?.Username), DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "RegisterV1 failed for user {Username} at {Time}", StringHelper.SanitizeForLog(register?.Username), DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpGet("Me")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<LoginResponseDTO>))]
        public async Task<IActionResult> GetMeV1()
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("GetMeV1 called at {Time}", DateTime.UtcNow);
                try
                {
                    var result = await _usersService.GetLoggedUserData();
                    _logger.LogInformation("GetMeV1 succeeded at {Time}", DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "GetMeV1 failed at {Time}", DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpGet("RefreshToken")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<LoginResponseDTO>))]
        public async Task<IActionResult> RefreshTokenV1()
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("RefreshTokenV1 called at {Time}", DateTime.UtcNow);
                try
                {
                    var result = await _usersService.RefreshToken();
                    _logger.LogInformation("RefreshTokenV1 succeeded at {Time}", DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "RefreshTokenV1 failed at {Time}", DateTime.UtcNow);
                    throw;
                }
            });
        }

        [Authorize(Roles = "users:block")]
        [HttpPut("Block")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        public async Task<IActionResult> BlockUserV1(BlockUserDTO request)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("BlockUserV1 called for user {UserId} at {Time}", StringHelper.SanitizeForLog(request?.UserId.ToString()), DateTime.UtcNow);
                try
                {
                    var result = await _usersService.BlockUser(request);
                    _logger.LogInformation("BlockUserV1 succeeded for user {UserId} at {Time}", StringHelper.SanitizeForLog(request?.UserId.ToString()), DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "BlockUserV1 failed for user {UserId} at {Time}", StringHelper.SanitizeForLog(request?.UserId.ToString()), DateTime.UtcNow);
                    throw;
                }
            });
        }

        [HttpPut("ChangePassword")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        public async Task<IActionResult> ChangePasswordV1(ChangePasswordRequestDTO request)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("🔐 [API] ChangePasswordV1 endpoint called | Timestamp: {Time}", DateTime.UtcNow);
                try
                {
                    var result = await _usersService.ChangePassword(request);
                    _logger.LogInformation("✓ [API] ChangePasswordV1 completed successfully | Timestamp: {Time}", DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ [API] ChangePasswordV1 failed | Timestamp: {Time} | Exception: {ExceptionType}", 
                        DateTime.UtcNow, ex.GetType().Name);
                    throw;
                }
            });
        }

        [AllowAnonymous]
        [HttpPut("ForgotPassword")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        public async Task<IActionResult> ForgotPasswordV1(ForgotPasswordRequestDTO request)
        {
            return await Handle(async () =>
            { 
                _logger.LogInformation("🔐 [API] ForgotPasswordV1 endpoint called | Email: {Email} | Timestamp: {Time}", 
                    StringHelper.SanitizeForLog(request?.Email), DateTime.UtcNow);
                try
                {
                    var result = await _usersService.ForgotPassword(request);
                    _logger.LogInformation("✓ [API] ForgotPasswordV1 completed successfully | Email: {Email} | Timestamp: {Time}", 
                        StringHelper.SanitizeForLog(request?.Email), DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ [API] ForgotPasswordV1 failed | Email: {Email} | Timestamp: {Time} | Exception: {ExceptionType}", 
                        StringHelper.SanitizeForLog(request?.Email), DateTime.UtcNow, ex.GetType().Name);
                    throw;
                }
            });
        }

        [HttpPut("ActivateAccount")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<bool>))]
        public async Task<IActionResult> ActivateAccountV1(ActivateAccountRequestDTO request)
        {
            return await Handle(async () =>
            { 
                _logger.LogInformation("ActivateAccountV1 called for user {Email} at {Time}", StringHelper.SanitizeForLog(request?.Email), DateTime.UtcNow);
                try
                {
                    var result = await _usersService.ActivateAccount(request);
                    _logger.LogInformation("ActivateAccountV1 succeeded for user {Email} at {Time}", StringHelper.SanitizeForLog(request?.Email), DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "ActivateAccountV1 failed for user {Email} at {Time}", StringHelper.SanitizeForLog(request?.Email), DateTime.UtcNow);
                    throw;
                }
            });
        }

        [AllowAnonymous]
        [HttpPost("ValidateSecurityStamp")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Response<ValidateSecurityStampResponseDTO>))]
        public async Task<IActionResult> ValidateSecurityStampV1(ValidateSecurityStampRequestDTO request)
        {
            return await Handle(async () =>
            {
                _logger.LogInformation("🔐 [API] ValidateSecurityStampV1 endpoint called | UserId: {UserId} | Timestamp: {Time}", 
                    StringHelper.SanitizeForLog(request?.UserId.ToString() ?? string.Empty), DateTime.UtcNow);
                try
                {
                    var result = await _usersService.ValidateSecurityStamp(request);
                    _logger.LogInformation("✓ [API] ValidateSecurityStampV1 completed | UserId: {UserId} | IsValid: {IsValid} | Timestamp: {Time}", 
                        StringHelper.SanitizeForLog(request?.UserId.ToString() ?? string.Empty), result?.IsValid, DateTime.UtcNow);
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ [API] ValidateSecurityStampV1 failed | UserId: {UserId} | Timestamp: {Time} | Exception: {ExceptionType}", 
                        StringHelper.SanitizeForLog(request?.UserId.ToString() ?? string.Empty), DateTime.UtcNow, ex.GetType().Name);
                    throw;
                }
            });
        }
    }
}