# TrueNAS Setup Guide for Zero-Downtime Deployment

## Overview

This guide helps you prepare TrueNAS for automated zero-downtime deployments with the rolling update strategy.

## Prerequisites

### TrueNAS Requirements
- **TrueNAS Scale** (version 22.12 or later)
  - NOT TrueNAS Core (doesn't support Docker Compose apps)
- **SSH access enabled**
- **Sufficient storage** for Docker volumes (databases + applications)

### GitHub Repository Setup
- Repository configured with GitHub Actions
- Secrets and variables properly set

## Automated Setup

The deployment workflow now **automatically creates** the required directory structure on TrueNAS during the first run. You only need to:

1. Enable SSH on TrueNAS
2. Configure GitHub repository settings
3. Run the workflow

### 1. Enable SSH on TrueNAS

**Via TrueNAS Web UI:**

1. Navigate to **System → Services**
2. Find **SSH** service
3. Click the **pencil icon** to configure
4. Enable the following:
   - ☑ Allow Password Authentication
   - ☑ Allow TCP Port Forwarding (optional)
5. Click **Save**
6. Start the SSH service (toggle switch)

**Test SSH Access:**
```bash
ssh your-username@truenas-ip
```

### 2. Configure GitHub Repository

#### Repository Variables

Go to **Settings → Secrets and variables → Actions → Variables**

Create these variables:

| Variable Name | Example Value | Description |
|---------------|---------------|-------------|
| `SSH_HOST` | `192.168.1.100` | TrueNAS IP address or hostname |
| `SSH_USERNAME` | `admin` | TrueNAS SSH username |
| `TRUENAS_LAN_IP` | `192.168.1.100` | TrueNAS internal IP for services |
| `BASE_DOMAIN` | `example.com` | Base domain for Cloudflare DNS |

#### Repository Secrets

Go to **Settings → Secrets and variables → Actions → Secrets**

Create these secrets:

| Secret Name | Description |
|-------------|-------------|
| `SSH_PASSWORD` | TrueNAS SSH password |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_EMAIL` | Cloudflare account email |
| `CLOUDFLARE_API_KEY` | Cloudflare Global API Key |
| `CLOUDFLARE_TUNNEL_UUID` | Cloudflare Tunnel UUID |

#### GitHub Environment

Create deployment approval environment:

1. Go to **Settings → Environments**
2. Click **New environment**
3. Name: `deployment-approval`
4. Configure protection rules:
   - ☑ Required reviewers (add team members)
   - Wait timer: 0 minutes (or as desired)
5. Click **Save protection rules**

### 3. Run First Deployment

**Option 1: Manual Trigger**
1. Go to **Actions** tab
2. Select "Build Artifacts" workflow
3. Click **Run workflow**
4. Select your branch
5. Click **Run workflow**

Then:
1. Wait for artifacts to build
2. Select "Build TrueNAS Infrastructure" workflow
3. Click **Run workflow**
4. Select your branch
5. Click **Run workflow**

**Option 2: Automatic Trigger**
Push to a release branch (e.g., `releases/R25-11`) to trigger both workflows automatically.

## What Happens During First Run

The workflow will automatically:

1. ✅ Create `/mnt/Files/Apps/DJPanel/{Environment}/Images` directory
2. ✅ Create `/mnt/Files/Apps/DJPanel/{Environment}/Images/backups` directory
3. ✅ Set proper permissions (755)
4. ✅ Generate Docker Compose file
5. ✅ Upload compose to TrueNAS
6. ✅ Create TrueNAS app: `dj-panel-{env-slug}`
7. ✅ Start the application
8. ✅ Wait for health checks
9. ✅ Update Cloudflare tunnel
10. ✅ Update DNS records

## Manual Setup (If Needed)

If you prefer to set up directories manually before the first deployment:

```bash
# SSH to TrueNAS
ssh admin@truenas-ip

# Create directory structure for compose files and backups
mkdir -p /mnt/Files/Apps/DJPanel/Development/Images
mkdir -p /mnt/Files/Apps/DJPanel/Development/Images/backups
mkdir -p /mnt/Files/Apps/DJPanel/Staging/Images
mkdir -p /mnt/Files/Apps/DJPanel/Staging/Images/backups
mkdir -p /mnt/Files/Apps/DJPanel/Production/Images
mkdir -p /mnt/Files/Apps/DJPanel/Production/Images/backups

# Create directory structure for persistent data volumes
for env in Development Staging Production; do
  mkdir -p /mnt/Files/Apps/DJPanel/${env}/data
  for volume in mongo_config mongo_data mssql_data pg_data rabbitmq_data redis_data strapi_app loki_data promtail_positions grafana_data; do
    mkdir -p /mnt/Files/Apps/DJPanel/${env}/data/${volume}
  done
done

# Set permissions
chmod -R 755 /mnt/Files/Apps/DJPanel

# Verify
ls -la /mnt/Files/Apps/DJPanel/
```

## Verifying Setup

### Check Directory Structure

```bash
ssh admin@truenas-ip
ls -la /mnt/Files/Apps/DJPanel/Development/
```

Expected output:
```
drwxr-xr-x  4 root  wheel   4 Nov 11 10:00 .
drwxr-xr-x  3 root  wheel   3 Nov 11 10:00 ..
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 Images
drwxr-xr-x 12 root  wheel  12 Nov 11 10:00 data
```

### Check Data Volumes

```bash
ssh admin@truenas-ip
ls -la /mnt/Files/Apps/DJPanel/Development/data/
```

Expected output showing all persistent data directories:
```
drwxr-xr-x 12 root  wheel  12 Nov 11 10:00 .
drwxr-xr-x  4 root  wheel   4 Nov 11 10:00 ..
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 grafana_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 loki_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 mongo_config
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 mongo_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 mssql_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 pg_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 promtail_positions
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 rabbitmq_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 redis_data
drwxr-xr-x  2 root  wheel   2 Nov 11 10:00 strapi_app
```

### Check TrueNAS App

After first deployment:

```bash
ssh admin@truenas-ip
midclt call app.query '[["name","=","dj-panel-dev"]]'
```

Should show app details with state: `RUNNING`

### Check Volume Mounts

The generated Docker Compose file uses bind mounts to TrueNAS datasets instead of Docker volumes. Each volume is mapped to a directory under `/mnt/Files/Apps/DJPanel/{Environment}/data/`.

Example volume configuration:
```yaml
volumes:
  mongo_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/Files/Apps/DJPanel/Development/data/mongo_data
```

This ensures:
- Data persists across container restarts
- Data is stored on TrueNAS datasets for easy backup and management
- Each environment (Development/Staging/Production) has isolated data

## Troubleshooting

### SSH Connection Failed

**Problem:** Workflow fails with "SSH connection refused"

**Solutions:**
1. Verify SSH service is running on TrueNAS
2. Check firewall allows port 22
3. Verify `SSH_HOST` variable is correct
4. Test SSH manually: `ssh username@truenas-ip`

### Permission Denied

**Problem:** Cannot create directories on TrueNAS

**Solutions:**
1. Verify SSH user has sudo/root privileges
2. Check `/mnt/Files` dataset exists and is mounted
3. Try manually: `ssh admin@truenas-ip "mkdir -p /mnt/Files/Apps"`

### Directory Creation Fails

**Problem:** "No such file or directory" error

**Solutions:**
1. Verify dataset `/mnt/Files` is created in TrueNAS
2. Create dataset via TrueNAS UI: **Storage → Pools → Add Dataset**
3. Name it `Files` under your main pool

### App Won't Start

**Problem:** TrueNAS app fails to start

**Solutions:**
1. Check compose file exists:
   ```bash
   ls /mnt/Files/Apps/DJPanel/Development/Images/
   ```
2. Check compose syntax:
   ```bash
   docker compose -f /path/to/compose.yml config
   ```
3. Check TrueNAS logs:
   ```bash
   midclt call app.query '[["name","=","dj-panel-dev"]]'
   ```

## Environment-Specific Apps

The system creates separate apps for each environment:

| Environment | App Name | Directory |
|-------------|----------|-----------|
| Development | `dj-panel-dev` | `/mnt/Files/Apps/DJPanel/Development/` |
| Staging | `dj-panel-staging` | `/mnt/Files/Apps/DJPanel/Staging/` |
| Production | `dj-panel-prod` | `/mnt/Files/Apps/DJPanel/Production/` |

Each app has its own:
- Docker Compose files
- Backup files
- Database volumes
- Application containers

## Backup Management

The workflow automatically:
- Creates backup before each deployment
- Keeps last 5 backups per environment
- Stores in `{Environment}/Images/backups/`

**Manual backup:**
```bash
ssh admin@truenas-ip
cd /mnt/Files/Apps/DJPanel/Development/Images
cp dj-panel-dev.yml backups/dj-panel-dev-backup-$(date +%Y%m%d_%H%M%S).yml
```

## Rolling Back

If deployment fails or issues arise:

```bash
# SSH to TrueNAS
ssh admin@truenas-ip

# Navigate to backups
cd /mnt/Files/Apps/DJPanel/Development/Images/backups

# List available backups
ls -lt dj-panel-dev-backup-*.yml

# Copy desired backup to main aggregator
cp dj-panel-dev-backup-YYYYMMDD_HHMMSS.yml ../dj-panel-dev.yml

# Restart app
midclt call app.restart "dj-panel-dev"

# Verify
midclt call app.query '[["name","=","dj-panel-dev"]]'
```

## Next Steps

After setup is complete:

1. ✅ Test deployment in Development environment
2. ✅ Verify zero-downtime during updates
3. ✅ Test rollback procedure
4. ✅ Monitor first few deployments
5. ✅ Deploy to Staging when confident
6. ✅ Deploy to Production after thorough testing

## Support

If you encounter issues:
1. Check GitHub Actions workflow logs
2. SSH to TrueNAS and check app state
3. Review Docker logs if available
4. Check TrueNAS system logs
5. Create GitHub issue with details

---

**Setup Version:** 1.0.0  
**Last Updated:** November 2025  
**Platform:** TrueNAS Scale 22.12+
