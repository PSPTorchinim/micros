using System.Diagnostics;
using Xunit;

namespace Integration.Tests
{
    /// <summary>
    /// Tests for Docker Compose configuration validation and basic docker operations
    /// </summary>
    public class DockerComposeTests
    {
        private readonly string _dockerComposeFile;
        private readonly string _dockerDirectory;

        public DockerComposeTests()
        {
            // Get the repository root directory
            var currentDirectory = Directory.GetCurrentDirectory();
            var repoRoot = FindRepositoryRoot(currentDirectory);
            _dockerDirectory = Path.Combine(repoRoot, "Docker");
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

        [Fact]
        public void DockerComposeFile_Exists()
        {
            // Arrange & Act & Assert
            Assert.True(File.Exists(_dockerComposeFile), 
                $"Docker Compose file should exist at: {_dockerComposeFile}");
        }

        [Fact]
        public void DockerComposeFile_IsValidYaml()
        {
            // Arrange & Act
            var result = RunDockerComposeCommand("config --quiet");

            // Assert
            Assert.True(result.ExitCode == 0, 
                $"Docker Compose file should be valid YAML. Error: {result.Error}");
        }

        [Fact]
        public void DockerComposeFile_ContainsRequiredServices()
        {
            // Arrange
            var requiredServices = new[]
            {
                "sqlserver",
                "mongodb_container",
                "redis",
                "rabbitmq",
                "strapi_db",
                "identity_be",
                "music_be",
                "gear_be",
                "documents_be",
                "brand_be",
                "party_be",
                "mailing_be",
                "apigateway",
                "dj-panel",
                "strapi"
            };

            // Act
            var result = RunDockerComposeCommand("config --services");

            // Assert
            Assert.True(result.ExitCode == 0, "Should be able to list services");
            
            var services = result.Output.Split('\n', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToList();

            foreach (var requiredService in requiredServices)
            {
                Assert.Contains(requiredService, services);
            }
        }

        [Fact]
        public void DockerComposeFile_HasCorrectNetworkConfiguration()
        {
            // Arrange & Act
            var fileContent = File.ReadAllText(_dockerComposeFile);

            // Assert - Check for required networks
            var requiredNetworks = new[]
            {
                "mongo_net",
                "redis_net",
                "rabbitmq_net",
                "sql_net",
                "apigw_backends_net",
                "apigw_fe_net",
                "strapi",
                "logging_net",
                "public"
            };

            foreach (var network in requiredNetworks)
            {
                Assert.Contains(network, fileContent);
            }
        }

        [Fact]
        public void DockerComposeFile_HasCorrectVolumeConfiguration()
        {
            // Arrange & Act
            var fileContent = File.ReadAllText(_dockerComposeFile);

            // Assert - Check for required volumes
            var requiredVolumes = new[]
            {
                "mongo_data",
                "mssql_data",
                "pg_data",
                "rabbitmq_data",
                "redis_data",
                "strapi_app"
            };

            foreach (var volume in requiredVolumes)
            {
                Assert.Contains(volume, fileContent);
            }
        }

        [Fact]
        public void DockerEnvFile_Exists()
        {
            // Arrange
            var envFile = Path.Combine(_dockerDirectory, ".env");

            // Act & Assert
            Assert.True(File.Exists(envFile), 
                $".env file should exist at: {envFile}");
        }

        [Fact]
        public void DockerEnvFile_ContainsRequiredVariables()
        {
            // Arrange
            var envFile = Path.Combine(_dockerDirectory, ".env");
            var fileContent = File.ReadAllText(envFile);

            // Assert - Check for critical environment variables
            var requiredVariables = new[]
            {
                "DATABASE_HOST_MONGODB",
                "DATABASE_HOST_SQLSERVER",
                "REDIS_HOST",
                "RABBITMQ_HOST",
                "JWT_KEY",
                "SECURE_KEY",
                "IDENTITY_BE_ADDRESS",
                "MUSIC_BE_ADDRESS"
            };

            foreach (var variable in requiredVariables)
            {
                Assert.Contains(variable, fileContent);
            }
        }

        private (int ExitCode, string Output, string Error) RunDockerComposeCommand(string arguments)
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
            var output = process.StandardOutput.ReadToEnd();
            var error = process.StandardError.ReadToEnd();
            process.WaitForExit();

            return (process.ExitCode, output, error);
        }
    }
}
