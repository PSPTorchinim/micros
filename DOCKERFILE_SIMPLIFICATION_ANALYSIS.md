# Dockerfile Simplification Analysis

## Overview

Analysis of which custom Dockerfiles can be replaced with official images directly in docker-compose to reduce build time and complexity.

## Current Infrastructure Dockerfiles (14 total)

### ✅ Can Use Official Image Directly (8 services)

These Dockerfiles add minimal value and can be replaced with official images in docker-compose:

#### 1. **Redis** (`redis.Dockerfile`) - **SIMPLIFY**
- **Current**: Custom Dockerfile based on `redis:8-alpine`
- **Customizations**: Only ENV var, directory creation, USER root, healthcheck
- **Recommendation**: Use `redis:8-alpine` directly
- **Migration**: Move ENV vars and healthcheck to docker-compose.yml
- **Impact**: Eliminates build, ~5-10s faster

#### 2. **SQL Server** (`sqlserver.Dockerfile`) - **SIMPLIFY**
- **Current**: Custom Dockerfile based on `mcr.microsoft.com/mssql/server:2022-latest`
- **Customizations**: Only ENV vars, directory creation, healthcheck
- **Recommendation**: Use official image directly
- **Migration**: Move ENV vars and healthcheck to docker-compose.yml
- **Impact**: Eliminates build, ~5-10s faster

#### 3. **PostgreSQL** (`postgres.Dockerfile`) - **SIMPLIFY**
- **Current**: Custom Dockerfile based on `postgres:18`
- **Customizations**: Only ENV vars, healthcheck
- **Recommendation**: Use `postgres:18` directly
- **Migration**: Move ENV vars and healthcheck to docker-compose.yml
- **Impact**: Eliminates build, ~5-10s faster

#### 4. **MongoDB Exporter** (`mongodb-exporter.Dockerfile`) - **SIMPLIFY**
- **Current**: Based on `percona/mongodb_exporter:0.40`
- **Customizations**: Only ENV vars for connection string
- **Recommendation**: Use official image directly
- **Migration**: Set MONGODB_URI in docker-compose environment
- **Impact**: Eliminates build, ~3-5s faster

#### 5. **PostgreSQL Exporter** (`postgres-exporter.Dockerfile`) - **SIMPLIFY**
- **Current**: Based on `prometheuscommunity/postgres-exporter:latest`
- **Customizations**: Only ENV vars for connection
- **Recommendation**: Use official image directly
- **Migration**: Set DATA_SOURCE_NAME in docker-compose
- **Impact**: Eliminates build, ~3-5s faster

#### 6. **Redis Exporter** (`redis-exporter.Dockerfile`) - **SIMPLIFY**
- **Current**: Based on `oliver006/redis_exporter:latest`
- **Customizations**: Only ENV vars
- **Recommendation**: Use official image directly
- **Migration**: Set REDIS_ADDR in docker-compose
- **Impact**: Eliminates build, ~3-5s faster

#### 7. **SQL Server Exporter** (`sqlserver-exporter.Dockerfile`) - **SIMPLIFY**
- **Current**: Based on `awaragi/prometheus-mssql-exporter:latest`
- **Customizations**: Only ENV vars
- **Recommendation**: Use official image directly
- **Migration**: Set connection vars in docker-compose
- **Impact**: Eliminates build, ~3-5s faster

#### 8. **Strapi** (`strapi.Dockerfile`) - **MAJOR SIMPLIFICATION**
- **Current**: Multi-stage custom build from `node:25-alpine` (100 lines)
- **Customizations**: Full npm build process, complex ENV setup
- **Recommendation**: Use `strapi/strapi:latest` or specific version
- **Migration**: Mount CMS source code as volume, use ENV vars for config
- **Impact**: Eliminates 2-5 minute build time, reduces image by ~200MB
- **Note**: Requires volume mount for `/srv/app` with Strapi source

### ⚠️ Keep Custom Dockerfile (4 services)

These require custom initialization scripts or specific configurations:

#### 9. **MongoDB** (`mongodb.Dockerfile`) - **KEEP**
- **Reason**: Needs custom init script (`mongo-init.js`) for user setup
- **Customizations**: Copies initialization script to `/docker-entrypoint-initdb.d/`
- **Alternative**: Could mount init script as volume, but current approach is cleaner

#### 10. **RabbitMQ** (`rabbitmq.Dockerfile`) - **KEEP**
- **Reason**: Needs custom entrypoint wrapper for cookie permission fix
- **Customizations**: Creates inline fix-cookie script, custom entrypoint
- **Alternative**: Could use docker-compose command override, but more complex

#### 11. **Loki** (`loki.Dockerfile`) - **KEEP (or CONSIDER)**
- **Reason**: Needs custom config file (`loki-config.yml`)
- **Customizations**: Copies config, runs as root
- **Alternative**: Could mount config as volume instead
- **Simplifiable**: Yes, if willing to mount config file

#### 12. **Prometheus** (`prometheus.Dockerfile`) - **KEEP (or CONSIDER)**
- **Reason**: Needs custom config file (`prometheus.yml`)
- **Customizations**: Copies config, runs as root
- **Alternative**: Could mount config as volume instead
- **Simplifiable**: Yes, if willing to mount config file

### 🔧 Monitoring Services (2 services)

#### 13. **Grafana** (`grafana.Dockerfile`) - **KEEP**
- **Reason**: Complex custom configuration, multiple config files
- **Customizations**: Multiple COPYs, custom provisioning
- **Keep for now**: Too complex to migrate easily

#### 14. **Promtail** (`promtail.Dockerfile`) - **KEEP (or CONSIDER)**
- **Reason**: Custom config file
- **Customizations**: Copies config, installs curl
- **Simplifiable**: Yes, if willing to mount config file

## Implementation Plan

### Phase 2.5A: High-Impact Simplifications (RECOMMENDED)

**Eliminate build time for 8 services:**

1. **Redis** - Direct official image
2. **SQL Server** - Direct official image  
3. **PostgreSQL** - Direct official image
4. **4x Exporters** - Direct official images
5. **Strapi** - Switch to official strapi/strapi image

**Expected Impact:**
- Build time reduction: 3-7 minutes (Strapi alone saves 2-5 minutes)
- Image size reduction: ~300MB total (~200MB from Strapi)
- Simpler maintenance: Fewer custom Dockerfiles to manage
- Faster CI/CD: Significantly reduced build times

### Phase 2.5B: Optional Config-Based Simplifications

**Mount configs instead of COPYing:**

1. **Loki** - Mount `loki-config.yml` as volume
2. **Prometheus** - Mount `prometheus.yml` as volume
3. **Promtail** - Mount config as volume

**Expected Impact:**
- Additional 3 Dockerfiles eliminated
- Total: 11 out of 14 infrastructure Dockerfiles replaced with official images
- 78% reduction in custom infrastructure Dockerfiles

## Docker Compose Changes Required

### Example: Redis Migration

**Before (custom Dockerfile):**
```yaml
redis:
  build:
    context: ../
    dockerfile: Docker/infra/redis.Dockerfile
    args:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
```

**After (official image):**
```yaml
redis:
  image: redis:8-alpine
  environment:
    - REDIS_PASSWORD=${REDIS_PASSWORD}
  command: redis-server --requirepass ${REDIS_PASSWORD}
  user: root
  healthcheck:
    test: ["CMD", "redis-cli", "-a", "$REDIS_PASSWORD", "ping"]
    interval: 10s
    timeout: 5s
    start_period: 20s
    retries: 5
```

### Example: Strapi Migration

**Before (custom build):**
```yaml
strapi:
  build:
    context: ../
    dockerfile: Docker/infra/strapi.Dockerfile
    args:
      # Many build args...
```

**After (official image):**
```yaml
strapi:
  image: strapi/strapi:latest
  environment:
    DATABASE_CLIENT: postgres
    DATABASE_NAME: ${CMS_DATABASE_NAME}
    DATABASE_HOST: ${CMS_DATABASE_HOST}
    DATABASE_PORT: ${CMS_DATABASE_PORT}
    DATABASE_USERNAME: ${CMS_DATABASE_USERNAME}
    DATABASE_PASSWORD: ${CMS_DATABASE_PASSWORD}
    JWT_SECRET: ${CMS_JWT_SECRET}
    ADMIN_JWT_SECRET: ${CMS_ADMIN_JWT_SECRET}
    APP_KEYS: ${CMS_APP_KEYS}
    API_TOKEN_SALT: ${CMS_API_TOKEN_SALT}
    TRANSFER_TOKEN_SALT: ${CMS_TRANSFER_TOKEN_SALT}
  volumes:
    - ./CMS:/srv/app
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:1337/_health"]
    interval: 15s
    timeout: 10s
    start_period: 60s
    retries: 5
```

## Generate Script Modifications

The `generate-compose-file.sh` script needs updates to:

1. **Detect simplified services** - Check if service uses official image vs custom build
2. **Skip build context** - Don't add build: sections for official images
3. **Add image:** - Use official image names directly
4. **Preserve healthchecks** - Ensure healthcheck configs are in compose file
5. **Handle commands** - Add command: overrides where needed (Redis password, etc.)

### Suggested Script Changes

Add logic to handle official images:

```bash
# Map of services to official images
declare -A OFFICIAL_IMAGES=(
  ["redis"]="redis:8-alpine"
  ["sqlserver"]="mcr.microsoft.com/mssql/server:2022-latest"
  ["strapi_db"]="postgres:18"
  ["mongodb-exporter"]="percona/mongodb_exporter:0.40"
  # ... etc
)

# In service processing loop:
if [[ -n "${OFFICIAL_IMAGES[$service_name]}" ]]; then
  # Use official image instead of build
  echo "    image: ${OFFICIAL_IMAGES[$service_name]}" >> "$OUTPUT_FILE"
else
  # Use existing build logic
  echo "    build:" >> "$OUTPUT_FILE"
  # ... existing build logic
fi
```

## Benefits Summary

### Immediate Benefits (Phase 2.5A)

✅ **Build Time**: 3-7 minutes faster (mostly Strapi)  
✅ **Image Size**: ~300MB smaller  
✅ **Complexity**: 8 fewer Dockerfiles to maintain  
✅ **CI/CD**: Faster pipelines, less registry storage  
✅ **Updates**: Easier to update (just change image tag)  

### Long-term Benefits

✅ **Security**: Official images get security updates faster  
✅ **Community Support**: Better documentation and community help  
✅ **Reliability**: Battle-tested images used by thousands  
✅ **Maintenance**: Less custom code to maintain  

### Trade-offs

⚠️ **Customization**: Less control over image internals  
⚠️ **Volume Mounts**: Strapi requires source code mount  
⚠️ **TrueNAS Permissions**: Need to verify USER root works via compose  

## Recommendation

**Implement Phase 2.5A immediately:**
1. Simplify all 8 services listed (especially Strapi)
2. Update generate-compose-file.sh to handle both patterns
3. Test on development environment
4. Measure actual build time improvements

**Consider Phase 2.5B later:**
- Mount Loki, Prometheus, Promtail configs as volumes
- Further reduce custom Dockerfiles from 14 → 3
- Only MongoDB, RabbitMQ, and Grafana would remain custom

---

**Total Potential Impact:**
- **Before**: 14 custom Dockerfiles, 5-12 minute builds
- **After Phase 2.5A**: 6 custom Dockerfiles, 2-5 minute builds  
- **After Phase 2.5B**: 3 custom Dockerfiles, 1-3 minute builds

**Combined with Phase 1 & 2**: Total deployment time could drop from 15-20 minutes to 5-8 minutes.
