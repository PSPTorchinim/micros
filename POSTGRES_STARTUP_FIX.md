# PostgreSQL Startup Issues Fix

## Problem
The `strapi_db` (PostgreSQL) service was being created but failing to start properly on TrueNAS, likely due to permission issues with the bind-mounted data directory.

## Root Causes
1. **Permission Mismatch**: PostgreSQL runs as UID 999 (postgres user) but TrueNAS bind mounts may have different ownership
2. **Data Directory Structure**: PostgreSQL expects specific directory permissions (700) for security
3. **Initialization Issues**: The container was failing during database initialization due to permission problems

## Fixes Applied

### 1. Enhanced PostgreSQL Dockerfile
- **User Management**: Properly create postgres user with UID 999 to match expected permissions
- **Directory Setup**: Pre-create data directories with correct permissions
- **Permission Script**: Added initialization script that fixes permissions at startup
- **PGDATA Environment**: Use subdirectory `/var/lib/postgresql/data/pgdata` for better isolation

### 2. Improved Health Checks
- **Longer Timeouts**: Increased from 120s to 180s start period for TrueNAS/ZFS environments
- **More Retries**: Increased from 12 to 20 retries for slow storage
- **Better Checks**: Added actual database query test in addition to `pg_isready`

### 3. Enhanced Monitoring & Debugging
- **Container-Specific Logs**: Added PostgreSQL-specific log capture in deployment script
- **Permission Checking**: Added checks for data directory ownership and permissions
- **Debug Script**: Created comprehensive debug script for manual troubleshooting

### 4. TrueNAS Compatibility Improvements
- **Root Initialization**: Start as root to handle permission fixes, then drop to postgres user
- **Flexible Permissions**: Handle cases where ownership can't be changed due to read-only mounts
- **Better Error Handling**: Graceful fallbacks when permission changes fail

## What the Fix Does

### During Container Startup:
1. **Permission Check**: Automatically checks if data directory has correct ownership
2. **Auto-Fix**: Attempts to fix ownership to `postgres:postgres` (UID:GID 999:999)  
3. **Directory Creation**: Creates `pgdata` subdirectory with correct 700 permissions
4. **Graceful Fallback**: Continues startup even if some permission fixes fail

### Enhanced Monitoring:
1. **Real-time Logs**: Shows PostgreSQL startup logs during deployment
2. **Status Checking**: Displays container status, exit codes, and error messages
3. **Volume Analysis**: Shows mount information and host directory permissions
4. **Process Monitoring**: Checks if PostgreSQL processes are running inside container

## Manual Debugging

If PostgreSQL still fails to start, you can:

### 1. Run the Debug Script
```bash
# SSH to TrueNAS and run:
chmod +x /mnt/Files/Apps/DJPanel/Development/scripts/debug-postgres.sh
/mnt/Files/Apps/DJPanel/Development/scripts/debug-postgres.sh dj-panel-development
```

### 2. Check Container Logs Manually
```bash
# Find PostgreSQL container
docker ps -a | grep strapi_db

# Get detailed logs
docker logs <container-id>
```

### 3. Check Host Permissions
```bash
# Check data directory (replace path with your environment)
ls -la /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data/
stat /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data/
```

### 4. Fix Permissions Manually (if needed)
```bash
# Fix ownership (run as root on TrueNAS)
chown -R 999:999 /mnt/Files/Apps/DJPanel/Development/data/strapi_db/
chmod 755 /mnt/Files/Apps/DJPanel/Development/data/strapi_db/
chmod 700 /mnt/Files/Apps/DJPanel/Development/data/strapi_db/pg_data/
```

## Expected Results

After these fixes, you should see:
- ✅ PostgreSQL container starts successfully
- ✅ Database initializes properly on first run
- ✅ Strapi can connect to PostgreSQL
- ✅ Data persists across container restarts
- ✅ Better error messages if issues occur

The deployment workflow will now show detailed PostgreSQL status and logs, making it much easier to identify and resolve any remaining issues.