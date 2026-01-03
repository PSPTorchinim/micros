
# hadolint global ignore=DL3059

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

ARG MICROSERVICE_NAME

# Install dependencies and update in single layer
# Note: Not pinning curl version as it's a system utility that should track OS security updates
# hadolint ignore=DL3008
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Set WORKDIR before COPY (DL3045)
WORKDIR /

# Copy only project files first for better layer caching
COPY Services/${MICROSERVICE_NAME}/*.csproj ./Services/${MICROSERVICE_NAME}/
COPY Services/Shared/*.csproj ./Services/Shared/

# Restore dependencies
# Note: --no-cache forces fresh package downloads, resolving Swashbuckle version conflicts
RUN dotnet restore Services/${MICROSERVICE_NAME}/*.csproj --no-cache

# Copy remaining source code
COPY Services/${MICROSERVICE_NAME}/ ./Services/${MICROSERVICE_NAME}/
COPY Services/Shared/ ./Services/Shared/

# Use absolute WORKDIR (DL3000)
WORKDIR /Services/${MICROSERVICE_NAME}/

# Install EF Core tools (skip if already installed)
RUN dotnet tool install --global dotnet-ef || dotnet tool update --global dotnet-ef || true
ENV PATH="$PATH:/root/.dotnet/tools"

# Generate migrations if DbContext exists (optional step)
RUN dotnet ef dbcontext list && dotnet ef migrations add InitialMigration || echo "No DbContext found, skipping migrations"

# Run tests, build, and publish in optimized sequence
RUN dotnet test -c Release --no-restore && \
    dotnet build -c Release -o /app/build --no-restore && \
    dotnet publish -c Release -o /app/publish --no-restore /p:UseAppHost=false


# Use lightweight ASP.NET runtime instead of full SDK (reduces image size by ~600MB)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
SHELL ["/bin/bash","-lc"]

# Install curl in single layer and clean up
# Note: Not pinning curl version as it's a system utility that should track OS security updates
# hadolint ignore=DL3008
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 8080
ARG MICROSERVICE_NAME

# Environment variables will be provided at runtime via docker-compose environment section
# This allows the same image to be used across different environments without rebuilding

WORKDIR /app
COPY --from=build /app/publish/ .

ENV APP_EXE=${MICROSERVICE_NAME}.dll

# Use JSON notation with shell -c for env var substitution
ENTRYPOINT ["sh", "-c", "dotnet $APP_EXE"]

# Optimized health check - reduced start period and interval for faster deployment
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
  CMD curl -fsS http://localhost:8080/healthz/live \
   || curl -fsS http://localhost:8080/health \
   || curl -fsS http://localhost:8080/ \
   || exit 1
