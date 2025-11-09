# Grafana Dashboard Generation

This directory contains templates and a generator script for creating environment-specific Grafana dashboards.

## Overview

The dashboards use exact container names instead of regex patterns, which means they need to be generated for each environment with the correct project name and replica index.

**Dashboards are automatically generated during the Grafana Docker image build process.**

## Directory Structure

```
Docker/init/grafana/
├── dashboards/              # Generated dashboards (gitignored, generated at build time)
├── dashboards-templates/    # Dashboard template files
├── generate-dashboards.sh   # Generator script
└── README-DASHBOARDS.md     # This file
```

## How It Works

### Automatic Generation During Build

The dashboard generation is integrated into the Grafana Dockerfile build process:

1. **Build Arguments:** Set `PROJECT_NAME` and `REPLICA_INDEX` when building
2. **Template Processing:** The build process runs `generate-dashboards.sh`
3. **Dashboard Creation:** Exact container names are substituted into queries
4. **Image Creation:** The generated dashboards are baked into the Grafana image

### Docker Compose Integration

The `dj-panel-composer.yml` file passes build arguments to the Grafana service:

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

### Setting Environment Variables

**For Development:**
Create a `.env` file in the `Docker` directory:

```bash
# Docker/.env
PROJECT_NAME=ix-dj-panel-development
REPLICA_INDEX=1
```

**For Production:**
```bash
# Docker/.env
PROJECT_NAME=ix-dj-panel-production
REPLICA_INDEX=1
```

**For Staging:**
```bash
# Docker/.env
PROJECT_NAME=ix-dj-panel-staging
REPLICA_INDEX=1
```

## Building the Grafana Image

### Using Docker Compose

```bash
cd Docker
docker compose build grafana
```

The build process will automatically generate dashboards using the values from your `.env` file.

### Using Docker Build Directly

```bash
docker build \
  --build-arg PROJECT_NAME=ix-dj-panel-production \
  --build-arg REPLICA_INDEX=1 \
  -f Docker/infra/grafana.Dockerfile \
  -t grafana:custom \
  .
```

## Manual Dashboard Generation

If you need to generate dashboards manually (for testing or development):

```bash
cd Docker/init/grafana
./generate-dashboards.sh <project_name> <replica_index>
```

**Example:**
```bash
./generate-dashboards.sh ix-dj-panel-development 1
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

## CI/CD Pipeline Integration

### GitHub Actions Example

```yaml
- name: Set Environment Variables
  run: |
    echo "PROJECT_NAME=ix-dj-panel-${{ github.ref_name }}" >> $GITHUB_ENV
    echo "REPLICA_INDEX=1" >> $GITHUB_ENV

- name: Build Grafana Image
  run: |
    docker build \
      --build-arg PROJECT_NAME=${{ env.PROJECT_NAME }} \
      --build-arg REPLICA_INDEX=${{ env.REPLICA_INDEX }} \
      -f Docker/infra/grafana.Dockerfile \
      -t grafana:${{ github.ref_name }} \
      .
```

### GitLab CI Example

```yaml
build-grafana:
  script:
    - docker build 
        --build-arg PROJECT_NAME=ix-dj-panel-${CI_ENVIRONMENT_NAME}
        --build-arg REPLICA_INDEX=1
        -f Docker/infra/grafana.Dockerfile
        -t grafana:${CI_ENVIRONMENT_NAME}
        .
```

## Deployment Process

1. **Set environment variables** in your `.env` file or CI/CD pipeline
2. **Build the Grafana image:** `docker compose build grafana`
3. **Start the services:** `docker compose up -d`
4. **Grafana starts** with pre-generated, environment-specific dashboards

No manual dashboard generation step required!

## Modifying Dashboards

1. Edit the template files in `dashboards-templates/`
2. Rebuild the Grafana image: `docker compose build grafana`
3. Restart Grafana: `docker compose up -d grafana`

**Note:** Do not edit files in `dashboards/` directly as they are generated during build and will be overwritten.

## Troubleshooting

### Dashboards Show "No Data"

1. **Check container names match:** Verify your containers are named with the pattern `${PROJECT_NAME}-{service}-${REPLICA_INDEX}`
2. **Rebuild with correct variables:** Ensure `PROJECT_NAME` and `REPLICA_INDEX` match your deployment
3. **Check Promtail logs:** Verify logs are being collected and labeled correctly

### Dashboards Not Updating

1. **Rebuild the image:** `docker compose build grafana --no-cache`
2. **Remove old containers:** `docker compose down grafana && docker compose up -d grafana`
3. **Check generated files:** Inspect the dashboards in the built image

### Viewing Generated Dashboards

To see what dashboards were generated in the image:

```bash
docker run --rm -it --entrypoint /bin/sh <grafana-image-id>
# Inside container:
ls -la /etc/grafana/provisioning/dashboards/
cat /etc/grafana/provisioning/dashboards/service-apigateway.json | grep "service_name"
```

## Environment-Specific Examples

### Development
```bash
PROJECT_NAME=ix-dj-panel-development
REPLICA_INDEX=1
# Generates: service_name="ix-dj-panel-development-apigateway-1"
```

### Staging
```bash
PROJECT_NAME=ix-dj-panel-staging
REPLICA_INDEX=1
# Generates: service_name="ix-dj-panel-staging-apigateway-1"
```

### Production
```bash
PROJECT_NAME=ix-dj-panel-production
REPLICA_INDEX=1
# Generates: service_name="ix-dj-panel-production-apigateway-1"
```
