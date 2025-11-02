# Zero-Downtime Deployment for TrueNAS

This document describes the zero-downtime deployment implementation for DJ Beat Blaster microservices on TrueNAS using Blue-Green deployment strategy.

## Overview

The platform now supports **blue-green deployment** on TrueNAS to ensure zero downtime during deployments:
- ✅ No service interruption during updates
- ✅ Two app instances (blue & green) - one active, one for rollback
- ✅ Manual approval gate before switching traffic
- ✅ Automated health checks before going live
- ✅ Data synchronization handled by shared databases

## Architecture

### TrueNAS Blue-Green Deployment Model

```
┌─────────────────────────────────────────────────────────────┐
│                 TrueNAS Apps State                          │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │  dj-panel-blue   │          │  dj-panel-green  │        │
│  │  (v1.0.0)        │ ◄─Active │  (STOPPED)       │        │
│  │  RUNNING         │          │                  │        │
│  └──────────────────┘          └──────────────────┘        │
│                                                             │
│  Primary aggregator → points to blue.yml                   │
└─────────────────────────────────────────────────────────────┘
                          ↓ Deploy Phase
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │  dj-panel-blue   │ ◄─Active │  dj-panel-green  │        │
│  │  (v1.0.0)        │          │  (v1.1.0)        │        │
│  │  RUNNING         │          │  DEPLOYING       │        │
│  └──────────────────┘          └──────────────────┘        │
│                                                             │
│  Old version serves traffic while new deploys              │
│  Primary aggregator → still points to blue.yml             │
└─────────────────────────────────────────────────────────────┘
                          ↓ After Approval
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │  dj-panel-blue   │          │  dj-panel-green  │ ◄─Active│
│  │  (v1.0.0)        │          │  (v1.1.0)        │        │
│  │  STOPPED         │          │  HEALTHY         │        │
│  └──────────────────┘          └──────────────────┘        │
│                                                             │
│  Traffic switched to new version                           │
│  Primary aggregator → now points to green.yml              │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Workflow

### Phase 1: Current State Detection
1. **Check Current Deployment**
   - Queries TrueNAS via `midclt` to check blue and green app states
   - Identifies which slot (blue/green) is currently active
   - Determines target slot for new deployment

### Phase 2: Deploy to Inactive Slot
2. **Deploy New Version**
   - Generates Docker Compose file with new image tags
   - Uploads to TrueNAS: `/mnt/Files/Apps/DJPanel/{ENV}/Images/`
   - Creates slot-specific aggregator (e.g., `dj-panel-dev-green.yml`)
   - Starts the app in target slot using `midclt call app.start`
   - Old version continues serving traffic (**NO DOWNTIME**)

### Phase 3: Verification
3. **Automated Health Checks**
   - Polls new app state via `midclt call app.query`
   - Waits for `RUNNING`, `ACTIVE`, or `HEALTHY` state
   - Timeout after 120 attempts (10 minutes)
   - If checks fail, old version remains active (zero downtime)

### Phase 4: Manual Approval
4. **Manual Approval Gate**
   - Requires approval in GitHub Actions environment `production-approval`
   - Allows manual testing of new deployment
   - Both slots running temporarily for verification
   - Can reject to keep old version active

### Phase 5: Traffic Switch
5. **Switch Production Traffic**
   - Copies slot-specific aggregator to primary aggregator
   - Example: `cp dj-panel-dev-green.yml dj-panel-dev.yml`
   - Primary aggregator determines which slot serves traffic
   - Instantaneous switch with zero downtime

### Phase 6: Cleanup
6. **Stop Old Deployment**
   - Stops old app slot using `midclt call app.stop`
   - Keeps slot configuration for rollback if needed
   - Old slot can be restarted quickly for emergency rollback

## TrueNAS App Management

### App Naming Convention
```
dj-panel-{env-slug}-{slot}
```

Examples:
- `dj-panel-dev-blue`
- `dj-panel-dev-green`
- `dj-panel-prod-blue`
- `dj-panel-prod-green`

### Aggregator Files
Located in: `/mnt/Files/Apps/DJPanel/{ENV}/Images/`

**Primary aggregator** (serves production traffic):
```yaml
# dj-panel-dev.yml
include:
  - dj-panel-dev-green-20251102-103045.yml
```

**Slot-specific aggregators**:
- `dj-panel-dev-blue.yml` → includes timestamped compose for blue slot
- `dj-panel-dev-green.yml` → includes timestamped compose for green slot

### midclt Commands

**Check app state:**
```bash
midclt call app.query '[["name","=","dj-panel-dev-blue"]]'
```

**Start app:**
```bash
midclt call app.start "dj-panel-dev-blue"
```

**Stop app:**
```bash
midclt call app.stop "dj-panel-dev-blue"
```

**Scale app (alternative):**
```bash
midclt call chart.release.scale "dj-panel-dev-blue" '{"replica_count":1}'
```

## Data Synchronization

### Database Consistency
All services share the same database instances:
- **SQL Server**: Shared instance for .NET microservices
- **MongoDB**: Shared instance for Documents and Mailing services
- **PostgreSQL**: Shared instance for Strapi CMS
- **Redis**: Shared cache instance
- **RabbitMQ**: Shared message queue

Both blue and green slots connect to the **same** database endpoints, ensuring:
- ✅ Data written via one slot is visible in the other
- ✅ No data migration needed during deployment
- ✅ No data loss during traffic switch
- ✅ Stateless services enable seamless switching

## Rollback Procedure

### Automatic Rollback
If new deployment fails health checks:
1. Deployment automatically stops
2. Old slot continues serving traffic
3. No manual intervention required
4. Zero downtime maintained

### Manual Rollback (Quick)
If issues discovered after traffic switch:

**Option 1: Via TrueNAS SSH**
```bash
# SSH to TrueNAS
ssh user@truenas-host

# Start old slot (if stopped)
midclt call app.start "dj-panel-dev-blue"

# Wait for healthy state, then switch primary aggregator
cd /mnt/Files/Apps/DJPanel/Development/Images
cp dj-panel-dev-blue.yml dj-panel-dev.yml

# Stop new slot
midclt call app.stop "dj-panel-dev-green"
```

**Option 2: Via Workflow**
A dedicated rollback workflow will be created separately for one-click rollback.

## Configuration

### GitHub Repository Settings

**Environments:**
Create `production-approval` environment:
1. Go to Settings → Environments
2. Click "New environment"
3. Name: `production-approval`
4. Add required reviewers
5. Configure deployment protection rules

**Variables:**
- `SSH_HOST`: TrueNAS hostname or IP
- `SSH_USERNAME`: SSH username for TrueNAS
- `TRUENAS_LAN_IP`: Internal IP for services
- `BASE_DOMAIN`: Base domain for Cloudflare

**Secrets:**
- `SSH_PASSWORD`: SSH password for TrueNAS
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_EMAIL`: Cloudflare email
- `CLOUDFLARE_API_KEY`: Cloudflare API key
- `CLOUDFLARE_TUNNEL_UUID`: Cloudflare tunnel UUID

## Testing the Implementation

### Test Deployment Flow

1. **Initial Deployment** (Blue slot)
   ```bash
   # Trigger workflow
   gh workflow run cd-build-infrastructure.yml
   
   # Verify blue slot is running
   ssh user@truenas midclt call app.query | grep dj-panel
   ```

2. **Second Deployment** (Green slot)
   ```bash
   # Make a code change and push
   git commit -m "Test blue-green deployment"
   git push origin releases/R25-10
   
   # Workflow automatically detects blue is active
   # Deploys to green slot
   # Blue continues serving traffic
   ```

3. **Verify Zero Downtime**
   ```bash
   # Monitor service availability during deployment
   while true; do
     curl -s -o /dev/null -w "%{http_code}" http://your-service-url
     sleep 1
   done
   # Should show 200 throughout entire deployment
   ```

4. **Approve Traffic Switch**
   - Go to Actions → Running workflow
   - Click "Review deployments"
   - Approve "production-approval"
   - Traffic switches instantly

5. **Verify New Version Active**
   ```bash
   ssh user@truenas cat /mnt/Files/Apps/DJPanel/Dev/Images/dj-panel-dev.yml
   # Should point to green compose file
   ```

## Monitoring

### During Deployment
Monitor in GitHub Actions workflow logs:
- Blue/green state detection
- Target slot deployment
- Health check polls
- Traffic switch confirmation

### TrueNAS App States
Check app states on TrueNAS:
```bash
ssh user@truenas

# List all DJ Panel apps
midclt call app.query | grep dj-panel

# Check specific slot state
midclt call app.query '[["name","=","dj-panel-dev-blue"]]' | jq '.[0].state'
```

### Health Endpoints
If your services expose health endpoints:
```bash
# Check via external port
curl http://truenas-host:PORT/healthz

# Check via Cloudflare tunnel
curl https://dj-panel-dev-service.yourdomain.com/healthz
```

## Troubleshooting

### New Deployment Fails Health Checks

**Symptoms**: Target slot never reaches RUNNING state

**Debug:**
```bash
ssh user@truenas

# Check app state details
midclt call app.query '[["name","=","dj-panel-dev-green"]]'

# Check TrueNAS app logs (if available)
# Path depends on TrueNAS version
```

**Solutions**:
- Verify Docker images are accessible
- Check network connectivity to container registry
- Verify environment variables in compose file
- Check TrueNAS resources (CPU, memory, disk)

### Traffic Not Switching

**Symptoms**: Approval granted but traffic still on old slot

**Debug:**
```bash
ssh user@truenas
cd /mnt/Files/Apps/DJPanel/Development/Images

# Check primary aggregator
cat dj-panel-dev.yml

# Should include new slot compose file
# If not, manually update it
```

### Both Slots Running After Deployment

**Symptoms**: Both blue and green apps show RUNNING

**Debug:**
```bash
# Check which is serving production
ssh user@truenas
cat /mnt/Files/Apps/DJPanel/Development/Images/dj-panel-dev.yml
```

**Solution:**
This is normal during manual approval phase. After approval and traffic switch, old slot is stopped automatically. If old slot remains running:
```bash
midclt call app.stop "dj-panel-dev-OLD_SLOT"
```

## Success Criteria

A successful zero-downtime deployment must meet:

1. ✅ **Zero Downtime**: 100% service availability during deployment
2. ✅ **Automated Health Checks**: New deployment verified before traffic switch
3. ✅ **Manual Gate**: Human approval required before production changes
4. ✅ **Clean Rollback**: Can rollback in < 5 minutes if needed
5. ✅ **Data Consistency**: No data loss or corruption
6. ✅ **Audit Trail**: All actions logged in GitHub Actions

## Comparison: Old vs New

### Old Deployment (With Downtime)
```
1. Stop dj-panel-dev          ← Service DOWN
2. Deploy new version          ← Service DOWN  
3. Start dj-panel-dev          ← Service coming up
4. Wait for healthy            ← Service DOWN/degraded
   
Downtime: 5-10 minutes
```

### New Deployment (Zero Downtime)
```
1. Check active slot (blue)              ← Service UP
2. Deploy to green slot                  ← Service UP (blue serving)
3. Health check green                    ← Service UP (blue serving)
4. Manual approval                       ← Service UP (both slots)
5. Switch primary aggregator to green    ← Service UP (instant switch)
6. Stop blue slot                        ← Service UP (green serving)

Downtime: 0 seconds ✨
```

## Next Steps

After successful testing:

1. **Create Rollback Workflow**
   - Separate workflow for one-click rollback
   - Manual confirmation required
   - Quick switch back to old slot

2. **Add Automated Tests**
   - Integration tests during approval gate
   - Smoke tests after traffic switch
   - Reduce manual testing needs

3. **Monitoring & Alerts**
   - Set up monitoring for both slots
   - Alert on health check failures
   - Track deployment success rate

## Support

For issues or questions:
- Check GitHub Actions workflow logs
- Review TrueNAS app states via `midclt`
- SSH to TrueNAS for manual investigation
- Create issue in repository for help

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Platform**: TrueNAS Scale with Docker Compose
