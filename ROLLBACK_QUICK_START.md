# Rollback Quick Start Guide

## 🚨 Need to Rollback? Here's How

### Quick Steps (2 minutes)

1. **Go to GitHub Actions**
   - Navigate to: https://github.com/PSPTorchinim/micros/actions
   - Click on "Rollback Deployment" workflow

2. **Run the workflow**
   - Click "Run workflow" button
   - Select:
     - **Environment**: Development or Production
     - **Backup timestamp**: `latest` (recommended)
     - **Skip health check**: Leave unchecked
   - Click "Run workflow"

3. **Monitor progress**
   - Watch the workflow execution
   - Review logs for any issues
   - Verify "✅ ROLLBACK SUCCESSFUL" message

4. **Verify**
   - Check that services are accessible
   - Test critical functionality
   - Monitor error rates

**That's it!** The rollback typically completes in 2-5 minutes.

---

## 📋 Workflow Parameters Explained

### Environment
- **Development**: Rolls back dev environment
- **Production**: Rolls back production environment

### Backup Timestamp
- **`latest`** (recommended): Uses the most recent backup
- **Specific timestamp**: Format `YYYYMMDD_HHMMSS`, e.g., `20241106_143000`
  - Find available timestamps in the workflow's "List Available Backups" step

### Skip Health Check
- **Unchecked** (default): Verifies app health after rollback
- **Checked**: Skips verification (use only in emergency)

---

## 🔍 How to Choose a Backup

If you need to rollback to a specific version (not `latest`):

1. Run the workflow once to see available backups
2. Note the timestamp from "List Available Backups" step
3. Cancel the workflow
4. Re-run with specific timestamp

Example backup list:
```
dj-panel-dev-backup-20241106_143000.yml  ← 2 hours ago
dj-panel-dev-backup-20241106_100000.yml  ← 5 hours ago
dj-panel-dev-backup-20241105_180000.yml  ← 1 day ago
```

---

## ⚠️ Common Issues

### "No backups found"
**Solution**: Backups are created during deployments. If this is the first deployment, there are no backups to rollback to.

### "Health check failed"
**Solution**: 
- Check GitHub Actions logs for details
- App may still be functional despite health check failure
- Use "Skip health check" option if you're confident
- Or investigate specific container issues via SSH

### "Backup file not found"
**Solution**:
- Verify environment is correct (Development vs Production)
- Check timestamp format is correct (`YYYYMMDD_HHMMSS`)
- Use `latest` instead of specific timestamp

---

## 🆘 Emergency Manual Rollback

**Only if GitHub Actions is unavailable:**

```bash
# 1. SSH to TrueNAS
ssh user@truenas-host

# 2. Navigate to backups
cd /mnt/Files/Apps/DJPanel/Development/Images/backups

# 3. List backups
ls -lt dj-panel-dev-backup-*.yml

# 4. Restore backup
cp dj-panel-dev-backup-YYYYMMDD_HHMMSS.yml ../dj-panel-dev.yml

# 5. Restart app
midclt call app.restart "dj-panel-dev"
```

---

## 📚 More Information

- **Full Documentation**: [ZERO_DOWNTIME_DEPLOYMENT.md](ZERO_DOWNTIME_DEPLOYMENT.md)
- **Troubleshooting**: [ZERO_DOWNTIME_DEPLOYMENT.md#troubleshooting](ZERO_DOWNTIME_DEPLOYMENT.md#troubleshooting)
- **Best Practices**: [ZERO_DOWNTIME_DEPLOYMENT.md#rollback-best-practices](ZERO_DOWNTIME_DEPLOYMENT.md#rollback-best-practices)

---

## 🎯 What Happens During Rollback?

```
┌─────────────────────────────────────────┐
│ 1. List Available Backups              │
│    Shows all backups for environment    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 2. Validate Backup                      │
│    Confirms backup file exists          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 3. Create Pre-Rollback Snapshot         │
│    Saves current state (safety)         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 4. Restore Backup                       │
│    Copies backup to active config       │
│    Restarts TrueNAS application         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 5. Verify Health (10 min timeout)       │
│    Waits for app to reach healthy state │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ 6. Summary                              │
│    Shows results and status             │
└─────────────────────────────────────────┘
```

---

## 🔐 Safety Features

- ✅ **Pre-rollback snapshot**: Can revert if rollback causes issues
- ✅ **Backup validation**: Ensures backup file exists and is readable
- ✅ **Health verification**: Confirms app is running after rollback
- ✅ **Audit trail**: Complete logs in GitHub Actions
- ✅ **Retention policy**: Last 5 backups always available

---

**Remember**: The automated rollback workflow is safer and faster than manual SSH commands. Always prefer the automated method when possible.
