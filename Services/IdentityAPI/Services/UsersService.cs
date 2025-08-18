using AutoMapper;
using IdentityAPI.Data;
using IdentityAPI.Data.DTO.User;
using IdentityAPI.Data.Helpers;
using IdentityAPI.Data.Specifications;
using IdentityAPI.DTO.User;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Shared.Data.Exceptions;
using Shared.Helpers;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;

namespace IdentityAPI.Services
{
    public interface IUsersService : IService
    {
        Task<LoginResponseDTO?> Login(LoginUserRequestDTO loginUser);
        Task<bool> Register(RegisterUserRequestDTO registerUser);
        Task<LoginResponseDTO> RefreshToken();
        Task<bool> BlockUser(BlockUserDTO request);
        Task<bool> ChangePassword(ChangePasswordRequestDTO request);
        Task<bool> ForgotPassword(ForgotPasswordRequestDTO request);
        Task<bool> ActivateAccount(ActivateAccountRequestDTO request);
        Task<LoginResponseDTO> GetLoggedUserData();
    }

    public class UsersService : BaseService<IUsersService>, IUsersService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IAuthService _authService;

        public UsersService(ILogger<IUsersService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
            _authService = serviceProvider.GetRequiredService<IAuthService>();
        }

        public async Task<LoginResponseDTO?> Login(LoginUserRequestDTO loginUser)
        {
            _logger.LogInformation("Login attempt for user: {Email}", loginUser.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                var spec = new UserWithRolesAndPermissions(u => u.Email == loginUser.Email);
                var usersByEmail = await _usersRepository.Get(spec);
                usersByEmail = usersByEmail.ToList();
                if (usersByEmail.Count() != 1)
                {
                    _logger.LogWarning("Login failed: user not found or multiple users for email {Email}", loginUser.Email);
                    return null;
                }

                var matchingUser =
                    usersByEmail.Where(u => u.Passwords.GetLatest().Equals(loginUser.Password)).FirstOrDefault();
                if (matchingUser == null)
                {
                    _logger.LogWarning("Login failed: wrong password for user {Email}", loginUser.Email);
                    throw new AppException(ExceptionCodes.LoginWrongPassword);
                }

                if (matchingUser.Blocks.Any(x => !x.Deactivated && (x.To > DateTime.Now || x.Pernament)))
                {
                    _logger.LogWarning("Login failed: user {Email} is blocked", loginUser.Email);
                    throw new AppException(ExceptionCodes.LoginUserBlocked);
                }

                var result = _authService.GenerateAccessToken(matchingUser);

                if (result == null)
                {
                    _logger.LogError("Login failed: token generation failed for user {Email}", loginUser.Email);
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                matchingUser.RefreshToken = result.RefreshToken;
                matchingUser.Token = result.AccessToken;

                await _usersRepository.Update(matchingUser);

                result.User = _mapper.Map<GetUserDTO>(matchingUser);

                _logger.LogInformation("Login successful for user: {Email}", loginUser.Email);

                // var mailMessage = new RabbitMQResponse<LoginResponseDTO>(result);
                // await _rabbitMQProducerService.SendMessage(mailMessage, "SendMail");

                return result;
            }, _logger);
        }

        public async Task<bool> Register(RegisterUserRequestDTO registerUser)
        {
            _logger.LogInformation("Register attempt for user: {Email}", registerUser.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                var matchingEmail = await _usersRepository.Count(u => u.Email.Equals(registerUser.Email));
                if (matchingEmail > 0)
                {
                    _logger.LogWarning("Register failed: email already exists {Email}", registerUser.Email);
                    throw new AppException(ExceptionCodes.RegisterEmailFound);
                }

                var newUser = new User()
                {
                    Passwords = new List<Password>() {
                        new Password {
                            CreatedDate = DateTime.Now,
                            Value = registerUser.Password
                        }
                    },
                    Email = registerUser.Email,
                    ActivationCode = StringHelper.GenerateRandomPassword(5)
                };

                await _usersRepository.Add(newUser);

                _logger.LogInformation("User registered successfully: {Email}", registerUser.Email);

                ///send mail with activation code
                ///send RabbitMQ message that user is registered so the CompanyAPI can add this user to database

                return true;
            }, _logger);
        }

        public async Task<LoginResponseDTO> RefreshToken()
        {
            _logger.LogInformation("RefreshToken attempt");
            return await ExceptionHandler.Handle(async () =>
            {
                var token = GetTokenAsync();
                var userId = GetClaim("Id");
                var newToken = await _authService.RefreshTokenAsync(token, userId);
                if (newToken == null)
                {
                    _logger.LogError("RefreshToken failed: corrupted token");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                var matchingUser = (await _usersRepository.Get(x => x.Id.Equals(Guid.Parse(userId)))).FirstOrDefault();
                if (matchingUser == null)
                {
                    _logger.LogWarning("RefreshToken failed: user not found for id {UserId}", userId);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                var result = _authService.GenerateAccessToken(matchingUser);
                if (result == null)
                {
                    _logger.LogError("RefreshToken failed: token generation failed for user id {UserId}", userId);
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                result.User = _mapper.Map<GetUserDTO>(matchingUser);
                _logger.LogInformation("RefreshToken successful for user id: {UserId}", userId);
                return result;
            }, _logger);
        }

        public async Task<bool> BlockUser(BlockUserDTO request)
        {
            _logger.LogInformation("BlockUser attempt for user id: {UserId}", request.UserId);
            return await ExceptionHandler.Handle(async () =>
            {
                var user = (await _usersRepository.Get(u => u.Id.Equals(request.UserId))).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("BlockUser failed: user not found for id {UserId}", request.UserId);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                user.Blocks.Append(_mapper.Map<Block>(request));

                var result = await _usersRepository.Update(user);
                if (result)
                    _logger.LogInformation("User blocked successfully: {UserId}", request.UserId);
                else
                    _logger.LogError("BlockUser failed to update user: {UserId}", request.UserId);
                return result;
            }, _logger);
        }

        public async Task<bool> ChangePassword(ChangePasswordRequestDTO request)
        {
            _logger.LogInformation("ChangePassword attempt");
            return await ExceptionHandler.Handle(async () =>
            {
                var id = GetClaim("Id");
                if (id == null)
                {
                    _logger.LogError("ChangePassword failed: corrupted token");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                var user = (await _usersRepository.Get(u => u.Id.Equals(Guid.Parse(id)))).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("ChangePassword failed: user not found for id {UserId}", id);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                var password = user.Passwords.OrderByDescending(x => x.CreatedDate).First();
                if (!password.Value.ToLower().Equals(request.OldPassword.ToLower()))
                {
                    _logger.LogWarning("ChangePassword failed: wrong old password for user id {UserId}", id);
                    throw new AppException(ExceptionCodes.LoginWrongPassword);
                }

                var usedPassword = user.Passwords.FirstOrDefault(x => x.Value.ToLower().Equals(request.NewPassword.ToLower()));
                if (usedPassword != null)
                {
                    if (usedPassword.CreatedDate >= DateTime.Now.AddMonths(-6))
                    {
                        _logger.LogWarning("ChangePassword failed: password already used recently for user id {UserId}", id);
                        throw new AppException(ExceptionCodes.PasswordAlreadyUsed);
                    }
                    else
                    {
                        usedPassword.CreatedDate = DateTime.Now;
                    }
                }
                else
                {
                    var newPassword = new Password() { CreatedDate = DateTime.Now, Value = request.NewPassword };
                    user.Passwords.Append(newPassword);
                }
                var result = await _usersRepository.Update(user);
                if (result)
                    _logger.LogInformation("Password changed successfully for user id: {UserId}", id);
                else
                    _logger.LogError("ChangePassword failed to update user: {UserId}", id);
                return result;
            }, _logger);
        }

        public async Task<bool> ForgotPassword(ForgotPasswordRequestDTO request)
        {
            _logger.LogInformation("ForgotPassword attempt for email: {Email}", request.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                var foundByEmail = (await _usersRepository.Get(x => x.Email.ToLower().Equals(request.Email.ToLower()))).FirstOrDefault();
                if (foundByEmail == null)
                {
                    _logger.LogWarning("ForgotPassword failed: user not found for email {Email}", request.Email);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                foundByEmail.Passwords.Add(new Password
                {
                    CreatedDate = DateTime.Now,
                    Value = StringHelper.GenerateRandomPassword(10).computeHash(),
                    UserId = foundByEmail.Id
                });

                ///send mail about password change

                var result = await _usersRepository.Update(foundByEmail);
                if (result)
                    _logger.LogInformation("ForgotPassword: password reset for user {Email}", request.Email);
                else
                    _logger.LogError("ForgotPassword failed to update user: {Email}", request.Email);
                return result;
            }, _logger);
        }

        public async Task<bool> ActivateAccount(ActivateAccountRequestDTO request)
        {
            _logger.LogInformation("ActivateAccount attempt for email: {Email}", request.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                var user = (await _usersRepository.Get(x => x.Email.Compare(request.Email))).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("ActivateAccount failed: user not found for email {Email}", request.Email);
                    throw new AppException(ExceptionCodes.UserNotFound);
                }
                if (user.ActivationCode.ToLower().Equals(request.ActivationCode.ToLower()))
                {
                    _logger.LogWarning("ActivateAccount failed: wrong activation code for email {Email}", request.Email);
                    throw new AppException(ExceptionCodes.WrongActivationCode);
                }

                user.Activated = true;
                var result = await _usersRepository.Update(user);
                if (result)
                    _logger.LogInformation("Account activated for user: {Email}", request.Email);
                else
                    _logger.LogError("ActivateAccount failed to update user: {Email}", request.Email);
                return result;
            }, _logger);
        }

        public async Task<LoginResponseDTO> GetLoggedUserData()
        {
            _logger.LogInformation("GetLoggedUserData attempt");
            return await ExceptionHandler.Handle(async () =>
            {
                var token = GetTokenAsync();
                var userId = GetClaim("Id");
                var spec = new UserWithRolesAndPermissions(u => u.Id.ToString() == userId);
                var user = (await _usersRepository.Get(spec)).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("GetLoggedUserData failed: user not found for id {UserId}", userId);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }
                var tokenResponse = new LoginResponseDTO();
                tokenResponse.AccessToken = token;
                tokenResponse.RefreshToken = user.RefreshToken;
                tokenResponse.User = _mapper.Map<GetUserDTO>(user);
                _logger.LogInformation("GetLoggedUserData successful for user id: {UserId}", userId);
                return tokenResponse;
            }, _logger);
        }
    }
}
