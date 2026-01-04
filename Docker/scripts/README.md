# Docker Scripts

This directory contains helper scripts for managing the DJ Panel microservices infrastructure.

## Available Scripts

### rebuild-strapi.sh

Rebuilds the Strapi CMS Docker image. Use this after adding or modifying Strapi content types/APIs.

**Usage:**
```bash
./rebuild-strapi.sh [OPTIONS]
```

**Options:**
- `--clean` - Remove volumes before rebuilding (fresh start, **deletes data**)
- `--no-cache` - Build without using Docker cache
- `--no-start` - Don't start services after building
- `--help` - Show help message

**Examples:**
```bash
# Standard rebuild (recommended after code changes)
./rebuild-strapi.sh

# Clean rebuild (if experiencing persistent issues)
./rebuild-strapi.sh --clean

# Rebuild without cache (if build is using stale layers)
./rebuild-strapi.sh --no-cache

# Complete fresh build
./rebuild-strapi.sh --clean --no-cache
```

**When to use:**
- After pulling code changes that add/modify Strapi APIs
- When getting 404 errors on newly added API endpoints
- After modifying Strapi content type schemas
- When Strapi behaves unexpectedly after code changes

**What it does:**
1. Stops the Strapi container
2. Rebuilds the Strapi Docker image from source
3. Starts the Strapi container
4. Waits for health check to confirm it's ready
5. Displays access points and useful commands

## Common Issues

### Problem: 404 on newly added API endpoints

**Solution:** Run `./rebuild-strapi.sh`

**Why:** New APIs require the TypeScript code to be compiled into the Docker image. Without rebuilding, Docker uses a cached image that doesn't include the new code.

### Problem: Changes not reflected after updating code

**Solution:** Run `./rebuild-strapi.sh --no-cache`

**Why:** Docker may be using cached build layers. The `--no-cache` flag forces a complete rebuild.

### Problem: Database migration errors or schema issues

**Solution:** Clean the Strapi volume and rebuild
```bash
# Stop Strapi
docker-compose -f dj-panel-composer.yml stop strapi

# Remove Strapi volume (⚠️ deletes data)
docker volume rm djpanel_strapi_app

# Rebuild
docker-compose -f dj-panel-composer.yml build strapi

# Start
docker-compose -f dj-panel-composer.yml up -d strapi
```

**Why:** Removes the Strapi volume and starts with a fresh database. Only use if you're okay with losing development data.

## Manual Rebuild

If you prefer to rebuild manually:

```bash
cd Docker

# Stop Strapi
docker-compose -f dj-panel-composer.yml stop strapi

# Rebuild
docker-compose -f dj-panel-composer.yml build strapi

# Start
docker-compose -f dj-panel-composer.yml up -d strapi

# Check logs
docker-compose -f dj-panel-composer.yml logs -f strapi
```

## Development Workflow

For active Strapi development:

1. **Make changes** to content types in `CMS/src/api/`
2. **Test locally** (optional):
   ```bash
   cd CMS
   npm install
   npm run develop
   ```
3. **Rebuild Docker image**:
   ```bash
   cd Docker
   ./scripts/rebuild-strapi.sh
   ```
4. **Verify** the changes at http://localhost:1337

## Troubleshooting

For more detailed troubleshooting, see:
- `CMS/TROUBLESHOOTING.md` - Comprehensive troubleshooting guide for Strapi
- Docker logs: `docker-compose -f dj-panel-composer.yml logs strapi`
- Container status: `docker-compose -f dj-panel-composer.yml ps`

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [DJ Panel Microservices Architecture](../../README.md) (if available)
