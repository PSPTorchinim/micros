# Integration Tests

This directory contains comprehensive integration tests for the DJ Beat Blaster microservices platform. These tests validate the full environment build and system operation.

## Overview

The integration tests are organized into three main categories:

1. **Docker Compose Configuration Tests** - Fast validation tests
2. **Docker Build Tests** - Tests for building Docker images
3. **Full System Tests** - End-to-end tests of the running system

## Test Categories

### 1. Docker Compose Configuration Tests (`DockerComposeTests.cs`)

**Speed: Fast (< 1 minute)**  
**Requirements: Docker installed (doesn't need to be running)**

These tests validate:
- Docker Compose file existence and syntax
- Required services are defined
- Network configuration is correct
- Volume configuration is correct
- Environment file (.env) exists and contains required variables

**Run with:**
```bash
dotnet test --filter "FullyQualifiedName~DockerComposeTests"
```

### 2. Docker Build Tests (`DockerBuildTests.cs`)

**Speed: Slow (10-30 minutes)**  
**Requirements: Docker running, significant disk space**

These tests validate:
- All Dockerfile files exist
- Infrastructure services can be built (SQL Server, MongoDB, Redis, RabbitMQ, PostgreSQL)
- Backend microservices can be built (.NET services)
- Frontend services can be built (React, Strapi)
- API Gateway can be built
- All services can be built together

**⚠️ Warning:** These tests are marked as `Skip` by default because they:
- Take 10-30 minutes to complete
- Require Docker to be running
- Consume significant CPU, memory, and disk space
- Build actual Docker images

**Run with:**
```bash
# Run all build tests (requires removing Skip attribute or using filter)
dotnet test --filter "Speed=Slow"
```

### 3. Full System Tests (`FullSystemTests.cs`)

**Speed: Very Slow (5-15 minutes)**  
**Requirements: Docker running, ports available, significant resources**

These tests validate:
- Infrastructure services can start and become healthy
- Backend microservices can start successfully
- API Gateway starts and is accessible
- All services run together as a complete system
- System can be cleanly stopped and cleaned up

**⚠️ Warning:** These tests are marked as `Skip` by default because they:
- Take 5-15 minutes to complete
- Start the entire Docker Compose environment
- Require significant system resources (CPU, RAM, disk)
- Occupy standard ports (3000, 5432, 27017, 1433, 6379, etc.)
- May interfere with locally running services

**Run with:**
```bash
# Run all system tests (requires removing Skip attribute or using filter)
dotnet test --filter "Speed=VerySlow"
```

## Quick Start

### Run Quick Validation Tests (Recommended for CI/CD)

These tests run in seconds and don't require Docker to be running:

```bash
# From the repository root
dotnet test Tests/Integration.Tests/Integration.Tests.csproj

# Or use the helper script
./Tests/Integration.Tests/run-tests.sh quick
```

### Run All Tests with Helper Script

A convenient shell script is provided to run different test suites:

```bash
cd Tests/Integration.Tests

# Show help
./run-tests.sh help

# Run quick tests (default)
./run-tests.sh quick

# Run build tests (slow)
./run-tests.sh build

# Run system tests (very slow)
./run-tests.sh system

# Run everything (extremely slow)
./run-tests.sh all
```

## Running Specific Tests

### Run Only Quick Tests
```bash
dotnet test --filter "Category!=Integration&Speed!=Slow&Speed!=VerySlow"
```

### Run Only Build Tests
```bash
dotnet test --filter "Speed=Slow"
```

### Run Only System Tests
```bash
dotnet test --filter "Speed=VerySlow"
```

### Run Tests by Class
```bash
dotnet test --filter "FullyQualifiedName~DockerComposeTests"
dotnet test --filter "FullyQualifiedName~DockerBuildTests"
dotnet test --filter "FullyQualifiedName~FullSystemTests"
```

### Run a Specific Test
```bash
dotnet test --filter "FullyQualifiedName~DockerComposeFile_Exists"
```

## Test Results Interpretation

### Successful Test Run (Quick Tests)
```
Total tests: 19
     Passed: 9
    Skipped: 10
```

- **Passed**: Quick validation tests that ran successfully
- **Skipped**: Slow/VerySlow tests that are skipped by default

### Running Build or System Tests

To run the skipped tests, you need to:

1. **Option 1**: Remove the `Skip` attribute from the test
2. **Option 2**: Use filtering to run specific test categories

## CI/CD Integration

### Recommended CI Pipeline

```yaml
# Example GitHub Actions workflow
- name: Run Quick Integration Tests
  run: dotnet test Tests/Integration.Tests/Integration.Tests.csproj --filter "Category!=Integration&Speed!=Slow&Speed!=VerySlow"

# Optional: Run build tests (only on main branch or release)
- name: Run Build Tests
  if: github.ref == 'refs/heads/main'
  run: dotnet test Tests/Integration.Tests/Integration.Tests.csproj --filter "Speed=Slow"

# Optional: Run full system tests (nightly builds)
- name: Run System Tests
  if: github.event_name == 'schedule'
  run: dotnet test Tests/Integration.Tests/Integration.Tests.csproj --filter "Speed=VerySlow"
```

## Test Structure

```
Integration.Tests/
├── DockerComposeTests.cs      # Quick validation tests
├── DockerBuildTests.cs        # Docker image build tests
├── FullSystemTests.cs         # Full system integration tests
├── Integration.Tests.csproj   # Project file
├── run-tests.sh              # Helper script for running tests
└── README.md                 # This file
```

## Prerequisites

### For Quick Tests
- .NET 9.0 SDK
- Docker installed (doesn't need to be running)

### For Build Tests
- All quick test prerequisites
- Docker running
- At least 20 GB free disk space
- Good internet connection (for pulling base images)

### For System Tests
- All build test prerequisites
- Ports available: 3000, 1433, 27017, 5432, 6379, 5672, 15672, 1337
- At least 8 GB RAM available
- Docker Compose installed

## Troubleshooting

### Tests Fail with "Docker not found"
- Make sure Docker is installed and in your PATH
- Run `docker --version` to verify

### Build Tests Timeout
- Increase the timeout in the test code
- Check your internet connection
- Ensure you have enough disk space

### System Tests Fail with Port Conflicts
- Make sure no other services are using the required ports
- Stop any running Docker containers: `docker compose down`
- Use `docker ps` to check for running containers

### Out of Resources
- Close unnecessary applications
- Stop other Docker containers
- Increase Docker resource limits in Docker Desktop settings

## Contributing

When adding new integration tests:

1. Mark slow tests with `[Trait("Speed", "Slow")]` or `[Trait("Speed", "VerySlow")]`
2. Use `Skip` attribute for tests that shouldn't run by default
3. Add proper cleanup in `Dispose()` methods
4. Document resource requirements
5. Update this README with new test information

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [xUnit Documentation](https://xunit.net/)
- [Repository README](../../README.md)
- [Docker Setup Guide](../../Docker/README.md)
