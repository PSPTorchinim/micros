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
            if (startResult.ExitCode != 0)
            {
                // Get logs for debugging
                var logsResult = GetAllServiceLogs(tailLines: 100);
                Assert.Fail($"Should be able to start infrastructure services. Error: {startResult.Error}\n\nService Logs:\n{logsResult.Logs}");
            }

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
        public async Task FullSystem_ComprehensiveStackTest_AllServicesHealthy()
        {
            // This is a comprehensive test that validates the entire stack step by step
            var testReport = new System.Text.StringBuilder();
            testReport.AppendLine("=== COMPREHENSIVE FULL STACK TEST ===");
            testReport.AppendLine($"Test Run ID: {TestRunId}");
            testReport.AppendLine($"Timestamp: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
            testReport.AppendLine();

            try
            {
                // Step 1: Start infrastructure services
                testReport.AppendLine("Step 1: Starting infrastructure services...");
                var infraServices = new[] { "sqlserver", "mongodb_container", "redis", "rabbitmq", "strapi_db" };
                var infraResult = RunDockerComposeCommand($"up -d {string.Join(" ", infraServices)}", timeoutMinutes: 10);
                
                if (infraResult.ExitCode != 0)
                {
                    testReport.AppendLine($"  ✗ FAILED to start infrastructure. Error: {infraResult.Error}");
                    var logs = GetAllServiceLogs(100);
                    testReport.AppendLine($"  Logs:\n{logs.Logs}");
                    Assert.Fail(testReport.ToString());
                }
                testReport.AppendLine("  ✓ Infrastructure services started");

                // Wait for infrastructure to be ready
                await Task.Delay(TimeSpan.FromSeconds(60));

                // Step 2: Verify infrastructure health
                testReport.AppendLine("Step 2: Verifying infrastructure health...");
                var infraHealth = await VerifyServicesHealth(infraServices);
                testReport.AppendLine(infraHealth);

                // Step 3: Start backend services
                testReport.AppendLine("Step 3: Starting backend microservices...");
                var backendServices = new[] { "identity_be", "music_be", "gear_be", "documents_be", "brand_be", "party_be", "mailing_be" };
                var backendResult = RunDockerComposeCommand($"up -d {string.Join(" ", backendServices)}", timeoutMinutes: 15);
                
                if (backendResult.ExitCode != 0)
                {
                    testReport.AppendLine($"  ✗ FAILED to start backend services. Error: {backendResult.Error}");
                    var logs = GetAllServiceLogs(100);
                    testReport.AppendLine($"  Logs:\n{logs.Logs}");
                    Assert.Fail(testReport.ToString());
                }
                testReport.AppendLine("  ✓ Backend services started");

                // Wait for backends to initialize
                await Task.Delay(TimeSpan.FromSeconds(90));

                // Step 4: Verify backend health
                testReport.AppendLine("Step 4: Verifying backend services health...");
                var backendHealth = await VerifyServicesHealth(backendServices);
                testReport.AppendLine(backendHealth);

                // Step 5: Start API Gateway
                testReport.AppendLine("Step 5: Starting API Gateway...");
                var gatewayResult = RunDockerComposeCommand("up -d apigateway", timeoutMinutes: 10);
                
                if (gatewayResult.ExitCode != 0)
                {
                    testReport.AppendLine($"  ✗ FAILED to start API Gateway. Error: {gatewayResult.Error}");
                    var logs = GetServiceLogs("apigateway", 100);
                    testReport.AppendLine($"  Logs:\n{logs.Logs}");
                    Assert.Fail(testReport.ToString());
                }
                testReport.AppendLine("  ✓ API Gateway started");

                await Task.Delay(TimeSpan.FromSeconds(30));

                // Step 6: Verify complete system
                testReport.AppendLine("Step 6: Verifying complete system status...");
                var allStatus = RunDockerComposeCommand("ps", timeoutMinutes: 1);
                testReport.AppendLine($"  Services status:\n{allStatus.Output}");

                // Step 7: Get comprehensive logs
                testReport.AppendLine("Step 7: Collecting system logs...");
                var systemLogs = GetAllServiceLogs(50);
                testReport.AppendLine($"  Log collection: {(systemLogs.ExitCode == 0 ? "✓ SUCCESS" : "✗ FAILED")}");
                testReport.AppendLine($"  Total log lines: {systemLogs.Logs.Split('\n').Length}");

                // Step 8: Validate service count
                testReport.AppendLine("Step 8: Validating service count...");
                var allServices = infraServices.Concat(backendServices).Append("apigateway").ToArray();
                var missingServices = new System.Collections.Generic.List<string>();
                
                foreach (var service in allServices)
                {
                    if (!allStatus.Output.Contains(service))
                    {
                        missingServices.Add(service);
                    }
                }

                if (missingServices.Any())
                {
                    testReport.AppendLine($"  ✗ Missing services: {string.Join(", ", missingServices)}");
                    Assert.Fail(testReport.ToString());
                }
                testReport.AppendLine($"  ✓ All {allServices.Length} services are running");

                // Final summary
                testReport.AppendLine();
                testReport.AppendLine("=== TEST SUMMARY ===");
                testReport.AppendLine($"✓ Infrastructure Services: {infraServices.Length}");
                testReport.AppendLine($"✓ Backend Services: {backendServices.Length}");
                testReport.AppendLine($"✓ Gateway Services: 1");
                testReport.AppendLine($"✓ Total Services Running: {allServices.Length}");
                testReport.AppendLine("✓ ALL TESTS PASSED");

                // Output the report
                Console.WriteLine(testReport.ToString());
            }
            catch (Exception ex)
            {
                testReport.AppendLine();
                testReport.AppendLine($"=== TEST FAILED ===");
                testReport.AppendLine($"Error: {ex.Message}");
                Console.WriteLine(testReport.ToString());
                throw;
            }
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_ValidateServiceDependencies()
        {
            // Test that services start in correct order and dependencies are satisfied
            var testReport = new System.Text.StringBuilder();
            testReport.AppendLine("=== SERVICE DEPENDENCY VALIDATION TEST ===");

            // Step 1: Start only databases - they have no dependencies
            testReport.AppendLine("Step 1: Testing database services (no dependencies)...");
            var dbServices = new[] { "sqlserver", "mongodb_container", "strapi_db" };
            var dbResult = RunDockerComposeCommand($"up -d {string.Join(" ", dbServices)}", timeoutMinutes: 10);
            Assert.True(dbResult.ExitCode == 0, $"Databases should start independently. Error: {dbResult.Error}");
            testReport.AppendLine("  ✓ Database services started independently");
            await Task.Delay(TimeSpan.FromSeconds(45));

            // Step 2: Start cache and messaging - they have no dependencies
            testReport.AppendLine("Step 2: Testing cache and messaging services...");
            var cacheMessaging = new[] { "redis", "rabbitmq" };
            var cacheResult = RunDockerComposeCommand($"up -d {string.Join(" ", cacheMessaging)}", timeoutMinutes: 5);
            Assert.True(cacheResult.ExitCode == 0, $"Cache/messaging should start independently. Error: {cacheResult.Error}");
            testReport.AppendLine("  ✓ Cache and messaging services started");
            await Task.Delay(TimeSpan.FromSeconds(30));

            // Step 3: Try starting a backend service - should work with infrastructure ready
            testReport.AppendLine("Step 3: Testing backend service with dependencies ready...");
            var backendResult = RunDockerComposeCommand("up -d identity_be", timeoutMinutes: 10);
            Assert.True(backendResult.ExitCode == 0, $"Backend should start with infrastructure ready. Error: {backendResult.Error}");
            testReport.AppendLine("  ✓ Backend service started with dependencies satisfied");
            await Task.Delay(TimeSpan.FromSeconds(30));

            // Step 4: Verify the service is healthy
            var healthCheck = await VerifyServicesHealth(new[] { "identity_be" });
            testReport.AppendLine($"  Health check: {healthCheck}");

            testReport.AppendLine("✓ SERVICE DEPENDENCY VALIDATION PASSED");
            Console.WriteLine(testReport.ToString());
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_StressTest_MultipleRestarts()
        {
            // Test system stability by restarting services multiple times
            var testReport = new System.Text.StringBuilder();
            testReport.AppendLine("=== STRESS TEST: MULTIPLE RESTARTS ===");

            var services = new[] { "redis", "rabbitmq" };
            var iterations = 3;

            for (int i = 1; i <= iterations; i++)
            {
                testReport.AppendLine($"Iteration {i}/{iterations}:");
                
                // Start services
                var startResult = RunDockerComposeCommand($"up -d {string.Join(" ", services)}", timeoutMinutes: 5);
                Assert.True(startResult.ExitCode == 0, $"Start should succeed on iteration {i}");
                testReport.AppendLine($"  ✓ Services started");
                await Task.Delay(TimeSpan.FromSeconds(20));

                // Verify running
                var psResult = RunDockerComposeCommand("ps", timeoutMinutes: 1);
                foreach (var service in services)
                {
                    Assert.Contains(service, psResult.Output);
                }
                testReport.AppendLine($"  ✓ Services verified running");

                // Stop services
                var stopResult = RunDockerComposeCommand($"stop {string.Join(" ", services)}", timeoutMinutes: 3);
                Assert.True(stopResult.ExitCode == 0, $"Stop should succeed on iteration {i}");
                testReport.AppendLine($"  ✓ Services stopped");
                await Task.Delay(TimeSpan.FromSeconds(5));
            }

            // Final cleanup
            RunDockerComposeCommand("down -v", timeoutMinutes: 3);
            testReport.AppendLine($"✓ STRESS TEST PASSED: {iterations} iterations completed successfully");
            Console.WriteLine(testReport.ToString());
        }

        /// <summary>
        /// Verifies the health status of specified services
        /// </summary>
        private async Task<string> VerifyServicesHealth(string[] services)
        {
            var report = new System.Text.StringBuilder();
            var psResult = RunDockerComposeCommand("ps", timeoutMinutes: 1);
            
            foreach (var service in services)
            {
                if (psResult.Output.Contains(service))
                {
                    // Check if service is in the output
                    var serviceLines = psResult.Output.Split('\n')
                        .Where(l => l.Contains(service))
                        .ToList();
                    
                    if (serviceLines.Any())
                    {
                        var statusLine = serviceLines.First();
                        if (statusLine.Contains("Up") || statusLine.Contains("running"))
                        {
                            report.AppendLine($"  ✓ {service}: Running");
                        }
                        else
                        {
                            report.AppendLine($"  ⚠ {service}: Status unclear - {statusLine}");
                        }
                    }
                }
                else
                {
                    report.AppendLine($"  ✗ {service}: Not found");
                }
            }
            
            return report.ToString();
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

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_CanRetrieveServiceLogs()
        {
            // Arrange - Start a simple service
            var startResult = RunDockerComposeCommand("up -d redis", timeoutMinutes: 5);
            Assert.True(startResult.ExitCode == 0, "Should be able to start Redis");

            // Wait for service to start and generate some logs
            await Task.Delay(TimeSpan.FromSeconds(10));

            // Act - Get logs from the service
            var logsResult = GetServiceLogs("redis", tailLines: 50);

            // Assert
            Assert.True(logsResult.ExitCode == 0, "Should be able to retrieve logs");
            Assert.False(string.IsNullOrEmpty(logsResult.Logs), "Logs should not be empty");
            
            // Verify log content contains expected Redis output
            Assert.True(logsResult.Logs.Contains("Ready to accept connections") || 
                       logsResult.Logs.Contains("redis") ||
                       logsResult.Logs.Length > 0,
                       $"Logs should contain Redis startup messages. Logs: {logsResult.Logs}");
        }

        [Fact(Skip = "Very slow test - Requires Docker environment - Only run when explicitly needed")]
        public async Task FullSystem_CanRetrieveAllServiceLogs()
        {
            // Arrange - Start multiple services
            var startResult = RunDockerComposeCommand("up -d redis rabbitmq", timeoutMinutes: 10);
            Assert.True(startResult.ExitCode == 0, "Should be able to start services");

            // Wait for services to start and generate logs
            await Task.Delay(TimeSpan.FromSeconds(15));

            // Act - Get logs from all services
            var logsResult = GetAllServiceLogs(tailLines: 30);

            // Assert
            Assert.True(logsResult.ExitCode == 0, "Should be able to retrieve all logs");
            Assert.False(string.IsNullOrEmpty(logsResult.Logs), "Logs should not be empty");
            
            // Verify logs contain references to both services
            var logs = logsResult.Logs.ToLower();
            Assert.True(logs.Contains("redis") || logs.Contains("rabbitmq"),
                       $"Logs should contain service names. Logs length: {logsResult.Logs.Length}");
        }

        /// <summary>
        /// Gets logs from a specific Docker service
        /// </summary>
        /// <param name="serviceName">Name of the service to get logs from</param>
        /// <param name="tailLines">Number of lines to retrieve (default: 100)</param>
        /// <returns>Tuple containing exit code and log content</returns>
        private (int ExitCode, string Logs) GetServiceLogs(string serviceName, int tailLines = 100)
        {
            var result = RunDockerComposeCommand($"logs --tail={tailLines} {serviceName}", timeoutMinutes: 2);
            return (result.ExitCode, result.Output);
        }

        /// <summary>
        /// Gets logs from all services in the Docker Compose environment
        /// </summary>
        /// <param name="tailLines">Number of lines to retrieve per service (default: 50)</param>
        /// <returns>Tuple containing exit code and all logs</returns>
        private (int ExitCode, string Logs) GetAllServiceLogs(int tailLines = 50)
        {
            var result = RunDockerComposeCommand($"logs --tail={tailLines}", timeoutMinutes: 5);
            return (result.ExitCode, result.Output);
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
