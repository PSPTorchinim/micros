# Grafana Dashboard Generation

This directory contains templates and a generator script for creating environment-specific Grafana dashboards.

## Overview

The dashboards use exact container names instead of regex patterns, which means they need to be generated for each environment with the correct project name and replica index.

## Directory Structure

```
Docker/init/grafana/
├── dashboards/              # Generated dashboards (gitignored, generated at build time)
├── dashboards-templates/    # Dashboard template files
├── generate-dashboards.sh   # Generator script
└── README-DASHBOARDS.md     # This file
```

## Usage

### Generating Dashboards

Run the generator script with your environment-specific values:

```bash
./generate-dashboards.sh <project_name> <replica_index>
```

**Example for development environment:**
```bash
./generate-dashboards.sh ix-dj-panel-development 1
```

**Example for production environment:**
```bash
./generate-dashboards.sh ix-dj-panel-production 1
```

### Using Environment Variables

You can also set environment variables:

```bash
export PROJECT_NAME=ix-dj-panel-development
export REPLICA_INDEX=1
./generate-dashboards.sh
```

## Integration with Build Pipeline

Add this step to your CI/CD pipeline or docker-compose startup:

### Docker Compose

Add to your docker-compose.yml or startup script:

```yaml
services:
  grafana:
    build:
      context: ../
      dockerfile: Docker/infra/grafana.Dockerfile
      args:
        PROJECT_NAME: ${PROJECT_NAME:-ix-dj-panel-development}
        REPLICA_INDEX: ${REPLICA_INDEX:-1}
    # ... rest of configuration
```

Then in the Dockerfile or entrypoint:

```dockerfile
# In Dockerfile
ARG PROJECT_NAME
ARG REPLICA_INDEX
RUN /etc/grafana/provisioning/dashboards-templates/../generate-dashboards.sh ${PROJECT_NAME} ${REPLICA_INDEX}
```

Or in an entrypoint script that runs before Grafana starts.

### GitHub Actions / CI

```yaml
- name: Generate Grafana Dashboards
  run: |
    cd Docker/init/grafana
    ./generate-dashboards.sh ix-dj-panel-${ENVIRONMENT} 1
  env:
    ENVIRONMENT: ${{ github.ref_name }}  # e.g., development, staging, production
```

## Template Format

Templates use shell variable syntax for substitution:

- `${PROJECT_NAME}` - The Docker Compose project name (e.g., "ix-dj-panel-development")
- `${REPLICA_INDEX}` - The replica/instance number (typically "1")

Example query in template:
```json
{
  "expr": "rate({service_name=\"${PROJECT_NAME}-apigateway-${REPLICA_INDEX}\"}[1m])"
}
```

Becomes (after generation):
```json
{
  "expr": "rate({service_name=\"ix-dj-panel-development-apigateway-1\"}[1m])"
}
```

## Modifying Dashboards

1. Edit the template files in `dashboards-templates/`
2. Re-run the generator script
3. Restart Grafana to pick up changes

**Note:** Do not edit files in `dashboards/` directly as they are generated and will be overwritten.

## Default Values

- Default PROJECT_NAME: `ix-dj-panel-development`
- Default REPLICA_INDEX: `1`

These can be overridden via command-line arguments or environment variables.
