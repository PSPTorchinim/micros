# Docker Image Troubleshooting Guide

## Problem: "manifest unknown" Error During Deployment

If you encounter errors like this during TrueNAS deployment:

```
sqlserver Error manifest unknown
apigateway Error context canceled
brand_be Error context canceled
...
Error response from daemon: manifest unknown
```

This means the Docker images for your branch haven't been built and pushed to the GitHub Container Registry (GHCR) yet.

## Root Cause

The **Build Infrastructure** workflow tries to pull Docker images with tags like:
- `dev-{commit_hash}` (for development branches)  
- `prod-{commit_hash}` (for production branch)

But these images only exist after the **Build Artifacts** workflow has successfully run for your specific commit.

## Solution

### Step 1: Run Build Artifacts Workflow
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **Build Artifacts** workflow from the left sidebar
4. Click **Run workflow** button
5. Select your current branch (e.g., `copilot/add-volume-mounts-support`)
6. Click **Run workflow**

### Step 2: Wait for Completion
The Build Artifacts workflow will:
- Build all .NET microservices
- Build React frontends  
- Build infrastructure images (MongoDB, SQL Server, etc.)
- Push all images to GHCR with your commit tag

Wait until all jobs show ✅ green checkmarks.

### Step 3: Re-run Deployment
Once Build Artifacts completes successfully:
1. Go back to **Actions**
2. Select **Build TrueNAS Infrastructure** workflow
3. Click **Run workflow** and select your branch
4. The deployment should now work correctly

## Prevention

For future deployments, always ensure:
1. **Build Artifacts** runs first (automatically or manually)  
2. Wait for it to complete successfully
3. Then run **Build Infrastructure**

## Automatic Triggers

The workflows are configured to run automatically:
- **Build Artifacts**: Triggered on schedule and workflow_dispatch
- **Build Infrastructure**: Triggered after Build Artifacts completes successfully

But for feature branches, you may need to trigger **Build Artifacts** manually first.

## Branch-Specific Tags

Different branches use different image tags:
- `main` / development branches: `dev-{commit}`
- `production` branch: `prod-{commit}`

Make sure you're building images for the correct branch you're deploying from.