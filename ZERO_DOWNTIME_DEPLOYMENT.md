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

3. Test Docker Compose
   ├─ Validate YAML syntax
   ├─ Verify required services are defined
   ├─ Check Docker compose config
   └─ Fail fast if compose is invalid

4. Rolling Update
   ├─ Update aggregator to point to new compose
   ├─ Restart TrueNAS app (databases stay running)
   ├─ Application containers restart with new images
   └─ Wait for healthy state

5. Health Checks
   ├─ Poll app state via midclt
   ├─ Wait for RUNNING/HEALTHY status
   └─ Fail if not healthy within 60 minutes

6. Manual Approval
   ├─ Deployment pauses for human verification
   ├─ Approve to complete
   └─ Reject to investigate (app already updated)

7. Update Cloudflare
   ├─ Update tunnel configuration
   └─ Update DNS records

8. Deployment Complete ✅
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

### Automatic Rollback on Deployment Failure

**NEW**: The deployment workflow now includes **automatic rollback** when deployment fails:

✅ **Triggered automatically** when health checks fail during deployment  
✅ **Restores most recent backup** without manual intervention  
✅ **Verifies rollback health** to ensure app is working  
✅ **Maintains service availability** by quickly reverting to known good state  

**What happens during automatic rollback:**

```
1. Deployment Health Check Fails
   └─ Rolling update cannot start app or health checks timeout

2. Automatic Rollback Triggered
   ├─ Finds most recent backup file
   ├─ Restores backup to aggregator
   └─ Restarts TrueNAS application

3. Verify Rollback Health (5 minutes)
   ├─ Monitors app state
   └─ Confirms RUNNING/HEALTHY status

4. Continue Workflow
   ├─ Disables maintenance page
   ├─ Updates Cloudflare tunnel
   └─ Completes with rollback notification
```

**Rollback time:** ~2-3 minutes (automatic)

**⚠️ Important**: If automatic rollback fails, manual intervention is required. Use the manual rollback procedure below.

### Manual Rollback (User-Initiated)

The **preferred method** for user-initiated rollback is to use the automated GitHub Actions workflow, which provides:

✅ **Safety**: Creates a pre-rollback snapshot before proceeding  
✅ **Validation**: Verifies backup exists and app health after rollback  
✅ **Audit Trail**: Full logs of rollback process in GitHub Actions  
✅ **Consistency**: Same process every time, reduces human error  

**How to perform manual rollback:**

1. **Navigate to Actions tab** in GitHub repository
2. **Select "Rollback Deployment" workflow**
3. **Click "Run workflow"**
4. **Configure parameters:**
   - **Environment**: `Development` or `Production`
   - **Backup timestamp**: 
     - Use `latest` for most recent backup (recommended)
     - Or specify exact timestamp like `20241106_143000`
   - **Skip health check**: Leave unchecked (only use for emergency)
5. **Click "Run workflow" to start**

**What happens during manual rollback:**

```
1. List Available Backups
   ├─ Shows all backups for selected environment
   └─ Validates backup file exists

2. Create Pre-Rollback Snapshot
   ├─ Saves current state before rollback
   └─ Allows re-rollback if needed

3. Perform Rollback
   ├─ Restores selected backup to aggregator
   ├─ Restarts TrueNAS app
   └─ Applies previous configuration

4. Verify Health
   ├─ Waits for app to reach healthy state
   ├─ Checks for RUNNING/ACTIVE/HEALTHY status
   └─ Fails if not healthy within 60 minutes

5. Summary
   └─ Displays results and next steps
```

**Rollback time:** ~2-5 minutes (manual) + health check time

**Note:** Cloudflare tunnel configuration may need manual update if the rolled-back version has different service ports.

### Emergency Manual Rollback (SSH)

**⚠️ Use only when GitHub Actions is unavailable or for emergency situations**

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

**Manual rollback time:** < 5 minutes

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

**Solution (Automated):**
1. Go to Actions → "Rollback Deployment"
2. Run workflow with `latest` backup
3. Monitor health check results

**Debug (Manual):**
```bash
ssh user@truenas-host

# Check app state
midclt call app.query '[["name","=","dj-panel-dev"]]'

# Try restarting
midclt call app.restart "dj-panel-dev"

# If still failing, rollback to most recent backup
cd /mnt/Files/Apps/DJPanel/Development/Images/backups
# List backups to find the most recent one
ls -lt dj-panel-dev-backup-*.yml | head -1
# Copy most recent backup (example timestamp)
cp dj-panel-dev-backup-20241106_143000.yml ../dj-panel-dev.yml
midclt call app.restart "dj-panel-dev"
```

### Rollback Workflow Issues

#### Workflow Fails to Find Backups

**Symptoms:** "No backups found" error in workflow

**Causes:**
- First deployment (no backups exist yet)
- Wrong environment selected
- Backup directory not created

**Solution:**
```bash
# SSH to TrueNAS and check backup directory
ssh user@truenas-host
ls -la /mnt/Files/Apps/DJPanel/Development/Images/backups/
ls -la /mnt/Files/Apps/DJPanel/Production/Images/backups/
```

#### Rollback Health Check Fails

**Symptoms:** "App failed to reach healthy state" after rollback

**Causes:**
- Rolled-back version has compatibility issues
- Database state incompatible with old code
- Resource constraints on TrueNAS

**Solution:**
1. Check GitHub Actions logs for specific error
2. SSH to TrueNAS and check app logs:
   ```bash
   midclt call app.query '[["name","=","dj-panel-dev"]]'
   ```
3. If app state is RUNNING but health check failed, the app may actually be healthy
4. Use "Skip health check" option in rollback workflow if needed

#### Backup File Corrupted

**Symptoms:** Error reading backup YAML file

**Causes:**
- Incomplete file write during backup
- Disk space issues
- Permission problems

**Solution:**
1. List all available backups:
   ```bash
   ssh user@truenas-host
   cd /mnt/Files/Apps/DJPanel/Development/Images/backups
   ls -lah dj-panel-dev-backup-*.yml
   ```
2. Use an older backup:
   - Run rollback workflow with specific timestamp
   - Or manually restore: `cp dj-panel-dev-backup-YYYYMMDD_HHMMSS.yml ../dj-panel-dev.yml`

#### Pre-Rollback Snapshot Not Created

**Symptoms:** Warning "No current aggregator file to snapshot"

**Causes:**
- First time running rollback
- Main aggregator file was deleted

**Impact:**
- No snapshot to revert to if rollback needs to be undone
- Safe to proceed if you're confident in rollback

**Solution:**
- This is usually safe to ignore for rollback operations
- If concerned, check current app state before proceeding

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

**Symptoms:** Health checks timeout after 60 minutes

**Possible causes:**
- Large Docker images (slow pull)
- Insufficient resources on TrueNAS
- Database migrations taking too long
- Network connectivity issues
- Container initialization taking longer than expected

**Solutions:**
- Increase timeout in workflow (line 1138: `command_timeout`)
- Add more CPU/RAM to TrueNAS
- Optimize Docker image sizes
- Run heavy migrations separately before deployment
- Check network bandwidth and connectivity

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

### When to Rollback

**Immediate rollback recommended:**
- ❌ Critical functionality broken
- ❌ High error rates in production
- ❌ Data corruption detected
- ❌ Security vulnerability introduced
- ❌ Major performance degradation

**Consider rollback:**
- ⚠️ Non-critical bugs in new features
- ⚠️ UI/UX issues affecting user experience
- ⚠️ Unexpected behavior in edge cases
- ⚠️ Integration failures with external services

**Don't rollback:**
- ✅ Minor cosmetic issues
- ✅ Issues that can be hotfixed quickly
- ✅ Problems only in non-production environments
- ✅ Expected breaking changes with migration plan

### Rollback Best Practices

1. **Always use automated rollback workflow when possible**
   - Safer than manual SSH commands
   - Creates audit trail
   - Validates health automatically

2. **Document the reason for rollback**
   - Add comment in rollback workflow run
   - Create GitHub issue describing the problem
   - Include error logs and screenshots

3. **Communicate with team**
   - Notify team before initiating rollback
   - Update status in team channels
   - Document timeline and impact

4. **After rollback:**
   - Investigate root cause of deployment failure
   - Fix issues in development environment
   - Test thoroughly before redeploying
   - Consider gradual rollout if possible

5. **Backup retention:**
   - Last 5 backups are kept automatically
   - Pre-rollback snapshots allow re-rollback
   - Backups include complete Docker Compose configuration
   - Each backup tagged with commit hash for traceability

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
