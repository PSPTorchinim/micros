# MongoDB Authentication Issues - Resolution Guide

## Overview

This guide provides comprehensive solutions for resolving MongoDB authentication issues in the DJ Beat Blaster platform's Docker setup. It covers common problems, root causes, and step-by-step fixes for MongoDB container initialization and user authentication failures.

## Problem Summary

Based on the logs you provided, your MongoDB container is experiencing authentication failures. The logs show:

```
Failed to authenticate ... user:"PSPTorchinim" ... UserNotFound: Could not find user "PSPTorchinim" for db "admin"
```

This indicates that the MongoDB initialization script is not creating the user properly, or the user creation is failing silently.

## Root Causes

1. **Initialization Script Issues**: The original Dockerfile used inline script creation which can fail in certain Docker environments
2. **Environment Variable Access**: ENV variables might not be properly accessible during init script execution
3. **Timing Issues**: The initialization script might run before MongoDB is fully ready
4. **Volume Persistence**: If volumes persist between recreations, the init script won't run again

## Solutions Implemented

### 1. Updated MongoDB Dockerfile

The `mongodb.Dockerfile` has been improved with:

- **Separate initialization script file** (`Docker/init/mongo-init.js`) instead of inline script
- **Better error handling** and logging
- **Enhanced healthcheck** with longer timeout and more retries
- **Additional application databases** pre-creation
- **Robust user existence checking**

### 2. Enhanced Initialization Script

The `Docker/init/mongo-init.js` script now includes:

- Comprehensive logging and error reporting
- User existence verification before creation
- Authentication testing after user creation
- Multiple database creation for application needs
- Better error handling with specific error codes

### 3. Troubleshooting Tools

Created diagnostic scripts:

- **PowerShell**: `Docker/scripts/mongo/mongodb-troubleshoot.ps1`
- **Bash**: `Docker/scripts/mongo/mongodb-troubleshoot.sh`
- **Manual Setup**: `Docker/scripts/mongo/manual-mongo-setup.js`

## Quick Fix Steps

### Step 1: Stop and Remove Current Setup

```powershell
# Stop containers and remove volumes
docker compose -f Docker/dj-panel-composer.yml down -v

# Remove MongoDB containers and images (optional)
docker container prune -f
docker image rm djpanel-mongodb_container 2>$null
```

### Step 2: Rebuild with Updated Configuration

```powershell
# Rebuild MongoDB container with new Dockerfile
docker compose -f Docker/dj-panel-composer.yml build --no-cache mongodb_container

# Start MongoDB container
docker compose -f Docker/dj-panel-composer.yml up -d mongodb_container
```

### Step 3: Monitor Initialization

```powershell
# Watch the logs during startup
docker compose -f Docker/dj-panel-composer.yml logs -f mongodb_container
```

Look for these success messages:

- `✓ Root user "PSPTorchinim" created successfully`
- `✓ Authentication test result: true`
- `✓ MongoDB initialization completed successfully`

### Step 4: Verify Setup

Run the troubleshooting script:

```powershell
.\Docker\scripts\mongo\mongodb-troubleshoot.ps1
```

## Manual Recovery (If Automatic Fails)

If the automatic initialization still fails:

### Option 1: Disable Authentication Temporarily

1. Modify the Dockerfile to comment out `--auth` flag
2. Rebuild container without authentication
3. Connect and manually create users
4. Re-enable authentication

### Option 2: Use Manual Setup Script

```powershell
# Copy the script into the container and run it
docker cp Docker/scripts/mongo/manual-mongo-setup.js <mongodb_container>:/tmp/
docker exec -it <mongodb_container> mongosh /tmp/manual-mongo-setup.js
```

### Option 3: Interactive Manual Setup

```powershell
# Connect to MongoDB shell
docker exec -it <mongodb_container> mongosh

# In the MongoDB shell, run:
use admin
db.createUser({
  user: "PSPTorchinim",
  pwd: "your_password_here",
  roles: [
    { role: "root", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "userAdminAnyDatabase", db: "admin" }
  ]
})
```

## Environment Variables Check

Ensure your `.env` file contains:

```env
DATABASE_USER_MONGODB=PSPTorchinim
DATABASE_PASSWORD_MONGODB=your_secure_password_here
DATABASE_HOST_MONGODB=mongodb_container
DATABASE_PORT_MONGODB=27017
```

## Common Issues and Solutions

### Issue: "No MONGO environment variables found"

**Solution**: Check that build args are properly passed in docker-compose.yml

### Issue: "Authentication test failed"

**Solution**: Verify password complexity and special characters don't need escaping

### Issue: "User already exists but can't authenticate"

**Solution**: Drop and recreate user with updated password

### Issue: "Initialization script not running"

**Solution**: Remove volumes completely and rebuild from scratch

## Verification Commands

After setup, verify with:

```powershell
# Test basic connectivity
docker exec <mongodb_container> mongosh --eval "db.adminCommand('ping')"

# Test authenticated connection
docker exec <mongodb_container> mongosh --username "PSPTorchinim" --password "your_password" --authenticationDatabase admin --eval "db.adminCommand('ping')"

# List databases
docker exec <mongodb_container> mongosh --username "PSPTorchinim" --password "your_password" --authenticationDatabase admin --eval "db.adminCommand('listDatabases')"

# List users
docker exec <mongodb_container> mongosh --username "PSPTorchinim" --password "your_password" --authenticationDatabase admin --eval "db.getUsers()"
```

## Next Steps

1. **Update Application Connection Strings**: Ensure your .NET applications use the correct credentials
2. **Test Application Connectivity**: Verify each microservice can connect to MongoDB
3. **Monitor Logs**: Watch for any remaining authentication errors
4. **Backup Strategy**: Implement regular MongoDB backups once working

## Support

If issues persist:

1. Run the troubleshooting script and share output
2. Check Docker daemon logs
3. Verify Docker version compatibility
4. Check available system resources (memory, disk space)

The updated configuration should resolve the authentication issues you're experiencing. The enhanced logging will also make it easier to diagnose any remaining problems.

---

**Developed by PSPTorchinim**
