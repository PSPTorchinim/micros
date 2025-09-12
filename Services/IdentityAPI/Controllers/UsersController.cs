using IdentityAPI.Data.DTO.User;
using IdentityAPI.DTO.User;
using IdentityAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> LoginV1(LoginUserRequestDTO loginUser)
        {
            _logger.LogInformation("LoginV1 called for user {Email} at {Time}", loginUser?.Email, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _usersService.Login(loginUser));
                _logger.LogInformation("LoginV1 succeeded for user {Email} at {Time}", loginUser?.Email, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LoginV1 failed for user {Email} at {Time}", loginUser?.Email, DateTime.UtcNow);
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<IActionResult> RegisterV1(RegisterUserRequestDTO register)
        {
            _logger.LogInformation("RegisterV1 called for user {Username} at {Time}", register?.Username, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _usersService.Register(register));
                _logger.LogInformation("RegisterV1 succeeded for user {Username} at {Time}", register?.Username, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RegisterV1 failed for user {Username} at {Time}", register?.Username, DateTime.UtcNow);
                throw;
            }
        }

        [HttpGet("Me")]
        public async Task<IActionResult> GetMeV1()
        {
            _logger.LogInformation("GetMeV1 called at {Time}", DateTime.UtcNow);
            try
            {
                var result = await Handle(_usersService.GetLoggedUserData);
                _logger.LogInformation("GetMeV1 succeeded at {Time}", DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMeV1 failed at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        [HttpGet("RefreshToken")]
        public async Task<IActionResult> RefreshTokenV1()
        {
            _logger.LogInformation("RefreshTokenV1 called at {Time}", DateTime.UtcNow);
            try
            {
                var result = await Handle(_usersService.RefreshToken);
                _logger.LogInformation("RefreshTokenV1 succeeded at {Time}", DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RefreshTokenV1 failed at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        [Authorize(Roles = "users:block")]
        [HttpPut("Block")]
        public async Task<IActionResult> BlockUserV1(BlockUserDTO request)
        {
            _logger.LogInformation("BlockUserV1 called for user {UserId} at {Time}", request?.UserId, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _usersService.BlockUser(request));
                _logger.LogInformation("BlockUserV1 succeeded for user {UserId} at {Time}", request?.UserId, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "BlockUserV1 failed for user {UserId} at {Time}", request?.UserId, DateTime.UtcNow);
                throw;
            }
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePasswordV1(ChangePasswordRequestDTO request)
        {
            _logger.LogInformation("ChangePasswordV1 called for user at {Time}", DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _usersService.ChangePassword(request));
                _logger.LogInformation("ChangePasswordV1 succeeded for user at {Time}", DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ChangePasswordV1 failed for user at {Time}", DateTime.UtcNow);
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPut("ForgotPassword")]
        public async Task<IActionResult> ForgotPasswordV1(ForgotPasswordRequestDTO request)
        {
            _logger.LogInformation("ForgotPasswordV1 called for user {Email} at {Time}", request?.Email, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _usersService.ForgotPassword(request));
                _logger.LogInformation("ForgotPasswordV1 succeeded for user {Email} at {Time}", request?.Email, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ForgotPasswordV1 failed for user {Email} at {Time}", request?.Email, DateTime.UtcNow);
                throw;
            }
        }

        [HttpPut("ActivateAccount")]
        public async Task<IActionResult> ActivateAccountV1(ActivateAccountRequestDTO request)
        {
            _logger.LogInformation("ActivateAccountV1 called for user {Email} at {Time}", request?.Email, DateTime.UtcNow);
            try
            {
                var result = await Handle(async () => await _usersService.ActivateAccount(request));
                _logger.LogInformation("ActivateAccountV1 succeeded for user {Email} at {Time}", request?.Email, DateTime.UtcNow);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ActivateAccountV1 failed for user {Email} at {Time}", request?.Email, DateTime.UtcNow);
                throw;
            }
        }
    }
}