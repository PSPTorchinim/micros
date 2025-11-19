# Grafana Permission Issues - Troubleshooting Guide

## Problem
Grafana container fails to start with permission errors:
```
GF_PATHS_DATA='/var/lib/grafana' is not writable.
mkdir: can't create directory '/var/lib/grafana/plugins': Permission denied
```

## Root Cause
The Grafana Docker container runs as user ID 472 (grafana user), but the mounted Docker volume may have different ownership, especially on TrueNAS or other NAS systems. This prevents Grafana from creating necessary directories and files.

## Solutions

### Solution 1: Automatic Fix (Recommended)
The Dockerfile has been updated with a custom entrypoint script that automatically fixes permissions at runtime. Simply rebuild and restart:

```bash
# Rebuild Grafana container
docker-compose -f Docker/dj-panel-composer.yml build grafana

# Stop and restart Grafana
docker-compose -f Docker/dj-panel-composer.yml stop grafana
docker-compose -f Docker/dj-panel-composer.yml up -d grafana
```

### Solution 2: Manual Permission Fix Scripts
If the automatic fix doesn't work, run the appropriate fix script:

**For Linux/macOS:**
```bash
./scripts/fix-grafana-permissions.sh
```

**For Windows (PowerShell):**
```powershell
.\scripts\fix-grafana-permissions.ps1
```

### Solution 3: Manual Docker Commands
Fix permissions manually using Docker:

```bash
# Stop Grafana container
docker-compose -f Docker/dj-panel-composer.yml stop grafana

# Fix permissions using temporary container
docker run --rm -v dj-panel-composer_grafana_data:/var/lib/grafana alpine:latest sh -c "
    apk add --no-cache shadow
    addgroup -g 472 grafana 2>/dev/null || true
    adduser -D -u 472 -G grafana grafana 2>/dev/null || true
    chown -R 472:472 /var/lib/grafana
    chmod -R 755 /var/lib/grafana
    mkdir -p /var/lib/grafana/plugins /var/lib/grafana/dashboards
    chmod 775 /var/lib/grafana/plugins
"

# Restart Grafana
docker-compose -f Docker/dj-panel-composer.yml up -d grafana
```

### Solution 4: TrueNAS Specific
If running on TrueNAS SCALE, you might need to:

1. **Check App Permissions:** In TrueNAS UI, go to Apps → dj-panel → Edit → Storage, ensure the Grafana volume has proper permissions.

2. **Set UID/GID:** In the app configuration, you can set:
   - User ID: 472
   - Group ID: 472

3. **Host Path Alternative:** Instead of using Docker volumes, you can use host path mounts:
   ```yaml
   volumes:
     - /mnt/your-pool/grafana-data:/var/lib/grafana
   ```
   Then set ownership on the host:
   ```bash
   chown -R 472:472 /mnt/your-pool/grafana-data
   ```

## Verification
After applying any solution, check the logs:

```bash
# Check Grafana logs
docker-compose -f Docker/dj-panel-composer.yml logs grafana

# Should see successful startup without permission errors
```

## Prevention
The updated Dockerfile now includes:
- Custom entrypoint script that fixes permissions at runtime
- Pre-created directories with proper ownership
- Explicit environment variables for Grafana paths
- Fallback permission fixes

This should prevent the issue from recurring in future deployments.

## Additional Notes
- User ID 472 is the standard Grafana user in the official Docker image
- The issue is common with Docker volumes on NAS systems
- The custom entrypoint runs as root initially to fix permissions, then switches to the grafana user
- All solutions preserve existing Grafana data and configurations