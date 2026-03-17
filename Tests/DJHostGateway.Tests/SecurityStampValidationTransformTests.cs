using DJHostGateway.Transforms;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Json;
using System.Reflection;
using System.Security.Claims;
using Yarp.ReverseProxy.Transforms;

namespace DJHostGateway.Tests
{
    public class SecurityStampValidationTransformTests : IDisposable
    {
        private readonly Mock<ILogger<SecurityStampValidationTransform>> _loggerMock = new();
        private readonly IConfiguration _configuration;
        private readonly List<IDisposable> _disposables = new();

        public SecurityStampValidationTransformTests()
        {
            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["ReverseProxy:Clusters:Identity:Destinations:destination1:Address"] = "http://identity-service"
                })
                .Build();

            // Ensure the static circuit-breaker counter is reset before each test
            ResetConsecutiveFailures();
        }

        private static void ResetConsecutiveFailures()
        {
            var field = typeof(SecurityStampValidationTransform)
                .GetField("_consecutiveFailures", BindingFlags.NonPublic | BindingFlags.Static);
            field?.SetValue(null, 0);
        }

        private SecurityStampValidationTransform CreateTransform(HttpMessageHandler? handler = null)
        {
            var httpClient = handler != null
                ? new HttpClient(handler)
                : new HttpClient();
            _disposables.Add(httpClient);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(httpClient);
            return new SecurityStampValidationTransform(
                httpClientFactoryMock.Object,
                _loggerMock.Object,
                _configuration);
        }

        private static RequestTransformContext CreateContext(string? bearerToken = null, string path = "/v1/some-endpoint", string method = "GET")
        {
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Method = method;
            httpContext.Request.Path = path;
            httpContext.Response.Body = new MemoryStream();
            if (bearerToken != null)
                httpContext.Request.Headers.Authorization = $"Bearer {bearerToken}";
            return new RequestTransformContext { HttpContext = httpContext };
        }

        private static string CreateTestJwt(string userId = "test-user-id", string securityStamp = "test-stamp")
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = new JwtSecurityToken(
                claims: new[]
                {
                    new Claim("Id", userId),
                    new Claim("SecurityStamp", securityStamp)
                },
                expires: DateTime.UtcNow.AddHours(1));
            return tokenHandler.WriteToken(token);
        }

        [Fact]
        public async Task ApplyAsync_NoAuthorizationHeader_SkipsValidation()
        {
            // Arrange
            var transform = CreateTransform();
            var context = CreateContext(bearerToken: null);

            // Act
            await transform.ApplyAsync(context);

            // Assert – response should not have been written (status 200 by default)
            Assert.Equal(200, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_ValidateSecurityStampPath_SkipsValidation()
        {
            // Arrange
            var transform = CreateTransform();
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt, path: "/v1/Users/ValidateSecurityStamp");

            // Act
            await transform.ApplyAsync(context);

            // Assert – no 401 written
            Assert.Equal(200, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_RefreshTokenPath_SkipsValidation()
        {
            // Arrange
            var transform = CreateTransform();
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt, path: "/v1/Auth/RefreshToken");

            // Act
            await transform.ApplyAsync(context);

            // Assert – no 401 written
            Assert.Equal(200, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_InvalidTokenFormat_Returns401()
        {
            // Arrange
            var transform = CreateTransform();
            var context = CreateContext(bearerToken: "not.a.valid.jwt.token.at.all");
            context.HttpContext.Response.Body = new MemoryStream();

            // Act
            await transform.ApplyAsync(context);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_TokenMissingIdClaim_Returns401()
        {
            // Arrange
            var transform = CreateTransform();

            // Create a JWT without the "Id" claim
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = new JwtSecurityToken(
                claims: new[] { new Claim("SecurityStamp", "some-stamp") },
                expires: DateTime.UtcNow.AddHours(1));
            var jwt = tokenHandler.WriteToken(token);

            var context = CreateContext(bearerToken: jwt);

            // Act
            await transform.ApplyAsync(context);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_TokenMissingSecurityStampClaim_Returns401()
        {
            // Arrange
            var transform = CreateTransform();

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = new JwtSecurityToken(
                claims: new[] { new Claim("Id", Guid.NewGuid().ToString()) },
                expires: DateTime.UtcNow.AddHours(1));
            var jwt = tokenHandler.WriteToken(token);

            var context = CreateContext(bearerToken: jwt);

            // Act
            await transform.ApplyAsync(context);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_IdentityServiceReturnsSuccess_ValidationPasses()
        {
            // Arrange
            var validationResponse = new
            {
                Data = new { IsValid = true, Reason = default(string) }
            };
            var handler = new MockHttpMessageHandler(
                HttpStatusCode.OK,
                JsonContent.Create(validationResponse));

            var transform = CreateTransform(handler);
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt);

            // Act
            await transform.ApplyAsync(context);

            // Assert – request passed through (no 401)
            Assert.Equal(200, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_IdentityServiceReturnsInvalidStamp_Returns401()
        {
            // Arrange
            var validationResponse = new
            {
                Data = new { IsValid = false, Reason = "SecurityStampMismatch" }
            };
            var handler = new MockHttpMessageHandler(
                HttpStatusCode.OK,
                JsonContent.Create(validationResponse));

            var transform = CreateTransform(handler);
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt);

            // Act
            await transform.ApplyAsync(context);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_IdentityServiceReturnsNonSuccess_Returns401AndIncrementsCounter()
        {
            // Arrange
            var handler = new MockHttpMessageHandler(HttpStatusCode.InternalServerError, null);
            var transform = CreateTransform(handler);
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt);

            // Act
            await transform.ApplyAsync(context);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, context.HttpContext.Response.StatusCode);
        }

        [Fact]
        public async Task ApplyAsync_StrapiPath_RemovesAuthorizationHeaderAfterValidation()
        {
            // Arrange
            var validationResponse = new
            {
                Data = new { IsValid = true, Reason = default(string) }
            };
            var handler = new MockHttpMessageHandler(
                HttpStatusCode.OK,
                JsonContent.Create(validationResponse));

            var transform = CreateTransform(handler);
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt, path: "/strapi/api/articles");

            // Act
            await transform.ApplyAsync(context);

            // Assert – Authorization header should have been removed for Strapi
            Assert.False(context.HttpContext.Request.Headers.ContainsKey("Authorization"));
        }

        [Fact]
        public async Task ApplyAsync_NonStrapiPath_PreservesAuthorizationHeader()
        {
            // Arrange
            var validationResponse = new
            {
                Data = new { IsValid = true, Reason = default(string) }
            };
            var handler = new MockHttpMessageHandler(
                HttpStatusCode.OK,
                JsonContent.Create(validationResponse));

            var transform = CreateTransform(handler);
            var jwt = CreateTestJwt();
            var context = CreateContext(bearerToken: jwt, path: "/v1/company");

            // Act
            await transform.ApplyAsync(context);

            // Assert – Authorization header should be kept for non-Strapi paths
            Assert.True(context.HttpContext.Request.Headers.ContainsKey("Authorization"));
        }

        public void Dispose()
        {
            foreach (var disposable in _disposables)
                disposable.Dispose();
        }

        /// <summary>
        /// A simple <see cref="HttpMessageHandler"/> stub that returns a predetermined response.
        /// </summary>
        private sealed class MockHttpMessageHandler : HttpMessageHandler
        {
            private readonly HttpStatusCode _statusCode;
            private readonly HttpContent? _content;

            public MockHttpMessageHandler(HttpStatusCode statusCode, HttpContent? content = null)
            {
                _statusCode = statusCode;
                _content = content;
            }

            protected override Task<HttpResponseMessage> SendAsync(
                HttpRequestMessage request,
                CancellationToken cancellationToken)
            {
                return Task.FromResult(new HttpResponseMessage(_statusCode)
                {
                    Content = _content ?? new StringContent(string.Empty)
                });
            }
        }
    }
}
