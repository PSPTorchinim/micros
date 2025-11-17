# Docker Configuration - DJ Beat Blaster Platform

This directory contains Docker configurations for containerizing and orchestrating the DJ Beat Blaster microservices platform.

## 📋 Overview

The Docker setup provides a complete containerized environment for:

- All microservices (.NET 9 APIs)
- Frontend application (React SPA)
- Content Management System (Strapi CMS)
- Infrastructure services (Databases, Cache, Message Queue)

## 🐳 Available Docker Files

### Service Dockerfiles

#### `microservice.Dockerfile`

Multi-stage Dockerfile for .NET 9 microservices with optimized build and runtime layers.

**Features:**

- Multi-stage build for smaller production images
- .NET 9 SDK for building, runtime for execution
- Health check endpoints configured
- Environment variable support
- Security hardening with non-root user

**Build Example:**

```bash
docker build -f microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=IdentityAPI \
  --build-arg ASPNETCORE_ENVIRONMENT=Production \
  -t djbeatblaster/identity-api:latest \
  ..
```

#### `microfrontend.Dockerfile`

Optimized Dockerfile for React frontend with static file serving.

**Features:**

- Node.js 20 for building
- Static file serving with nginx or serve
- Environment variable injection at build time
- Optimized bundle size
- Health check for availability

**Build Example:**

```bash
docker build -f microfrontend.Dockerfile \
  --build-arg MICROFRONTEND_NAME=dj-panel \
  --build-arg REACT_APP_API_GATEWAY=https://api.djbeatblaster.com \
  -t djbeatblaster/dj-panel:latest \
  ..
```

#### `strapi.Dockerfile`

Custom Dockerfile for Strapi CMS with PostgreSQL support.

**Features:**

- Strapi latest version
- PostgreSQL database connector
- Environment-based configuration
- Health check for admin panel
- Custom plugins and configurations

### Infrastructure Dockerfiles

#### `sqlserver.Dockerfile`

Microsoft SQL Server 2022 with custom initialization.

**Features:**

- SQL Server 2022 Latest
- Custom database initialization scripts
- Health check with sqlcmd
- Persistent data volumes
- Security configuration

#### `mongodb.Dockerfile`

MongoDB with authentication and custom configuration.

**Features:**

- MongoDB latest with authentication
- Custom configuration for performance
- Health check with mongo client
- Data persistence and replication ready
- Security hardening

#### `postgres.Dockerfile`

PostgreSQL optimized for Strapi CMS.

**Features:**

- PostgreSQL latest
- Strapi-specific configuration
- Performance tuning
- Health check endpoints
- Backup and restore capabilities

#### `redis.Dockerfile`

Redis for caching and session storage.

**Features:**

- Redis latest with persistence
- Custom configuration for caching
- Memory optimization
- Health check endpoints
- Cluster-ready configuration

#### `rabbitmq.Dockerfile`

RabbitMQ message broker with management interface.

**Features:**

- RabbitMQ with management plugin
- Custom queue and exchange setup
- Health check endpoints
- Monitoring and metrics
- High availability configuration

#### `grafana.Dockerfile`

Grafana for visualization and monitoring dashboards.

**Features:**

- Grafana 11.4.0 with pre-installed plugins
- External access configuration support
- Loki data source integration
- Custom dashboard provisioning
- Health check endpoints
- Secure admin credentials via environment variables

## 🚀 Docker Compose Configuration

### `dj-panel-composer.yml`

Complete orchestration file for the entire platform.

**Services Included:**

- All 8 microservices (IdentityAPI, MusicAPI, etc.)
- React frontend (DJ Panel)
- Strapi CMS
- SQL Server database
- MongoDB database
- PostgreSQL database
- Redis cache
- RabbitMQ message broker
- Loki logging aggregation
- Promtail log collector
- Grafana monitoring dashboards

**Network Configuration:**

```yaml
networks:
  sql_net: # SQL Server network
  mongo_net: # MongoDB network
  redis_net: # Redis network
  rabbitmq_net: # RabbitMQ network
  apigw_backends_net: # API Gateway to services
  apigw_fe_net: # API Gateway to frontend
  strapi: # Strapi CMS network
  strapi_fe_net: # Strapi to frontend
  logging_net: # Logging and monitoring network
  public: # Public access network
```

**Volume Configuration:**

```yaml
volumes:
  mssql_data: # SQL Server data persistence
  mongo_data: # MongoDB data persistence
  pg_data: # PostgreSQL data persistence
  redis_data: # Redis data persistence
  rabbitmq_data: # RabbitMQ data persistence
  strapi_app: # Strapi application data
  loki_data: # Loki logs persistence
  promtail_positions: # Promtail position tracking
  grafana_data: # Grafana dashboards and configurations
```

## 🏃‍♂️ Running the Platform

### Complete Platform Deployment

```bash
# Start all services
docker-compose -f dj-panel-composer.yml up -d

# Check service status
docker-compose -f dj-panel-composer.yml ps

# View logs
docker-compose -f dj-panel-composer.yml logs -f [service_name]

# Stop all services
docker-compose -f dj-panel-composer.yml down
```

### Infrastructure Only

Start just the infrastructure services for local development:

```bash
# Start infrastructure services only
docker-compose -f dj-panel-composer.yml up -d \
  sqlserver mongodb postgres redis rabbitmq

# Verify infrastructure is ready
docker-compose -f dj-panel-composer.yml ps sqlserver mongodb postgres redis rabbitmq
```

### Selective Service Deployment

```bash
# Start specific services
docker-compose -f dj-panel-composer.yml up -d \
  apigateway identity-api music-api

# Scale specific services
docker-compose -f dj-panel-composer.yml up -d --scale music-api=3
```

## 🔧 Environment Configuration

### Environment Variables File

Create `.env` file in the Docker directory. A template is provided with default values for local development.

**Key Configuration Sections:**

#### Database Configuration
```bash
DATABASE_HOST_SQLSERVER=sqlserver
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
DATABASE_HOST_MONGODB=mongodb
DATABASE_PASSWORD_MONGODB=password
```

#### External Access Configuration
For services accessible from outside the Docker network (frontend, Strapi CMS, Grafana):

```bash
# API Gateway External Access
API_GATEWAY=http://localhost:3000

# Strapi CMS External Access
CMS_HOST=localhost
CMS_PORT=1337
CMS_PROTOCOL=http
CMS_API_PATH=/api

# Grafana External Access
GRAFANA_HOST=localhost
GRAFANA_PORT=3001
GRAFANA_PROTOCOL=http
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=djpanel_grafana_admin_2024
```

**Note:** For production deployment:
- Update HOST values to your production domain
- Change PROTOCOL to `https`
- Use strong, unique passwords
- Configure these in GitHub Secrets/Variables for CI/CD

#### Cache and Message Queue Configuration
```bash
REDIS_HOST=redis
REDIS_PASSWORD=your_redis_password
RABBITMQ_HOST=rabbitmq
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
```

#### Security Configuration
```bash
SECURE_KEY=ProductionSecureKey123456789
JWT_KEY=ProductionJWTKey123456789012345678901234567890
```

See the `.env` file for the complete list of configuration options.

### Service-Specific Environment Files

Each service can have its own environment file:

- `.env.identity` - IdentityAPI specific variables
- `.env.music` - MusicAPI specific variables
- `.env.frontend` - Frontend specific variables

## 🔍 Health Checks & Monitoring

### Built-in Health Checks

All services include health check endpoints:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/healthz/live"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Monitoring Commands

```bash
# Check all service health
docker-compose -f dj-panel-composer.yml ps

# View specific service logs
docker-compose -f dj-panel-composer.yml logs -f identity-api

# Monitor resource usage
docker stats

# Execute health check manually
docker-compose -f dj-panel-composer.yml exec identity-api curl http://localhost:8080/healthz/live
```

## 🔒 Security Configuration

### Network Security

- Isolated networks for different service groups
- No direct database access from external networks
- API Gateway as single entry point
- Internal service-to-service communication only

### Container Security

- Non-root user execution
- Minimal base images (runtime-only for production)
- Security scanning in build pipeline
- Secrets management via environment variables

### SSL/TLS Configuration

For production deployment with SSL:

```yaml
# Add SSL configuration to API Gateway
apigateway:
  ports:
    - "443:8080"
  environment:
    - ASPNETCORE_URLS=https://+:8080
    - ASPNETCORE_Kestrel__Certificates__Default__Password=password
    - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/cert.pfx
  volumes:
    - ./certs:/https/:ro
```

## 📊 Performance Optimization

### Resource Limits

Configure appropriate resource limits:

```yaml
services:
  identity-api:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

### Database Optimization

- Persistent volumes for data
- Memory and CPU tuning
- Connection pool optimization
- Index optimization

### Caching Strategy

- Redis for application caching
- Browser caching for static assets
- API response caching
- Database query result caching

## 🚀 Production Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring and alerting setup
- [ ] Log aggregation configured
- [ ] Resource limits set
- [ ] Security scanning completed
- [ ] Performance testing completed

### Deployment Commands

```bash
# Production deployment
docker-compose -f dj-panel-composer.yml \
  --env-file .env.production \
  up -d

# Verify deployment
docker-compose -f dj-panel-composer.yml ps
docker-compose -f dj-panel-composer.yml logs --tail=50
```

### Rollback Strategy

```bash
# Tag current deployment
docker-compose -f dj-panel-composer.yml \
  images --format "table {{.Repository}}\t{{.Tag}}"

# Rollback to previous version
docker-compose -f dj-panel-composer.yml \
  pull --policy missing
docker-compose -f dj-panel-composer.yml up -d
```

## 🔄 Backup & Recovery

### Database Backups

```bash
# SQL Server backup
docker exec -it micros_sqlserver_1 \
  /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" \
  -Q "BACKUP DATABASE [IdentityDB] TO DISK = '/var/opt/mssql/backup/IdentityDB.bak'"

# MongoDB backup
docker exec -it micros_mongodb_1 \
  mongodump --host localhost --db DocumentsDB --out /backup

# PostgreSQL backup
docker exec -it micros_postgres_1 \
  pg_dump -U strapi strapi > /backup/strapi.sql
```

### Volume Backup

```bash
# Create volume backups
docker run --rm -v micros_mssql_data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/mssql_data.tar.gz -C /data .
```

## 🐛 Troubleshooting

### Common Issues

#### Port Conflicts

```bash
# Check port usage
netstat -tulpn | grep :5000

# Change port mapping in docker-compose.yml
ports:
  - "5001:8080"  # Changed from 5000:8080
```

#### Memory Issues

```bash
# Check memory usage
docker stats

# Increase memory limits
deploy:
  resources:
    limits:
      memory: 1G
```

#### Network Connectivity

```bash
# Check network connectivity
docker-compose -f dj-panel-composer.yml exec identity-api \
  ping music-api

# Inspect networks
docker network ls
docker network inspect micros_apigw_backends_net
```

#### Database Connection Issues

```bash
# Test database connection
docker-compose -f dj-panel-composer.yml exec identity-api \
  curl http://localhost:8080/healthz/live

# Check database logs
docker-compose -f dj-panel-composer.yml logs sqlserver
```

### Debug Mode

Enable debug mode for troubleshooting:

```yaml
environment:
  - ASPNETCORE_ENVIRONMENT=Development
  - Logging__LogLevel__Default=Debug
```

### Useful Commands

```bash
# Clean up all containers and volumes
docker-compose -f dj-panel-composer.yml down -v
docker system prune -af

# Rebuild specific service
docker-compose -f dj-panel-composer.yml build --no-cache identity-api

# Access container shell
docker-compose -f dj-panel-composer.yml exec identity-api /bin/bash
```

For additional support, refer to the main [README](../README.md) and [troubleshooting section](../README.md#troubleshooting).

---

**Developed by PSPTorchinim**
