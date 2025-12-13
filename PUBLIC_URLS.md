# Public URL Structure

This document describes the URL structure used to access deployed services through Cloudflare tunnels.

## URL Format

The URL format follows a simplified subdomain structure:

### Main Frontend
- **Pattern**: `{env}.djbeatblaster.com`
- **Examples**:
  - Development: `dev.djbeatblaster.com`
  - Staging: `stage.djbeatblaster.com`
  - Production: `prod.djbeatblaster.com`

### Backend Services
- **Pattern**: `{service}.{env}.djbeatblaster.com`
- **Examples**:
  - API Gateway (Dev): `apigateway.dev.djbeatblaster.com`
  - Strapi CMS (Dev): `strapi.dev.djbeatblaster.com`
  - Storybook (Dev): `storybook-dj-panel.dev.djbeatblaster.com`
  - Grafana (Dev): `grafana.dev.djbeatblaster.com`

## Environment Aliases

Long environment names are shortened for cleaner URLs:
- `development` → `dev`
- `production` → `prod`
- `staging` → `stage`

## Implementation

The URL routing is implemented in the GitHub Actions workflow `.github/workflows/cd-build-infrastructure.yml` and includes:

1. **Cloudflare Tunnel Configuration**: Routes incoming requests from public URLs to internal TrueNAS services
2. **DNS CNAME Records**: Automatically created/updated in Cloudflare to point to the tunnel
3. **Maintenance Page Routes**: Cloudflare Workers routes that temporarily show maintenance pages during deployments

## Service Mapping

| Service Name | URL Example (Development) | Notes |
|--------------|---------------------------|-------|
| dj-panel | `dev.djbeatblaster.com` | Main frontend - uses root env subdomain |
| apigateway | `apigateway.dev.djbeatblaster.com` | |
| strapi | `strapi.dev.djbeatblaster.com` | |
| storybook-dj-panel | `storybook-dj-panel.dev.djbeatblaster.com` | Uses hyphenated name from docker-compose |
| grafana | `grafana.dev.djbeatblaster.com` | |

**Note**: Service names in URLs match their names in `docker-compose.yml`, including hyphens.

## Legacy Format

The previous URL format was:
- `dj-panel-{env}-{service}.djbeatblaster.com`
- Example: `dj-panel-development-apigateway.djbeatblaster.com`

This has been replaced with the simpler format described above.
