# Public URL Structure

This document describes the URL structure used to access deployed services through Cloudflare tunnels.

## URL Format

The URL format follows a simplified subdomain structure:

### Main Frontend
- **Pattern**: `{env}.djbeatblaster.com` (or just `djbeatblaster.com` for production)
- **Examples**:
  - Development: `dev.djbeatblaster.com`
  - Test: `test.djbeatblaster.com`
  - Staging: `stage.djbeatblaster.com`
  - PreProduction: `preprod.djbeatblaster.com`
  - Production: `djbeatblaster.com`

### Backend Services
- **Pattern**: `{service}.{env}.djbeatblaster.com` (or `{service}.djbeatblaster.com` for production)
- **Examples**:
  - API Gateway (Dev): `apigateway.dev.djbeatblaster.com`
  - API Gateway (Test): `apigateway.test.djbeatblaster.com`
  - API Gateway (PreProd): `apigateway.preprod.djbeatblaster.com`
  - API Gateway (Prod): `apigateway.djbeatblaster.com`
  - Strapi CMS (Dev): `strapi.dev.djbeatblaster.com`
  - Storybook (Dev): `storybook-dj-panel.dev.djbeatblaster.com`
  - Grafana (Dev): `grafana.dev.djbeatblaster.com`

## Environment Aliases

Long environment names are shortened for cleaner URLs:
- `development` → `dev`
- `test` → `test` (no change)
- `staging` → `stage`
- `preproduction` → `preprod`
- `production` → *(empty - uses root domain)*

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

## Complete Environment Examples

Below are complete URL examples for all supported environments:

### Development (`dev`)
- Main: `dev.djbeatblaster.com`
- API Gateway: `apigateway.dev.djbeatblaster.com`
- Strapi: `strapi.dev.djbeatblaster.com`
- Grafana: `grafana.dev.djbeatblaster.com`
- Storybook: `storybook-dj-panel.dev.djbeatblaster.com`

### Test (`test`)
- Main: `test.djbeatblaster.com`
- API Gateway: `apigateway.test.djbeatblaster.com`
- Strapi: `strapi.test.djbeatblaster.com`
- Grafana: `grafana.test.djbeatblaster.com`
- Storybook: `storybook-dj-panel.test.djbeatblaster.com`

### Staging (`stage`)
- Main: `stage.djbeatblaster.com`
- API Gateway: `apigateway.stage.djbeatblaster.com`
- Strapi: `strapi.stage.djbeatblaster.com`
- Grafana: `grafana.stage.djbeatblaster.com`
- Storybook: `storybook-dj-panel.stage.djbeatblaster.com`

### PreProduction (`preprod`)
- Main: `preprod.djbeatblaster.com`
- API Gateway: `apigateway.preprod.djbeatblaster.com`
- Strapi: `strapi.preprod.djbeatblaster.com`
- Grafana: `grafana.preprod.djbeatblaster.com`
- Storybook: `storybook-dj-panel.preprod.djbeatblaster.com`

### Production (root domain)
- Main: `djbeatblaster.com`
- API Gateway: `apigateway.djbeatblaster.com`
- Strapi: `strapi.djbeatblaster.com`
- Grafana: `grafana.djbeatblaster.com`
- Storybook: `storybook-dj-panel.djbeatblaster.com`

## Legacy Format

The previous URL format was:
- `dj-panel-{env}-{service}.djbeatblaster.com`
- Example: `dj-panel-development-apigateway.djbeatblaster.com`

This has been replaced with the simpler format described above.
