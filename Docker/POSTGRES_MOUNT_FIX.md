# PostgreSQL Mount Issue Troubleshooting Guide

## Problem Analysis

The error message indicates a Docker mount issue:
```
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "/mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data" to rootfs at "/var/lib/postgresql/data": change mount propagation through procfd: open o_path procfd: open /mnt/.ix-apps/docker/overlay2/.../merged/var/lib/postgresql/data: no such file or directory: unknown
```

## Root Cause

The issue occurs because:
1. PostgreSQL Dockerfile sets `PGDATA=/var/lib/postgresql/data/pgdata` (subdirectory)
2. Docker compose mounts `pg_data:/var/lib/postgresql/data` (parent directory)
3. The mount path transformation creates the correct host path but Docker can't create the mount point inside the container

## Fixes Applied

### 1. Updated `generate-compose-file.sh`
- **Unified volume handling**: All services use identical volume transformation logic
- **No special cases**: Removed PostgreSQL-specific detection and handling
- **Dynamic path generation**: `{BASE_DIR}/data/{service}/{volume_name}:{container_path}`
- **Path agnostic**: Works with any container path structure

### 2. Updated `postgres.Dockerfile`
- Enhanced initialization script with better logging and error handling
- Added explicit PGDATA directory creation and permission handling
- Improved mount point validation and troubleshooting output

### 3. Updated CD workflow (`cd-build-infrastructure.yml`)
- **No path validation**: Creates any directory structure dynamically
- **Universal permissions**: Sets 777 permissions for all volume directories
- **Opportunistic subdirectories**: Creates common subdirs (`pgdata`, `data`, `logs`) just in case
- **Fail-safe approach**: Continues even if some operations fail

## Verification Steps

1. **Check if directories are created correctly:**
   ```bash
   ls -la /mnt/Files/Apps/DJPanel/Development/data/strapi_db/
   # Should show: pg_data/ directory
   
   ls -la /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data/
   # Should show: pgdata/ subdirectory with 700 permissions
   ```

2. **Verify the generated compose file:**
   ```bash
   # Check the volume mount in the generated compose
   grep -A5 -B5 "strapi_db:" /path/to/generated-compose.yml
   # Should show: /mnt/.../pg_data:/var/lib/postgresql/data
   ```

3. **Monitor PostgreSQL container logs:**
   ```bash
   docker logs ix-dj-panel-development-strapi_db-1
   # Should show PostgreSQL initialization messages without mount errors
   ```

## Expected Behavior After Fix

1. **Dynamic volume mounts**: `{BASE_DIR}/data/{service}/{volume}:{container_path}`
2. **Example**: `/mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data:/var/lib/postgresql/data`
3. **Universal approach**: All services (PostgreSQL, MongoDB, Redis, etc.) use same pattern
4. **Container handles internals**: Each service manages its own directory structure
5. **Auto-created subdirectories**: Common subdirs created opportunistically (`pgdata`, `data`, `logs`)

## Rollback Plan

If issues persist, you can temporarily:
1. Use the original compose file with Docker volumes instead of bind mounts
2. Or manually create the directory structure:
   ```bash
   mkdir -p /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data/pgdata
   chmod 755 /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data
   chmod 700 /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data/pgdata
   ```

## Next Deployment

The fixes will be applied on the next CI/CD run. The deployment process will:
1. Generate a new compose file with corrected PostgreSQL volume mounts
2. Create the proper directory structure on TrueNAS
3. Set appropriate permissions for PostgreSQL operation
4. Deploy with zero-downtime rolling updates