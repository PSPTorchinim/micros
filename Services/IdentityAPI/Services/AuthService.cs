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
        Task<LoginResponseDTO> RefreshTokenAsync(string token, string UserId);
        bool ValidateToken(string authToken, bool isInvited = false);
    }

    public class AuthService : BaseService<IAuthService>, IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUsersRepository _usersRepository;

        public AuthService(IConfiguration configuration, ILogger<IAuthService> logger, IMapper mapper, IHttpContextAccessor httpContextAccessor, RabbitMQProducerService rabbitMQProducerService, IServiceProvider serviceProvider) : base(logger, mapper, httpContextAccessor, rabbitMQProducerService, serviceProvider)
        {
            _configuration = configuration;
            _usersRepository = serviceProvider.GetRequiredService<IUsersRepository>();
        }

        private List<Claim> GenerateClaims(User user)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Generating claims for user with Id: {UserId}", user.Id);
                List<Claim> claims = new List<Claim>
                {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Email", user.Email)
                };
                user.Roles.SelectMany(r => r.Permissions).DistinctBy(p => p.Name).ToList().ForEach(p =>
                {
                    claims.Add(new Claim(ClaimTypes.Role, p.ToString()));
                });
                _logger.LogInformation("Generated {ClaimCount} claims for user with Id: {UserId}", claims.Count, user.Id);
                return claims;
            }, _logger);
        }

        private string GenerateToken(User user, bool isRefresh = false)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Generating {TokenType} token for user with Id: {UserId}", isRefresh ? "refresh" : "access", user.Id);
                var key = Environment.GetEnvironmentVariable("ASPNETCORE_JWT_KEY");
                var issuer = _configuration.GetSection("TokenConfiguration").GetValue<string>("Issuer");
                var audience = _configuration.GetSection("TokenConfiguration").GetValue<string>("Audience");
                var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
                var time = isRefresh ? _configuration.GetSection("TokenConfiguration").GetValue<long>("TokenExpireTime") : _configuration.GetSection("TokenConfiguration").GetValue<long>("RefreshTokenExpireTime");
                var expires = DateTime.Now.AddSeconds(time);
                var claims = GenerateClaims(user);
                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    expires: expires,
                    claims: claims,
                    signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                _logger.LogInformation("{TokenType} token generated for user with Id: {UserId}", isRefresh ? "Refresh" : "Access", user.Id);
                return tokenString;
            }, _logger);
        }

        public LoginResponseDTO GenerateAccessToken(User user)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Generating access and refresh tokens for user with Id: {UserId}", user.Id);
                var tokenResponse = new LoginResponseDTO();
                tokenResponse.AccessToken = GenerateToken(user);
                tokenResponse.RefreshToken = GenerateToken(user, true);
                _logger.LogInformation("Tokens generated for user with Id: {UserId}", user.Id);
                return tokenResponse;
            }, _logger);
        }

        public async Task<LoginResponseDTO> RefreshTokenAsync(string token, string UserId)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                _logger.LogInformation("Refreshing token for user with Id: {UserId}", UserId);
                if (UserId == null)
                {
                    _logger.LogWarning("UserId is null during token refresh.");
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                var user = (await _usersRepository.Get(x => x.Id.ToString().Equals(UserId))).FirstOrDefault();
                if (user == null || user.RefreshToken == null || !user.RefreshToken.Equals(token))
                {
                    _logger.LogWarning("Invalid refresh token or user not found for user with Id: {UserId}", UserId);
                    throw new AppException(ExceptionCodes.CorruptedToken);
                }

                _logger.LogInformation("Refresh token validated for user with Id: {UserId}", UserId);
                return GenerateAccessToken(user);
            }, _logger);
        }

        public bool ValidateToken(string authToken, bool isInvited = false)
        {
            return ExceptionHandler.Handle(() =>
            {
                _logger.LogInformation("Validating token.");
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = _configuration.GetSection("TokenConfiguration").GetValue<string>("Key");
                var encodedKey = Encoding.ASCII.GetBytes(key);
                var time = _configuration.GetSection("TokenConfiguration").GetValue<long>("TokenExpiration");
                tokenHandler.ValidateToken(authToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(encodedKey),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.FromSeconds(time)
                }, out SecurityToken validatedToken);
                _logger.LogInformation("Token validated successfully.");
                return true;
            }, _logger);
        }
    }
}
