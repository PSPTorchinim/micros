using AutoMapper;
using IdentityAPI.DTO.User;
using IdentityAPI.Entities;
using IdentityAPI.Repositories;
using Microsoft.IdentityModel.Tokens;
using Shared.Data.Exceptions;
using Shared.Services.App;
using Shared.Services.MessagesBroker.RabbitMQ;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityAPI.Services
{
    public interface IAuthService : IService
    {
        LoginResponseDTO GenerateAccessToken(User user);
        Task<LoginResponseDTO> RefreshTokenAsync(string token, string userId);
        bool ValidateToken(string authToken, bool isInvited = false);
        string? GetUserIdFromTokenIgnoreExpiry(string authToken);
    }

    public class AuthService : BaseService<IAuthService>, IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUsersRepository _usersRepository;

        public AuthService(
            IConfiguration configuration,
            ILogger<IAuthService> logger,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor,
            RabbitMQProducerService rabbitMQProducerService,
            IServiceProvider serviceProvider
        ) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _configuration = configuration;
            _usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
        }

        // === KEY HANDLING =====================================================

        /// <summary>
        /// Returns the signing key bytes. Order of precedence:
        /// 1) ENV: JWT_KEY
        /// 2) config: TokenConfiguration:Key
        /// Accepts Base64, Hex, or raw UTF8 string. Enforces >= 32 bytes.
        /// </summary>
        private byte[] GetSigningKeyBytes()
        {
            var raw =
                Environment.GetEnvironmentVariable("ASPNETCORE_JWT_KEY")
                ?? _configuration["TokenConfiguration:Key"];

            if (string.IsNullOrWhiteSpace(raw))
            {
                _logger.LogCritical("JWT key is missing (ENV JWT_KEY or TokenConfiguration:Key).");
                throw new Exception("JWT key is missing.");
            }

            // Try Base64
            try
            {
                // quick heuristic for base64 (won't catch all, but safe to try)
                if ((raw.Length % 4 == 0) && raw.Any(c => c == '+' || c == '/' || c == '='))
                {
                    var b64 = Convert.FromBase64String(raw);
                    if (b64.Length >= 32) return b64;
                }
            }
            catch { /* ignore and continue */ }

            // Try Hex
            bool looksHex = raw.All(Uri.IsHexDigit) && raw.Length % 2 == 0;
            if (looksHex)
            {
                var bytes = new byte[raw.Length / 2];
                for (int i = 0; i < bytes.Length; i++)
                    bytes[i] = Convert.ToByte(raw.Substring(i * 2, 2), 16);

                if (bytes.Length >= 32) return bytes; // OK
                // else fall-through to UTF8
            }

            // Fallback: UTF8
            var utf8 = Encoding.UTF8.GetBytes(raw);
            if (utf8.Length < 32)
            {
                _logger.LogCritical("JWT key too short: {Length} bytes (< 32).", utf8.Length);
                throw new ArgumentOutOfRangeException(nameof(raw),
                    "JWT key must be at least 256 bits (32 bytes).");
            }

            return utf8;
        }

        private SymmetricSecurityKey GetSigningKey() => new SymmetricSecurityKey(GetSigningKeyBytes());

        // === CLAIMS ===========================================================

        private List<Claim> GenerateClaims(User user)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Generating claims for user with Id: {UserId}", user.Id);

                var claims = new List<Claim>
                {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Email", user.Email ?? string.Empty),
                    new Claim("SecurityStamp", user.SecurityStamp ?? string.Empty)
                };

                // Zakładam, że Permission ma właściwość Name (string)
                // Jeśli faktycznie to „permissions”, rozważ inny typ claimu (np. "perm").
                user.Roles
                    .SelectMany(r => r.Permissions)
                    .Where(p => p != null && !string.IsNullOrWhiteSpace(p.Name))
                    .DistinctBy(p => p.Name)
                    .ToList()
                    .ForEach(p => claims.Add(new Claim(ClaimTypes.Role, p.Name)));

                _logger.LogInformation("Generated {ClaimCount} claims for user with Id: {UserId}", claims.Count, user.Id);
                return claims;
            }, _logger);
        }

        // === TOKEN CREATION ===================================================

        private string GenerateToken(User user, bool isRefresh = false)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Generating {TokenType} token for user with Id: {UserId}",
                    isRefresh ? "refresh" : "access", user.Id);

                var signingKey = GetSigningKey();

                var issuer = _configuration.GetSection("TokenConfiguration").GetValue<string>("Issuer");
                var audience = _configuration.GetSection("TokenConfiguration").GetValue<string>("Audience");

                // UWAGA: poprawione mapowanie czasu – access vs refresh
                var accessSecs = _configuration.GetSection("TokenConfiguration").GetValue<long>("TokenExpireTime");
                var refreshSecs = _configuration.GetSection("TokenConfiguration").GetValue<long>("RefreshTokenExpireTime");
                var seconds = isRefresh ? refreshSecs : accessSecs;

                _logger.LogDebug("{TokenType} token expiration (seconds): {ExpireTime}",
                    isRefresh ? "Refresh" : "Access", seconds);

                var expires = DateTime.UtcNow.AddSeconds(seconds);
                var claims = GenerateClaims(user);

                try
                {
                    var token = new JwtSecurityToken(
                        issuer: issuer,
                        audience: audience,
                        expires: expires,
                        claims: claims,
                        signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                    );

                    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                    _logger.LogInformation("{TokenType} token generated for user with Id: {UserId}",
                        isRefresh ? "Refresh" : "Access", user.Id);

                    _logger.LogDebug("Signing key length: {KeyLen} bytes", GetSigningKeyBytes().Length);
                    return tokenString;
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failed to generate JWT token for user {UserId}", user.Id);
                    throw;
                }
            }, _logger);
        }

        public LoginResponseDTO GenerateAccessToken(User user)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Generating access and refresh tokens for user with Id: {UserId}", user.Id);
                var tokenResponse = new LoginResponseDTO
                {
                    AccessToken = GenerateToken(user, isRefresh: false),
                    RefreshToken = GenerateToken(user, isRefresh: true),
                    SecurityStamp = user.SecurityStamp ?? string.Empty
                };
                _logger.LogInformation("Tokens generated for user with Id: {UserId}", user.Id);
                return tokenResponse;
            }, _logger);
        }

        // === REFRESH FLOW =====================================================

        public async Task<LoginResponseDTO> RefreshTokenAsync(string token, string userId)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogInformation("Refreshing token for user with Id: {UserId}", userId);

                if (string.IsNullOrWhiteSpace(userId))
                {
                    _logger.LogWarning("UserId is null or empty during token refresh.");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                var user = (await _usersRepository.Get(x => x.Id.ToString().Equals(userId))).FirstOrDefault();
                if (user == null || string.IsNullOrWhiteSpace(user.RefreshToken) || !user.RefreshToken.Equals(token))
                {
                    _logger.LogWarning("Invalid refresh token or user not found for user with Id: {UserId}", userId);
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                _logger.LogInformation("Refresh token validated for user with Id: {UserId}", userId);
                return GenerateAccessToken(user);
            }, _logger);
        }

        // === VALIDATION =======================================================

        public bool ValidateToken(string authToken, bool isInvited = false)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Validating token.");

                var tokenHandler = new JwtSecurityTokenHandler();

                // Parametry walidacji – spójne z tym, co wkładamy do tokenu
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = GetSigningKey(),

                    ValidateIssuer = true,
                    ValidIssuer = _configuration["TokenConfiguration:Issuer"],

                    ValidateAudience = true,
                    ValidAudience = _configuration["TokenConfiguration:Audience"] ?? _configuration["TokenConfiguration:Audiences:0"],

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(2) // niewielki bufor na rozjazd zegarów
                };

                try
                {
                    tokenHandler.ValidateToken(authToken, parameters, out _);
                    _logger.LogInformation("Token validated successfully.");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Token validation failed.");
                    throw;
                }
            }, _logger);
        }

        public string? GetUserIdFromTokenIgnoreExpiry(string authToken)
        {
            try
            {
                _logger.LogDebug("Reading user ID from token (ignoring expiry).");

                var tokenHandler = new JwtSecurityTokenHandler();

                // Validate signature and issuer/audience but skip lifetime to support expired tokens
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = GetSigningKey(),

                    ValidateIssuer = true,
                    ValidIssuer = _configuration["TokenConfiguration:Issuer"],

                    ValidateAudience = true,
                    ValidAudience = _configuration["TokenConfiguration:Audience"] ?? _configuration["TokenConfiguration:Audiences:0"],

                    ValidateLifetime = false,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(authToken, parameters, out _);
                var userId = principal.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;

                _logger.LogDebug("Successfully read user ID from expired token.");
                return userId;
            }
            catch (SecurityTokenException ex)
            {
                _logger.LogWarning(ex, "GetUserIdFromTokenIgnoreExpiry failed due to invalid security token.");
                return null;
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "GetUserIdFromTokenIgnoreExpiry failed due to invalid token argument.");
                return null;
            }
        }
    }
}
