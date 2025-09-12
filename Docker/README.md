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

## 🚀 Docker Compose Configuration

### `dj-panel-composer.yml`

Complete orchestration file for the entire platform.

**Services Included:**

- All 8 microservices
- React frontend (DJ Panel)
- Strapi CMS
- SQL Server database
- MongoDB database
- PostgreSQL database
- Redis cache
- RabbitMQ message broker

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

Create `.env` file in the Docker directory:

```bash
# Database Configuration
DATABASE_HOST_SQLSERVER=sqlserver
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd

DATABASE_HOST_MONGODB=mongodb
DATABASE_PORT_MONGODB=27017
DATABASE_USER_MONGODB=admin
DATABASE_PASSWORD_MONGODB=password

DATABASE_HOST_POSTGRES=postgres
DATABASE_PORT_POSTGRES=5432
DATABASE_USER_POSTGRES=strapi
DATABASE_PASSWORD_POSTGRES=strapi

# Cache Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Message Queue Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Security Configuration
SECURE_KEY=ProductionSecureKey123456789
JWT_KEY=ProductionJWTKey123456789012345678901234567890

# Service Configuration
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_IDENTITY_BE_ADDRESS=http://identity-api:8080
ASPNETCORE_MUSIC_BE_ADDRESS=http://music-api:8080
ASPNETCORE_GEAR_BE_ADDRESS=http://equipment-api:8080
ASPNETCORE_DOCUMENTS_BE_ADDRESS=http://documents-api:8080
ASPNETCORE_BRAND_BE_ADDRESS=http://company-api:8080
ASPNETCORE_PARTY_BE_ADDRESS=http://party-api:8080
ASPNETCORE_MAILING_BE_ADDRESS=http://mailing-api:8080

# Database Catalogs
IDENTITY_DATABASE_CATALOG=IdentityDB
MUSIC_DATABASE_CATALOG=MusicDB
GEAR_DATABASE_CATALOG=GearDB
DOCUMENTS_DATABASE_CATALOG=DocumentsDB
BRAND_DATABASE_CATALOG=BrandDB
PARTY_DATABASE_CATALOG=PartyDB
MAILING_DATABASE_CATALOG=MailingDB
APIGATEWAY_DATABASE_CATALOG=ApiGatewayDB

# Frontend Configuration
REACT_APP_API_GATEWAY=http://localhost:5000
REACT_APP_API_SECURE_KEY=ProductionSecureKey123456789

# Strapi Configuration
CMS_DATABASE_CLIENT=postgres
CMS_NODE_ENV=production
CMS_DATABASE_NAME=strapi
CMS_DATABASE_HOST=postgres
CMS_DATABASE_PORT=5432
CMS_DATABASE_USERNAME=strapi
CMS_DATABASE_PASSWORD=strapi
CMS_JWT_SECRET=your-jwt-secret
CMS_ADMIN_JWT_SECRET=your-admin-jwt-secret
CMS_APP_KEYS=your-app-keys

# User Configuration
DJPANEL_USER_EMAIL=admin@djbeatblaster.com
DJPANEL_USER_PASSWORD=Admin123!
```

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
