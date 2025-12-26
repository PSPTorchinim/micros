# Build Infrastructure Pipeline Documentation

## Overview

The build infrastructure pipeline has been rewritten to implement a comprehensive backup and rollback system with automatic recovery on deployment failures.

## Pipeline Steps

The updated pipeline follows these steps in order:

### 1. Setup Build Configuration
- Determines environment (Development/Production)
- Calculates Docker tags
- Computes environment slug
- Derives base domain

### 2. Setup TrueNAS Directories
- Creates required directory structure on TrueNAS
- Sets proper permissions

### 3. Backup Current State
- **Compose File Backup**: Backs up the current docker-compose configuration
- **Data Volume Backup**: Creates compressed archives of all critical data volumes:
  - MongoDB data and configuration
  - SQL Server data
  - PostgreSQL (Strapi CMS) data
  - Redis data
  - RabbitMQ data
  - Loki logging data
  - Prometheus metrics data
  - Grafana dashboards and configuration

### 4. Stop Application Services
- Gracefully stops all application services
- Keeps database services running to maintain data consistency
- Waits for clean shutdown with timeout

### 5. Calculate Available Ports
- Gets currently used ports on TrueNAS
- Calculates unused internal ports (40000-49999)
- Calculates unused external ports (50000-59999)

### 6. Generate and Upload Compose File
- Generates new docker-compose file with updated configurations
- Creates .env file with all environment variables
- Uploads both files to TrueNAS
- Creates static compose file with include reference

### 7. Create Volume Directories
- Extracts volume paths from compose file
- Creates all required directories
- Sets proper permissions (777 for container access)

### 8. Test Docker Compose
- Validates compose file syntax
- Checks for required services
- Verifies file structure

### 9. Enable Maintenance Page
- Deploys Cloudflare Worker for maintenance mode
- Creates routes for all external services
- Shows maintenance page to users during deployment

### 10. Deploy Updated Services
- Updates aggregator compose file
- Starts or restarts application
- Waits for healthy state (30 minutes timeout)
- Monitors deployment progress

### 11. Update Cloudflare Configuration (On Success)
- Updates Cloudflare Tunnel ingress rules
- Updates DNS CNAME records
- Ensures proper routing to new services

### 12. Disable Maintenance Page (On Success)
- Removes Cloudflare Worker routes
- Deletes maintenance worker
- Restores normal traffic flow

### 13. Automatic Rollback (On Failure)
- Triggered automatically if deployment fails
- Restores previous compose configuration
- Restores data volumes from backup
- Restarts application with restored state
- Sends notification about rollback

## Backup System

### Backup Scripts

#### backup-data-volumes.sh
Creates compressed tar.gz archives of all critical data volumes.

**Usage:**
```bash
./backup-data-volumes.sh "environment" "env_slug" "base_dir"
```

**Features:**
- Backs up 10 critical volume types
- Creates compressed archives with timestamps
- Keeps only last 5 backups per volume
- Outputs backup statistics

#### restore-data-volumes.sh
Restores data volumes from backup archives.

**Usage:**
```bash
./restore-data-volumes.sh "environment" "env_slug" "base_dir" "backup_timestamp"
```

**Features:**
- Restores all backed up volumes
- Removes existing data before restore (clean restore)
- Sets proper permissions after restore
- Outputs restore statistics

#### stop-app-services.sh
Gracefully stops application services.

**Usage:**
```bash
./stop-app-services.sh "app_name"
```

**Features:**
- Stops application using TrueNAS midclt
- Waits for clean shutdown (3 minutes timeout)
- Verifies stopped state
- Returns current app state

## Rollback System

### Manual Rollback

The rollback workflow can be triggered manually:

1. Go to GitHub Actions
2. Select "Rollback Deployment" workflow
3. Click "Run workflow"
4. Specify:
   - Environment (Development/Production)
   - Backup timestamp (YYYYMMDD_HHMMSS) or "latest"
   - Skip health check (optional, for emergencies)

### Automatic Rollback

Automatic rollback is triggered when:
- Deployment fails to reach healthy state
- Application crashes during deployment
- Health checks fail after deployment

**Automatic Rollback Process:**
1. Detects deployment failure
2. Restores previous compose configuration
3. Restores data volumes from backup
4. Restarts application
5. Sends notification about rollback

## Backup Locations

All backups are stored in:
```
/mnt/Files/Apps/DJPanel/{Environment}/Images/backups/
```

### Backup Structure

**Compose Backups:**
```
dj-panel-{env_slug}-backup-{timestamp}.yml
```

**Data Volume Backups:**
```
{env_slug}-{service}_{volume_name}-{timestamp}.tar.gz
```

### Backup Retention

- **Compose backups**: Last 5 backups kept
- **Data volume backups**: Last 5 backups kept per volume type

## Deployment Monitoring

### Health Checks

The deployment waits for the application to reach a healthy state:
- Timeout: 30 minutes
- Check interval: 10 seconds
- Good states: RUNNING, ACTIVE, DEPLOYED, STARTED, HEALTHY

### Rollback Health Checks

After rollback, the system verifies health:
- Timeout: 10 minutes
- Check interval: 5 seconds
- Can be skipped for emergency rollbacks

## Deployment Summary

The deployment summary shows:
- Docker image tag
- Environment details
- Job status (all steps)
- Rollback status (if triggered)
- Final deployment state

## Troubleshooting

### Deployment Fails

1. Check the deployment summary for failed job
2. Review job logs in GitHub Actions
3. If automatic rollback succeeded, verify system state
4. If automatic rollback failed, trigger manual rollback

### Data Backup Fails

- Deployment continues even if data backup fails
- Warning is logged but deployment proceeds
- Manual backup recommended before next deployment

### Rollback Fails

1. Check rollback job logs
2. Verify backup files exist on TrueNAS
3. SSH to TrueNAS and check logs:
   ```bash
   midclt call app.query '[["name","=","dj-panel-{env_slug}"]]'
   ```
4. Manual intervention may be required

### Services Won't Stop

- Pipeline has 3-minute timeout for service stop
- If services don't stop, deployment fails
- Check TrueNAS UI for stuck containers
- Manual cleanup may be required

## Best Practices

1. **Monitor Deployments**: Watch GitHub Actions during deployment
2. **Verify Backups**: Occasionally verify backup files exist and are valid
3. **Test Rollbacks**: Periodically test rollback in Development environment
4. **Keep Backups**: Don't manually delete backup files
5. **Review Logs**: Check deployment logs even on successful deployments

## Security Considerations

1. **Backup Permissions**: Backup files have restricted permissions (600 for .env)
2. **Data Encryption**: Backups are not encrypted (stored on secure TrueNAS)
3. **SSH Access**: Uses SSH password authentication to TrueNAS
4. **Secrets**: All sensitive data stored in GitHub Secrets
5. **Volume Permissions**: Service volumes use 777 permissions for container access

## Performance

- **Backup Time**: ~2-5 minutes depending on data volume size
- **Restore Time**: ~3-7 minutes depending on data volume size
- **Deployment Time**: ~10-15 minutes for successful deployment
- **Rollback Time**: ~5-10 minutes including data restoration

## Future Improvements

Potential enhancements for the pipeline:
1. Backup encryption for sensitive data
2. Incremental backups to reduce storage
3. Backup verification after creation
4. Email/Slack notifications on deployment events
5. Backup size monitoring and cleanup
6. Parallel data volume backups
7. Health check customization per service
