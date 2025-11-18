using System.Diagnostics;
using System.Net;
using System.Net.Http;
using Xunit;

namespace Integration.Tests
{
    /// <summary>
    /// Tests for running the complete Docker Compose environment
    /// Note: These tests start the entire system and may take significant time
    /// </summary>
    [Trait("Category", "Integration")]
    [Trait("Speed", "VerySlow")]
    public class FullSystemTests : IDisposable
    {
        private readonly string _dockerComposeFile;
        private readonly string _dockerDirectory;
        private readonly HttpClient _httpClient;
        private static readonly string TestRunId = Guid.NewGuid().ToString("N").Substring(0, 8);
        private static readonly string ProjectName = $"micros-test-{TestRunId}";

        public FullSystemTests()
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var repoRoot = FindRepositoryRoot(currentDirectory);
            _dockerDirectory = Path.Combine(repoRoot, "Docker");
            _dockerComposeFile = Path.Combine(_dockerDirectory, "dj-panel-composer.yml");
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30)
            };
        }

        private string FindRepositoryRoot(string startPath)
        {
            var directory = new DirectoryInfo(startPath);
            while (directory != null)
            {
                if (File.Exists(Path.Combine(directory.FullName, "Micros.sln")))
                {
                    return directory.FullName;
                }
                directory = directory.Parent;
            }
            throw new InvalidOperationException("Could not find repository root");
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_CanStartAllInfrastructureServices()
        {
            // Arrange - Start infrastructure services first
            var infrastructureServices = new[]
            {
                "sqlserver",
                "mongodb_container",
                "redis",
                "rabbitmq",
                "strapi_db"
            };

            // Act - Start services
            var startResult = RunDockerComposeCommand(
                $"up -d {string.Join(" ", infrastructureServices)}", 
                timeoutMinutes: 10);

            // Assert
            Assert.True(startResult.ExitCode == 0,
                $"Should be able to start infrastructure services. Error: {startResult.Error}");

            // Wait for services to be healthy
            await Task.Delay(TimeSpan.FromSeconds(30));

            // Verify services are running
            var psResult = RunDockerComposeCommand("ps", timeoutMinutes: 1);
            Assert.True(psResult.ExitCode == 0, "Should be able to list running services");

            foreach (var service in infrastructureServices)
            {
                Assert.Contains(service, psResult.Output);
            }
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_CanStartAllBackendServices()
        {
            // Arrange
            var backendServices = new[]
            {
                "identity_be",
                "music_be",
                "gear_be",
                "documents_be",
                "brand_be",
                "party_be",
                "mailing_be"
            };

            // Act - Start all infrastructure first, then backends
            var infraResult = RunDockerComposeCommand(
                "up -d sqlserver mongodb_container redis rabbitmq strapi_db", 
                timeoutMinutes: 10);
            
            Assert.True(infraResult.ExitCode == 0, 
                "Infrastructure should start successfully");

            // Wait for infrastructure to be ready
            await Task.Delay(TimeSpan.FromSeconds(45));

            // Start backend services
            var backendResult = RunDockerComposeCommand(
                $"up -d {string.Join(" ", backendServices)}", 
                timeoutMinutes: 15);

            // Assert
            Assert.True(backendResult.ExitCode == 0,
                $"Should be able to start backend services. Error: {backendResult.Error}");

            // Wait for services to be healthy
            await Task.Delay(TimeSpan.FromSeconds(60));

            // Verify services are running
            var psResult = RunDockerComposeCommand("ps", timeoutMinutes: 1);
            foreach (var service in backendServices)
            {
                Assert.Contains(service, psResult.Output);
            }
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_APIGateway_IsHealthy()
        {
            // Arrange - Start the complete stack up to API Gateway
            var startResult = RunDockerComposeCommand(
                "up -d sqlserver mongodb_container redis rabbitmq strapi_db identity_be music_be gear_be documents_be brand_be party_be mailing_be apigateway",
                timeoutMinutes: 20);

            Assert.True(startResult.ExitCode == 0, 
                "Stack should start successfully");

            // Wait for everything to be ready
            await Task.Delay(TimeSpan.FromMinutes(2));

            // Act - Try to reach API Gateway
            var apiGatewayUrl = "http://localhost:3000/health";
            HttpResponseMessage? response = null;
            var maxRetries = 10;
            
            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    response = await _httpClient.GetAsync(apiGatewayUrl);
                    if (response.IsSuccessStatusCode)
                        break;
                }
                catch
                {
                    // Service may not be ready yet
                }
                
                await Task.Delay(TimeSpan.FromSeconds(10));
            }

            // Assert
            Assert.NotNull(response);
            Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound,
                $"API Gateway should be reachable at {apiGatewayUrl}. Status: {response?.StatusCode}");
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_AllServices_AreRunning()
        {
            // Arrange & Act - Start the complete system
            var startResult = RunDockerComposeCommand("up -d", timeoutMinutes: 30);

            // Assert
            Assert.True(startResult.ExitCode == 0,
                $"Should be able to start all services. Error: {startResult.Error}");

            // Wait for system to stabilize
            await Task.Delay(TimeSpan.FromMinutes(3));

            // Verify all containers are running
            var psResult = RunDockerComposeCommand("ps", timeoutMinutes: 1);
            Assert.True(psResult.ExitCode == 0, "Should be able to list services");

            // Check that we have expected number of services running
            var requiredServices = new[]
            {
                "sqlserver", "mongodb_container", "redis", "rabbitmq", "strapi_db",
                "identity_be", "music_be", "gear_be", "documents_be", "brand_be", 
                "party_be", "mailing_be", "apigateway", "strapi"
            };

            foreach (var service in requiredServices)
            {
                Assert.Contains(service, psResult.Output);
            }
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_CanStopAllServices()
        {
            // Arrange - Start services first
            RunDockerComposeCommand("up -d sqlserver redis", timeoutMinutes: 5);
            await Task.Delay(TimeSpan.FromSeconds(15));

            // Act - Stop all services
            var stopResult = RunDockerComposeCommand("down", timeoutMinutes: 5);

            // Assert
            Assert.True(stopResult.ExitCode == 0,
                $"Should be able to stop all services. Error: {stopResult.Error}");

            // Verify services are stopped
            var psResult = RunDockerComposeCommand("ps", timeoutMinutes: 1);
            Assert.True(psResult.ExitCode == 0, "Should be able to list services");
            
            // After down, ps should show no running containers for this project
            var lines = psResult.Output.Split('\n', StringSplitOptions.RemoveEmptyEntries);
            // Header line(s) may exist, but no service containers should be running
            Assert.True(lines.Length <= 2, "No services should be running after 'down' command");
        }

        [Fact]
        public void FullSystem_DockerComposeDown_Works()
        {
            // This is a safety test to ensure we can always clean up
            // Act
            var result = RunDockerComposeCommand("down -v --remove-orphans", timeoutMinutes: 5);

            // Assert - Should succeed or fail gracefully
            // Exit code 0 means success, but we're okay with it failing if nothing was running
            Assert.True(result.ExitCode == 0 || result.ExitCode == 1,
                $"Docker compose down should complete. Output: {result.Output}, Error: {result.Error}");
        }

        private (int ExitCode, string Output, string Error) RunDockerComposeCommand(
            string arguments,
            int timeoutMinutes = 5)
        {
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = $"compose -f \"{_dockerComposeFile}\" -p {ProjectName} {arguments}",
                    WorkingDirectory = _dockerDirectory,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();

            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();

            var completed = process.WaitForExit(timeoutMinutes * 60 * 1000);

            if (!completed)
            {
                try
                {
                    process.Kill();
                }
                catch { }
                return (-1, "", $"Process timed out after {timeoutMinutes} minutes");
            }

            var output = outputTask.Result;
            var error = errorTask.Result;

            return (process.ExitCode, output, error);
        }

        public void Dispose()
        {
            // Cleanup - Stop and remove any containers created during tests
            try
            {
                RunDockerComposeCommand("down -v --remove-orphans", timeoutMinutes: 5);
            }
            catch
            {
                // Best effort cleanup
            }

            _httpClient?.Dispose();
        }
    }
}
