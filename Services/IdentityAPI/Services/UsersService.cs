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
        Task<ValidateSecurityStampResponseDTO> ValidateSecurityStamp(ValidateSecurityStampRequestDTO request);
    }

    public class UsersService : BaseService<IUsersService>, IUsersService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IAuthService _authService;
        private readonly ISecurityStampService _securityStampService;

        public UsersService(ILogger<IUsersService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
            _authService = serviceProvider.GetRequiredService<IAuthService>();
            _securityStampService = serviceProvider.GetRequiredService<ISecurityStampService>();
        }

        public async Task<LoginResponseDTO?> Login(LoginUserRequestDTO loginUser)
        {
            _logger.LogInformation("Login attempt for user: {Email}", loginUser.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Fetching user by email: {Email}", loginUser.Email);
                var spec = new UserWithRolesAndPermissions(u => u.Email == loginUser.Email);
                var usersByEmail = await _usersRepository.Get(spec);
                usersByEmail = usersByEmail.ToList();
                _logger.LogDebug("Found {Count} users for email: {Email}", usersByEmail.Count(), loginUser.Email);
                if (usersByEmail.Count() != 1)
                {
                    _logger.LogWarning("Login failed: user not found or multiple users for email {Email}", loginUser.Email);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
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

                _logger.LogDebug("Generating access token for user: {Email}", loginUser.Email);
                var result = _authService.GenerateAccessToken(matchingUser);

                if (result == null)
                {
                    _logger.LogError("Login failed: token generation failed for user {Email}", loginUser.Email);
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                matchingUser.RefreshToken = result.RefreshToken;
                matchingUser.Token = result.AccessToken;

                _logger.LogDebug("Updating user with new tokens: {Email}", loginUser.Email);
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
                _logger.LogDebug("Checking if email already exists: {Email}", registerUser.Email);
                var matchingEmail = await _usersRepository.Count(u => u.Email.Equals(registerUser.Email));
                if (matchingEmail > 0)
                {
                    _logger.LogWarning("Register failed: email already exists {Email}", registerUser.Email);
                    throw new AppException(ExceptionCodes.RegisterEmailFound);
                }

                _logger.LogDebug("Creating new user entity for: {Email}", registerUser.Email);
                var newUser = new User()
                {
                    Passwords = new List<Password>() {
                        new Password {
                            CreatedDate = DateTime.Now,
                            Value = registerUser.Password
                        }
                    },
                    Email = registerUser.Email,
                    ActivationCode = StringHelper.GenerateRandomPassword(5),
                    SecurityStamp = _securityStampService.GenerateSecurityStamp(),
                    LastPasswordChangeDate = DateTime.UtcNow
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
                _logger.LogDebug("Getting token and user id from context");
                var token = GetTokenAsync();
                var userId = GetClaim("Id");
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogError("RefreshToken failed: corrupted token (missing user id claim)");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }
                _logger.LogDebug("Refreshing token for user id: {UserId}", userId);
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

                _logger.LogDebug("Generating new access token for user id: {UserId}", userId);
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
                _logger.LogDebug("Fetching user for block by id: {UserId}", request.UserId);
                var user = (await _usersRepository.Get(u => u.Id.Equals(request.UserId))).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("BlockUser failed: user not found for id {UserId}", request.UserId);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                _logger.LogDebug("Appending block to user: {UserId}", request.UserId);
                user.Blocks.Add(_mapper.Map<Block>(request));

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
            _logger.LogInformation("🔐 [ChangePassword] Starting password change process");
            return await ExceptionHandler.Handle(async () =>
            {
                var id = GetClaim("Id");
                if (id == null)
                {
                    _logger.LogError("❌ [ChangePassword] FAILED - Corrupted token (no user ID claim)");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                _logger.LogInformation("👤 [ChangePassword] User authenticated | UserId: {UserId}", id);
                var user = (await _usersRepository.Get(u => u.Id.Equals(Guid.Parse(id)))).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("❌ [ChangePassword] FAILED - User not found | UserId: {UserId}", id);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                var password = user.Passwords.OrderByDescending(x => x.CreatedDate).First();
                if (!password.Value.ToLower().Equals(request.OldPassword.ToLower()))
                {
                    _logger.LogWarning("❌ [ChangePassword] FAILED - Incorrect old password | UserId: {UserId}", id);
                    throw new AppException(ExceptionCodes.LoginWrongPassword);
                }

                var usedPassword = user.Passwords.FirstOrDefault(x => x.Value.ToLower().Equals(request.NewPassword.ToLower()));
                if (usedPassword != null)
                {
                    if (usedPassword.CreatedDate >= DateTime.Now.AddMonths(-6))
                    {
                        _logger.LogWarning("❌ [ChangePassword] FAILED - Password used recently (within 6 months) | UserId: {UserId} | LastUsed: {LastUsed}", 
                            id, usedPassword.CreatedDate.ToString("yyyy-MM-dd"));
                        throw new AppException(ExceptionCodes.PasswordAlreadyUsed);
                    }
                    else
                    {
                        _logger.LogDebug("📝 [ChangePassword] Updating creation date for reused password | UserId: {UserId}", id);
                        usedPassword.CreatedDate = DateTime.Now;
                    }
                }
                else
                {
                    _logger.LogDebug("➕ [ChangePassword] Adding new password to history | UserId: {UserId}", id);
                    var newPassword = new Password() { CreatedDate = DateTime.Now, Value = request.NewPassword };
                    user.Passwords.Add(newPassword);
                }
                
                // Regenerate security stamp and update last password change date
                var oldStamp = user.SecurityStamp;
                user.SecurityStamp = _securityStampService.GenerateSecurityStamp();
                user.LastPasswordChangeDate = DateTime.UtcNow;
                
                _logger.LogInformation("🔑 [ChangePassword] Security stamp regenerated | UserId: {UserId} | OldStamp: {OldStamp} | NewStamp: {NewStamp} | PasswordChangeDate: {ChangeDate}", 
                    id, oldStamp, user.SecurityStamp, user.LastPasswordChangeDate.Value.ToString("yyyy-MM-dd HH:mm:ss"));
                
                var result = await _usersRepository.Update(user);
                if (result)
                {
                    _logger.LogInformation("✓ [ChangePassword] SUCCESS - Password updated in database | UserId: {UserId}", id);
                    // Invalidate cache to force logout on other devices
                    await _securityStampService.InvalidateUserSecurityCacheAsync(user.Id);
                    _logger.LogInformation("🚪 [ChangePassword] User will be logged out from all other devices | UserId: {UserId}", id);
                }
                else
                    _logger.LogError("❌ [ChangePassword] FAILED - Database update failed | UserId: {UserId}", id);
                return result;
            }, _logger);
        }

        public async Task<bool> ForgotPassword(ForgotPasswordRequestDTO request)
        {
            _logger.LogInformation("🔐 [ForgotPassword] Password reset requested | Email: {Email}", request.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("🔍 [ForgotPassword] Looking up user by email | Email: {Email}", request.Email);
                var foundByEmail = (await _usersRepository.Get(x => x.Email.ToLower().Equals(request.Email.ToLower()))).FirstOrDefault();
                if (foundByEmail == null)
                {
                    _logger.LogWarning("❌ [ForgotPassword] FAILED - User not found | Email: {Email}", request.Email);
                    throw new AppException(ExceptionCodes.LoginUsernameNotFound);
                }

                var newPassword = StringHelper.GenerateRandomPassword(10).computeHash();
                _logger.LogInformation("🔑 [ForgotPassword] Generating new random password | Email: {Email} | UserId: {UserId}", 
                    request.Email, foundByEmail.Id);
                    
                foundByEmail.Passwords.Add(new Password
                {
                    CreatedDate = DateTime.Now,
                    Value = newPassword,
                    UserId = foundByEmail.Id
                });

                // Regenerate security stamp and update last password change date
                var oldStamp = foundByEmail.SecurityStamp;
                foundByEmail.SecurityStamp = _securityStampService.GenerateSecurityStamp();
                foundByEmail.LastPasswordChangeDate = DateTime.UtcNow;

                _logger.LogInformation("🔑 [ForgotPassword] Security stamp regenerated | Email: {Email} | UserId: {UserId} | OldStamp: {OldStamp} | NewStamp: {NewStamp}", 
                    request.Email, foundByEmail.Id, oldStamp, foundByEmail.SecurityStamp);

                ///send mail about password change

                var result = await _usersRepository.Update(foundByEmail);
                if (result)
                {
                    _logger.LogInformation("✓ [ForgotPassword] SUCCESS - Password reset | Email: {Email} | UserId: {UserId}", 
                        request.Email, foundByEmail.Id);
                    // Invalidate cache to force logout on all devices
                    await _securityStampService.InvalidateUserSecurityCacheAsync(foundByEmail.Id);
                    _logger.LogInformation("🚪 [ForgotPassword] User will be logged out from all devices | Email: {Email} | UserId: {UserId}", 
                        request.Email, foundByEmail.Id);
                }
                else
                    _logger.LogError("❌ [ForgotPassword] FAILED - Database update failed | Email: {Email}", request.Email);
                return result;
            }, _logger);
        }

        public async Task<bool> ActivateAccount(ActivateAccountRequestDTO request)
        {
            _logger.LogInformation("ActivateAccount attempt for email: {Email}", request.Email);
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogDebug("Fetching user for activation by email: {Email}", request.Email);
                var user = (await _usersRepository.Get(x => x.Email.Compare(request.Email))).FirstOrDefault();
                if (user == null)
                {
                    _logger.LogWarning("ActivateAccount failed: user not found for email {Email}", request.Email);
                    throw new AppException(ExceptionCodes.UserNotFound);
                }

                if (!user.ActivationCode.ToLower().Equals(request.ActivationCode.ToLower()))
                {
                    _logger.LogWarning("ActivateAccount failed: wrong activation code for email {Email}", request.Email);
                    throw new AppException(ExceptionCodes.WrongActivationCode);
                }

                _logger.LogDebug("Activating user account for email: {Email}", request.Email);
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
                _logger.LogDebug("Getting token and user id from context");
                var token = GetTokenAsync();
                var userId = GetClaim("Id");
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogError("GetLoggedUserData failed: corrupted token (missing user id claim)");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }
                _logger.LogDebug("Fetching user with roles and permissions for id: {UserId}", userId);
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

        public async Task<ValidateSecurityStampResponseDTO> ValidateSecurityStamp(ValidateSecurityStampRequestDTO request)
        {
            _logger.LogInformation("🔐 [ValidateSecurityStamp] Validation request received | UserId: {UserId} | ProvidedStamp: {ProvidedStamp}", 
                request.UserId, request.SecurityStamp);
            return await ExceptionHandler.Handle(async () =>
            {
                if (string.IsNullOrWhiteSpace(request.SecurityStamp))
                {
                    _logger.LogWarning("❌ [ValidateSecurityStamp] INVALID - Empty security stamp | UserId: {UserId}", request.UserId);
                    return new ValidateSecurityStampResponseDTO
                    {
                        IsValid = false,
                        Reason = "Invalid security stamp: stamp is empty"
                    };
                }

                _logger.LogDebug("🔍 [ValidateSecurityStamp] Fetching cached security data | UserId: {UserId}", request.UserId);
                var cachedData = await _securityStampService.GetUserSecurityDataAsync(request.UserId);
                
                if (cachedData == null)
                {
                    _logger.LogWarning("❌ [ValidateSecurityStamp] INVALID - User not found | UserId: {UserId}", request.UserId);
                    return new ValidateSecurityStampResponseDTO
                    {
                        IsValid = false,
                        Reason = "User not found"
                    };
                }

                _logger.LogDebug("📋 [ValidateSecurityStamp] Comparing stamps | UserId: {UserId} | ProvidedStamp: {ProvidedStamp} | CurrentStamp: {CurrentStamp} | LastPasswordChange: {LastPasswordChange}", 
                    request.UserId, request.SecurityStamp, cachedData.SecurityStamp, 
                    cachedData.LastPasswordChangeDate?.ToString("yyyy-MM-dd HH:mm:ss") ?? "null");

                if (string.IsNullOrWhiteSpace(cachedData.SecurityStamp))
                {
                    _logger.LogWarning("❌ [ValidateSecurityStamp] INVALID - User has no security stamp initialized | UserId: {UserId}", request.UserId);
                    return new ValidateSecurityStampResponseDTO
                    {
                        IsValid = false,
                        Reason = "User security stamp not initialized"
                    };
                }

                if (!cachedData.SecurityStamp.Equals(request.SecurityStamp, StringComparison.Ordinal))
                {
                    _logger.LogWarning("❌ [ValidateSecurityStamp] MISMATCH - Stamps don't match (password was changed) | UserId: {UserId} | ProvidedStamp: {ProvidedStamp} | CurrentStamp: {CurrentStamp} | LastPasswordChange: {LastPasswordChange}", 
                        request.UserId, request.SecurityStamp, cachedData.SecurityStamp, 
                        cachedData.LastPasswordChangeDate?.ToString("yyyy-MM-dd HH:mm:ss") ?? "unknown");
                    return new ValidateSecurityStampResponseDTO
                    {
                        IsValid = false,
                        Reason = "Security stamp mismatch - password was changed"
                    };
                }

                _logger.LogInformation("✓ [ValidateSecurityStamp] VALID - Stamps match | UserId: {UserId}", request.UserId);
                return new ValidateSecurityStampResponseDTO
                {
                    IsValid = true
                };
            }, _logger);
        }
    }
}
