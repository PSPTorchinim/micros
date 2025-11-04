# Zero-Downtime Deployment Strategy

## Overview

This deployment system implements **zero-downtime rolling updates** for TrueNAS, ensuring continuous service availability during deployments.

## Strategy: Rolling Updates with Shared Database

Instead of blue-green deployment with separate instances, we use **rolling updates** where:
- Database containers stay running throughout deployment (never restarted)
- Application service containers update with the new version
- Single TrueNAS app with shared database ensures data consistency
- Backup created before each deployment for rollback capability

## Key Benefits

✅ **Zero Downtime**: Services remain available during updates  
✅ **Shared Database**: No data synchronization issues  
✅ **Simple Architecture**: Single app, not multiple instances  
✅ **Automatic Rollback**: Previous compose files kept for quick recovery  
✅ **Manual Approval**: Human gate before finalizing deployment  

## How It Works

### Deployment Flow

```
1. Backup Current State
   ├─ Save current compose file
   └─ Keep last 5 backups for rollback

2. Generate New Compose
   ├─ Build new Docker images with updated code
   ├─ Generate compose file with new image tags
   └─ Upload to TrueNAS

3. Rolling Update
   ├─ Update aggregator to point to new compose
   ├─ Restart TrueNAS app (databases stay running)
   ├─ Application containers restart with new images
   └─ Wait for healthy state

4. Health Checks
   ├─ Poll app state via midclt
   ├─ Wait for RUNNING/HEALTHY status
   └─ Fail if not healthy within 10 minutes

5. Manual Approval
   ├─ Deployment pauses for human verification
   ├─ Approve to complete
   └─ Reject to investigate (app already updated)

6. Update Cloudflare
   ├─ Update tunnel configuration
   └─ Update DNS records

7. Deployment Complete ✅
```

### Database Behavior

**Databases remain running:**
- SQL Server - no restart
- MongoDB - no restart  
- PostgreSQL - no restart
- Redis - no restart
- RabbitMQ - no restart

**Why this works:**
- Database containers use persistent volumes
- Data persists across application updates
- Network connections re-establish automatically
- No data loss or synchronization needed

### Application Services

**Services that restart:**
- API Gateway
- Identity Backend
- Music Backend
- Gear Backend
- Documents Backend
- Brand Backend
- Party Backend
- Mailing Backend
- Strapi CMS
- DJ Panel Frontend

**During restart:**
- New containers start with updated code
- Connect to running database containers
- Health checks verify connectivity
- Traffic resumes when healthy

## Schema Migrations

### Backward-Compatible Migrations Required

When deploying database schema changes, follow the **Expand-Contract pattern**:

**✅ Safe Migrations:**
- Add new nullable columns
- Add new tables
- Add new indexes
- Extend varchar lengths
- Add new constraints (non-breaking)

**❌ Unsafe Migrations (require multi-step):**
- Remove columns (deploy in next release after code stops using)
- Rename columns (use migration with both old + new)
- Change column types (may require data conversion)
- Add non-null columns without defaults

### Migration Steps

```sql
-- Step 1: Expand (add new schema)
ALTER TABLE users ADD COLUMN new_email VARCHAR(255) NULL;

-- Deploy application that uses new_email

-- Step 2: Migrate data (if needed)
UPDATE users SET new_email = email WHERE new_email IS NULL;

-- Step 3: Contract (remove old schema - in NEXT deployment)
ALTER TABLE users DROP COLUMN email;
```

## Rollback Procedure

### Automatic Rollback

If health checks fail:
- Deployment stops automatically
- App may be in partially updated state
- Use manual rollback to restore previous version

### Manual Rollback

**Via SSH to TrueNAS:**

```bash
# 1. SSH to TrueNAS
ssh user@truenas-host

# 2. Navigate to backup directory
cd /mnt/Files/Apps/DJPanel/Development/Images/backups

# 3. List available backups
ls -lt dj-panel-dev-backup-*.yml

# 4. Copy backup to main aggregator
cp dj-panel-dev-backup-YYYYMMDD_HHMMSS.yml \
   ../dj-panel-dev.yml

# 5. Restart app
midclt call app.restart "dj-panel-dev"

# 6. Verify state
midclt call app.query '[["name","=","dj-panel-dev"]]'
```

**Rollback time:** < 5 minutes

## Docker Image Tagging Strategy

### Commit-Based Tags with Latest Alias

Every build creates **two Docker image tags**:

1. **Commit-based tag** (immutable): `dev-abc1234` or `prod-abc1234`
2. **Latest alias** (updated): `dev-latest` or `prod-latest`

**Example:**
```
ghcr.io/psptorchinim/micros/services/identityapi:dev-abc1234
ghcr.io/psptorchinim/micros/services/identityapi:dev-latest
```

### Benefits

✅ **Precise Rollback**: Backup files contain exact commit hash  
✅ **Immutable History**: Each deployment preserved as unique image  
✅ **Easy Current Version**: `latest` always points to active deployment  
✅ **Automated Cleanup**: Old images can be pruned by retention policy  

### How It Works

**During Build:**
```
1. CI generates commit hash: abc1234
2. Builds Docker image
3. Pushes to both tags:
   - dev-abc1234 (permanent)
   - dev-latest (updated)
```

**During Deployment:**
```
1. Compose file uses dev-abc1234 (specific version)
2. Backup saved with commit hash in filename
3. Rollback restores exact version
```

**Rollback Example:**
```bash
# Backup contains: dev-abc1234
# Restoring automatically uses that specific image
cp dj-panel-dev-backup-20251102_143000.yml ../dj-panel-dev.yml
midclt call app.restart "dj-panel-dev"
# App now runs dev-abc1234, not dev-latest
```

## Configuration

### GitHub Environments

Create environment for manual approval gate:

```yaml
Name: deployment-approval
Protection Rules:
  - Required reviewers: 1+
  - Wait timer: 0 minutes (optional)
```

### Repository Variables

```
SSH_HOST: TrueNAS hostname or IP
SSH_USERNAME: SSH username
TRUENAS_LAN_IP: Internal IP for services
BASE_DOMAIN: Base domain for Cloudflare
```

### Repository Secrets

```
SSH_PASSWORD: SSH password for TrueNAS
CLOUDFLARE_ACCOUNT_ID: Cloudflare account
CLOUDFLARE_EMAIL: Cloudflare email
CLOUDFLARE_API_KEY: Cloudflare API key
CLOUDFLARE_TUNNEL_UUID: Cloudflare tunnel UUID
```

## Monitoring

### Health Checks

The workflow monitors app state:
```bash
# Check app state
midclt call app.query '[["name","=","dj-panel-dev"]]'
```

**Expected states:**
- RUNNING - App is healthy
- ACTIVE - App is operational  
- HEALTHY - All containers healthy
- STARTED - App is starting

**Problem states:**
- STOPPED - App stopped (may need start)
- DEGRADED - Some containers failing
- FAILED - App failed to start

### Logs

**GitHub Actions:** Full deployment logs in workflow run

**TrueNAS App Logs:**
```bash
# View app logs (if available in your TrueNAS version)
midclt call app.logs "dj-panel-dev"
```

## Testing

### Test Deployment

1. Make small code change
2. Commit to release branch (e.g., `releases/R25-11`)
3. CI builds Docker images
4. Trigger "Build TrueNAS Infrastructure" workflow
5. Monitor deployment progress
6. Approve at manual gate
7. Verify services are accessible

### Measure Downtime

```bash
#!/bin/bash
# Monitor service availability during deployment

URL="https://your-service.domain.com"
START=$(date +%s)
DOWNTIME=0

while true; do
  if ! curl -sf "$URL" > /dev/null 2>&1; then
    echo "[$(date '+%H:%M:%S')] ❌ Service DOWN"
    DOWNTIME=$((DOWNTIME + 1))
  else
    echo "[$(date '+%H:%M:%S')] ✅ Service UP"
  fi
  sleep 1
  
  # Stop after 30 minutes
  if [ $(($(date +%s) - START)) -gt 1800 ]; then
    break
  fi
done

echo "Total downtime: ${DOWNTIME} seconds"
```

**Expected result:** 0 seconds downtime (some requests may be slower during container restart)

## Troubleshooting

### App Won't Start After Update

**Symptoms:** App stuck in STARTING or DEGRADED state

**Debug:**
```bash
ssh user@truenas-host

# Check app state
midclt call app.query '[["name","=","dj-panel-dev"]]'

# Try restarting
midclt call app.restart "dj-panel-dev"

# If still failing, rollback
cd /mnt/Files/Apps/DJPanel/Development/Images/backups
cp dj-panel-dev-backup-LATEST.yml ../dj-panel-dev.yml
midclt call app.restart "dj-panel-dev"
```

### Database Connection Errors

**Symptoms:** Services can't connect to database

**Check:**
```bash
# Verify database containers are running
# (This depends on your TrueNAS app structure)

# Check network connectivity
# Containers should be on same Docker network
```

**Solution:**
- Ensure database connection strings are correct
- Verify Docker networks are properly configured
- Check firewall rules on TrueNAS

### Deployment Takes Too Long

**Symptoms:** Health checks timeout after 10 minutes

**Possible causes:**
- Large Docker images (slow pull)
- Insufficient resources on TrueNAS
- Database migrations taking too long

**Solutions:**
- Increase timeout in workflow (line 355)
- Add more CPU/RAM to TrueNAS
- Optimize Docker image sizes
- Run heavy migrations separately before deployment

## Best Practices

### Before Deployment

1. ✅ Test changes in Development environment first
2. ✅ Review database migrations for compatibility
3. ✅ Ensure Docker images build successfully in CI
4. ✅ Check TrueNAS has sufficient resources
5. ✅ Verify backup exists from previous deployment

### During Deployment

1. ✅ Monitor GitHub Actions workflow progress
2. ✅ Check application logs during restart
3. ✅ Verify health checks pass
4. ✅ Test critical functionality before approval
5. ✅ Approve only when confident

### After Deployment

1. ✅ Monitor error rates and performance
2. ✅ Verify all services are accessible
3. ✅ Check database connections
4. ✅ Test user-facing features
5. ✅ Keep backup available for 24 hours

## Comparison with Blue-Green

### Why Not Blue-Green?

Blue-green deployment was considered but has issues with Docker Compose + TrueNAS:

**Problems:**
- Separate blue/green apps have separate database containers
- Data not shared between instances → violates requirement #2
- Syncing data between databases is complex and error-prone
- Risk of data loss during sync period
- Doubles storage requirements
- Schema migration compatibility issues

**Rolling update advantages:**
- Single shared database → data always consistent
- Simpler architecture → easier to maintain
- No data sync needed → no data loss risk
- Smaller storage footprint
- Faster deployments

## Support

For deployment issues:
1. Check GitHub Actions workflow logs
2. SSH to TrueNAS and check app state
3. Review backup files for rollback
4. Create GitHub issue with details

---

**Version:** 2.0.0  
**Strategy:** Rolling Updates with Shared Database  
**Platform:** TrueNAS Scale with Docker Compose
