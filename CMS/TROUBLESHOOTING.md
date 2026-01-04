# Strapi CMS Troubleshooting Guide

## 404 Error on New API Endpoints

### Symptom
You get a 404 error when trying to access a Strapi API endpoint (e.g., `/api/profile-block`), even though the API files exist in the codebase.

### Root Cause
The 404 error can occur for two reasons:

1. **Docker image caching**: When new content types or APIs are added to Strapi, the Docker image must be rebuilt to include the compiled TypeScript code. If you run `docker-compose up` without rebuilding, Docker uses a cached image that was built before the new API existed.

2. **Permissions issue (singleType)**: If the endpoint is a singleType (like profile-block, login-block, etc.), permissions must be configured correctly. Prior versions incorrectly added both `.find` and `.findOne` permissions for singleTypes, but singleTypes only support `.find`. This has been fixed to correctly detect singleTypes and only add `.find` permissions.

### Solution

#### Option 1: Rebuild Specific Service (Recommended)
```bash
cd Docker
docker-compose -f dj-panel-composer.yml down strapi
docker-compose -f dj-panel-composer.yml build strapi
docker-compose -f dj-panel-composer.yml up -d strapi
```

#### Option 2: Rebuild All Services
```bash
cd Docker
docker-compose -f dj-panel-composer.yml up --build
```

#### Option 3: Force Complete Rebuild
If the above doesn't work, try a clean rebuild:
```bash
cd Docker

# First, find your volume name (usually <project>_strapi_app)
docker volume ls | grep strapi

# Stop Strapi
docker-compose -f dj-panel-composer.yml stop strapi

# Remove Strapi volume (⚠️ deletes Strapi data only)
# Replace <project-name> with your actual project name (usually 'djpanel')
docker volume rm <project-name>_strapi_app

# Rebuild without cache
docker-compose -f dj-panel-composer.yml build --no-cache strapi

# Start Strapi
docker-compose -f dj-panel-composer.yml up -d strapi
```

**Tip**: The rebuild script handles volume names automatically: `./scripts/rebuild-strapi.sh --clean`

### For Development
If you're actively developing Strapi content types:

1. **Development Mode**: Use `npm run develop` in the CMS directory for hot-reloading
   ```bash
   cd CMS
   npm install
   npm run develop
   ```

2. **Production Mode**: Always rebuild after pulling changes
   ```bash
   cd Docker
   docker-compose -f dj-panel-composer.yml build strapi
   docker-compose -f dj-panel-composer.yml up -d strapi
   ```

### Verification
After rebuilding, verify the API is available:

1. Check Strapi health: `curl http://localhost:1337/api/health`
2. Check API documentation: `http://localhost:1337/swagger` (when running)
3. Check specific endpoint: `curl http://localhost:1337/api/profile-block` (may require authentication)

### Why This Happens
- Strapi auto-discovers APIs from `src/api/*` directories at build time
- New API files must be compiled (TypeScript → JavaScript) during `npm run build`
- Docker caches layers and images to speed up builds
- Without explicit rebuild, Docker reuses the old image that doesn't include new APIs

### Prevention
To avoid this issue in the future:

1. **Always rebuild after pulling code changes** that add new APIs
2. **Use development mode** when actively developing Strapi content types
3. **Check CI/CD pipelines** ensure they rebuild images on code changes
4. **Clear Docker cache periodically** using `docker-compose build --no-cache`

## Other Common Issues

### Database Connection Errors
If you see database connection errors:
```bash
# Ensure database is healthy
docker-compose -f dj-panel-composer.yml ps

# Check database logs
docker-compose -f dj-panel-composer.yml logs strapi_db

# Restart database
docker-compose -f dj-panel-composer.yml restart strapi_db
```

### Permission Errors
If API endpoints return 403 Forbidden:
- Check that public permissions are set correctly in Strapi admin
- Verify the bootstrap seeding ran successfully (check logs)
- Access Strapi admin: `http://localhost:1337/admin`

### Port Conflicts
If ports are already in use:
```bash
# Find what's using port 1337
lsof -i :1337

# Kill the process or change port in docker-compose.yml
```

## Additional Resources
- [Strapi Documentation](https://docs.strapi.io)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- Repository README (if available)
