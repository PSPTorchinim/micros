# DJ Beat Blaster - Logging & Monitoring Setup

This document describes the centralized logging and monitoring infrastructure for the DJ Beat Blaster microservices platform using Grafana and Loki.

## 📋 Overview

The platform uses a modern logging stack consisting of:

- **Grafana**: Visualization and dashboard platform for viewing logs
- **Loki**: Log aggregation system optimized for Kubernetes and cloud-native environments
- **Promtail**: Agent that collects logs from Docker containers and sends them to Loki
- **Serilog**: Structured logging library integrated into .NET microservices

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Microservices Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Identity  │ │  Music   │ │Equipment │ │  Party   │      │
│  │   API    │ │   API    │ │   API    │ │   API    │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │            │            │            │             │
│       └────────────┴────────────┴────────────┘             │
│                    │ (Serilog)                             │
└────────────────────┼───────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Log Collection Layer                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 Promtail Agent                        │ │
│  │  - Collects logs from Docker containers              │ │
│  │  - Parses and labels log entries                     │ │
│  │  - Forwards to Loki                                  │ │
│  └─────────────────────┬─────────────────────────────────┘ │
└────────────────────────┼───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Log Storage Layer                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Loki                               │ │
│  │  - Stores logs with labels (no indexing)             │ │
│  │  - Provides query API                                │ │
│  │  - 7-day retention period                            │ │
│  └─────────────────────┬─────────────────────────────────┘ │
└────────────────────────┼───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Visualization Layer                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                   Grafana                             │ │
│  │  - Log visualization and exploration                 │ │
│  │  - Pre-configured Loki datasource                    │ │
│  │  - Custom dashboards                                 │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Starting the Logging Stack

1. **Start all services including logging:**
   ```bash
   cd Docker
   docker-compose -f dj-panel-composer.yml up -d
   ```

2. **Start only logging services:**
   ```bash
   docker-compose -f dj-panel-composer.yml up -d loki promtail grafana
   ```

3. **Verify services are running:**
   ```bash
   docker-compose -f dj-panel-composer.yml ps loki promtail grafana
   ```

### Accessing the Logging Dashboards

- **Grafana Dashboard**: http://localhost:3001
  - Default username: `admin`
  - Default password: `djpanel_grafana_admin_2024` (configured in `.env`)

- **Loki API**: http://localhost:3100
  - Health check: http://localhost:3100/ready
  - Metrics: http://localhost:3100/metrics

- **Promtail**: http://localhost:9080
  - Health check: http://localhost:9080/ready
  - Metrics: http://localhost:9080/metrics

## 📊 Grafana Configuration

### Pre-configured Features

1. **Loki Datasource**: Automatically configured and set as default
2. **Service Labels**: All logs are automatically labeled with:
   - `service`: Service name (e.g., identity_be, music_be)
   - `container`: Container name
   - `type`: Service type (microservice, frontend, infrastructure)
   - `environment`: Deployment environment
   - `compose_project`: Docker Compose project name
3. **Pre-built Dashboards**: 13 dashboards are automatically provisioned for DJ Panel services:
   
   **Aggregate Dashboards:**
   - **DJ Panel - Overview**: Comprehensive view of all DJ Panel services with log rates, error counts, and real-time logs
   - **DJ Panel - Microservices**: Detailed monitoring of backend services (identity_be, music_be, gear_be, documents_be, brand_be, party_be, mailing_be, apigateway)
   - **DJ Panel - Frontend Services**: Focused view of frontend services (host_fe, strapi)
   
   **Individual Service Dashboards:**
   - **Identity Service**: User authentication and session management logs
   - **Music Service**: Music library and playlist logs
   - **Equipment Service**: DJ equipment and gear management logs
   - **Documents Service**: Document storage and management logs
   - **Company Service**: Company and brand management logs
   - **Party Service**: Event and party management logs
   - **Mailing Service**: Email campaign and notification logs
   - **API Gateway**: Gateway and routing logs
   - **DJ Panel Frontend**: React frontend application logs
   - **Strapi CMS**: Content management system logs

### Accessing Pre-built Dashboards

1. Log in to Grafana at http://localhost:3001
2. Navigate to "Dashboards" in the left sidebar
3. Open the "DJ Beat Blaster" folder
4. Select one of the pre-configured dashboards:
   - Use **DJ Panel - Overview** for a quick health check of all services
   - Use **DJ Panel - Microservices** or **DJ Panel - Frontend Services** for grouped monitoring with filtering
   - Use individual service dashboards (e.g., **Identity Service**, **Music Service**) for deep-dive analysis of a specific service

All dashboards automatically filter to show only logs from DJ Panel services (excluding infrastructure services like databases, message queues, etc.).

### Creating Your First Dashboard

1. Log in to Grafana at http://localhost:3001
2. Click "Explore" in the left sidebar
3. Select "Loki" as the datasource
4. Use LogQL queries to explore your logs:

   ```logql
   # All logs from Identity service
   {service="identity_be"}
   
   # Error logs from all microservices
   {type="microservice"} |= "error"
   
   # Logs from a specific container
   {container="djpanel-identity_be-1"}
   
   # All logs with exception information
   {type="microservice"} |= "Exception"
   ```

### Sample LogQL Queries

```logql
# Count errors per service in the last hour
sum by (service) (count_over_time({type="microservice"} |= "error" [1h]))

# Rate of log entries per minute
rate({type="microservice"}[1m])

# Database connection errors
{type="microservice"} |= "database" |= "connection" |= "error"

# Authentication failures
{service="identity_be"} |= "authentication" |= "failed"

# Slow queries (performance monitoring)
{type="microservice"} |= "duration" | json | duration > 1000
```

## 📝 Structured Logging with Serilog

### Configuration

All .NET microservices are configured with Serilog for structured logging. The configuration is in `Services/Shared/Services/Run/ServicesBuilder.cs`.

### Key Features

1. **Console Output**: Human-readable logs in all environments
2. **Loki Integration**: Automatic forwarding to Loki when ASPNETCORE_LOKI_URL is configured
3. **Structured Properties**: Service name, environment, machine name
4. **Log Levels**: Configurable minimum levels per namespace
5. **Exception Logging**: Full exception details with stack traces
6. **Graceful Degradation**: Falls back to console logging if Loki is unavailable

### Using Serilog in Your Code

```csharp
using Microsoft.Extensions.Logging;

public class MyService
{
    private readonly ILogger<MyService> _logger;

    public MyService(ILogger<MyService> logger)
    {
        _logger = logger;
    }

    public void DoSomething()
    {
        _logger.LogInformation("Processing request for user {UserId}", userId);
        
        try
        {
            // Your logic here
            _logger.LogDebug("Operation completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process request for user {UserId}", userId);
            throw;
        }
    }
}
```

### Log Levels

- **Trace**: Very detailed logs, typically only for diagnosing specific problems
- **Debug**: Detailed information for debugging (disabled in production)
- **Information**: General informational messages
- **Warning**: Something unexpected but the application continues
- **Error**: Error events that might still allow the application to continue
- **Critical**: Serious errors that cause the application to stop

## 🔐 Security Considerations

### Production Deployment

1. **Change default Grafana password** in `.env`:
   ```bash
   GRAFANA_ADMIN_PASSWORD=your_strong_password_here
   ```

2. **Restrict network access**: Configure firewall rules to limit access to:
   - Grafana (port 3001): Only from authorized networks
   - Loki (port 3100): Only from internal services
   - Promtail (port 9080): Only from internal services

3. **Enable authentication**: Configure Grafana to use OAuth or LDAP for authentication

4. **Secure sensitive data**: Ensure logs don't contain:
   - Passwords or API keys
   - Credit card numbers or PII
   - Session tokens or JWT secrets

## 🛠️ Troubleshooting

### Logs Not Appearing in Grafana

1. **Check Promtail is running:**
   ```bash
   docker-compose -f dj-panel-composer.yml logs promtail
   ```

2. **Verify Loki is healthy:**
   ```bash
   curl http://localhost:3100/ready
   ```

3. **Check Grafana datasource configuration:**
   - Go to Configuration → Data Sources
   - Select Loki
   - Click "Test" to verify connection

### High Disk Usage

Loki stores logs on disk with a 7-day retention. To reduce disk usage:

1. **Reduce retention period** in `loki-config.yml`:
   ```yaml
   limits_config:
     retention_period: 72h  # 3 days instead of 7
   ```

2. **Clean up old data:**
   ```bash
   docker-compose -f dj-panel-composer.yml exec loki \
     rm -rf /loki/chunks/* /loki/tsdb-index/*
   ```

## 📈 Monitoring & Metrics

### Service Health

All logging services expose health check endpoints:

```bash
# Loki health
curl http://localhost:3100/ready

# Promtail health
curl http://localhost:9080/ready

# Grafana health
curl http://localhost:3001/api/health
```

## 🎨 Dashboard Generation

### Automatic Dashboard Generation

Dashboards are automatically generated during the Grafana Docker image build process to use exact container names for each environment.

#### How It Works

1. **Build Arguments**: Set `PROJECT_NAME` and `REPLICA_INDEX` when building Grafana
2. **Template Processing**: The build process runs `generate-dashboards.sh`
3. **Dashboard Creation**: Exact container names are substituted into queries
4. **Image Creation**: Generated dashboards are baked into the Grafana image

#### Directory Structure

```
Docker/init/grafana/
├── dashboards/              # Generated dashboards (gitignored, generated at build time)
├── dashboards-templates/    # Dashboard template files
└── generate-dashboards.sh   # Generator script
```

#### Docker Compose Integration

The `dj-panel-composer.yml` passes build arguments to Grafana:

```yaml
grafana:
  build:
    context: ../
    dockerfile: Docker/infra/grafana.Dockerfile
    args:
      PROJECT_NAME: ${PROJECT_NAME:-ix-dj-panel-development}
      REPLICA_INDEX: ${REPLICA_INDEX:-1}
```

**Default Values:**
- `PROJECT_NAME`: `ix-dj-panel-development`
- `REPLICA_INDEX`: `1`

#### Setting Environment Variables

**Option 1: `.env` file**
```env
PROJECT_NAME=ix-dj-panel-production
REPLICA_INDEX=1
```

**Option 2: Command line**
```bash
PROJECT_NAME=ix-dj-panel-production REPLICA_INDEX=1 docker compose -f dj-panel-composer.yml build grafana
```

#### Container Name Format

Dashboards query containers using this naming pattern:
```
service_name="${PROJECT_NAME}-${service}-${REPLICA_INDEX}"
```

Example for `apigateway` service:
```bash
PROJECT_NAME=ix-dj-panel-production
REPLICA_INDEX=1
# Generates: service_name="ix-dj-panel-production-apigateway-1"
```

#### Rebuilding Dashboards

When changing environments:

```bash
# Set new environment variables in .env file
# Then rebuild Grafana with new dashboard configuration
docker compose -f dj-panel-composer.yml build --no-cache grafana
docker compose -f dj-panel-composer.yml up -d grafana
```

---

**Last Updated**: 2024-11-02  
**Developed by PSPTorchinim**
