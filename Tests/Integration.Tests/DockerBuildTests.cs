using System.Diagnostics;
using Xunit;

namespace Integration.Tests
{
    /// <summary>
    /// Tests for Docker image building capabilities
    /// Note: These tests are marked as explicit/slow and may take several minutes to run
    /// </summary>
    [Trait("Category", "Integration")]
    [Trait("Speed", "Slow")]
    public class DockerBuildTests
    {
        private readonly string _dockerComposeFile;
        private readonly string _dockerDirectory;
        private readonly string _repoRoot;

        public DockerBuildTests()
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            _repoRoot = FindRepositoryRoot(currentDirectory);
            _dockerDirectory = Path.Combine(_repoRoot, "Docker");
            _dockerComposeFile = Path.Combine(_dockerDirectory, "dj-panel-composer.yml");
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

        [Fact(Skip = "Slow test - Only run when explicitly needed")]
        public void DockerImages_CanBuildInfrastructureServices()
        {
            // Arrange
            var infrastructureServices = new[]
            {
                "sqlserver",
                "mongodb_container",
                "redis",
                "rabbitmq",
                "strapi_db"
            };

            // Act & Assert
            foreach (var service in infrastructureServices)
            {
                var result = BuildService(service, timeoutMinutes: 10);
                Assert.True(result.Success,
                    $"Should be able to build {service}. Error: {result.Error}");
            }
        }

        [Fact(Skip = "Slow test - Only run when explicitly needed")]
        public void DockerImages_CanBuildBackendServices()
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

            // Act & Assert
            foreach (var service in backendServices)
            {
                var result = BuildService(service, timeoutMinutes: 15);
                Assert.True(result.Success,
                    $"Should be able to build {service}. Error: {result.Error}");
            }
        }

        [Fact(Skip = "Slow test - Only run when explicitly needed")]
        public void DockerImages_CanBuildAPIGateway()
        {
            // Act
            var result = BuildService("apigateway", timeoutMinutes: 15);

            // Assert
            Assert.True(result.Success,
                $"Should be able to build API Gateway. Error: {result.Error}");
        }

        [Fact(Skip = "Slow test - Only run when explicitly needed")]
        public void DockerImages_CanBuildFrontendServices()
        {
            // Arrange
            var frontendServices = new[]
            {
                "dj-panel",
                "strapi"
            };

            // Act & Assert
            foreach (var service in frontendServices)
            {
                var result = BuildService(service, timeoutMinutes: 20);
                Assert.True(result.Success,
                    $"Should be able to build {service}. Error: {result.Error}");
            }
        }

        [Fact(Skip = "Slow test - Only run when explicitly needed")]
        public void DockerImages_CanBuildAllServices()
        {
            // Act
            var result = RunDockerComposeCommand("build", timeoutMinutes: 60);

            // Assert
            Assert.True(result.ExitCode == 0,
                $"Should be able to build all services. Error: {result.Error}");
        }

        [Fact]
        public void DockerFiles_AllServiceDockerfilesExist()
        {
            // Arrange
            var expectedDockerfiles = new[]
            {
                "infra/mongodb.Dockerfile",
                "infra/postgres.Dockerfile",
                "infra/rabbitmq.Dockerfile",
                "infra/redis.Dockerfile",
                "infra/sqlserver.Dockerfile",
                "infra/strapi.Dockerfile",
                "services/dotnet.Dockerfile",
                "frontends/react.Dockerfile"
            };

            // Act & Assert
            foreach (var dockerfile in expectedDockerfiles)
            {
                var fullPath = Path.Combine(_dockerDirectory, dockerfile);
                Assert.True(File.Exists(fullPath),
                    $"Dockerfile should exist at: {fullPath}");
            }
        }

        private (bool Success, string Error) BuildService(string serviceName, int timeoutMinutes)
        {
            var result = RunDockerComposeCommand($"build {serviceName}", timeoutMinutes);
            return (result.ExitCode == 0, result.Error);
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
                    Arguments = $"compose -f \"{_dockerComposeFile}\" {arguments}",
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
                process.Kill();
                return (-1, "", $"Process timed out after {timeoutMinutes} minutes");
            }

            var output = outputTask.Result;
            var error = errorTask.Result;

            return (process.ExitCode, output, error);
        }
    }
}
