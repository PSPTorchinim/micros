# Docker Scripts

## rebuild-clean.sh

**Purpose:** Rebuild Docker images without cache to fix package version compatibility issues.

**When to use:** After package version changes (especially downgrades) that cause runtime TypeLoadException errors.

**Usage:**
```bash
# Rebuild all services
./rebuild-clean.sh

# Rebuild specific service
./rebuild-clean.sh IdentityAPI
```

### Background: Swashbuckle Version Downgrade

This script was created to address a specific issue where:
1. Swashbuckle.AspNetCore was upgraded from 6.9.0 to 10.1.0
2. Then downgraded back to 6.9.0 due to OpenApi compatibility issues
3. Docker cached layers contained old assemblies causing runtime errors:
   ```
   System.TypeLoadException: Method 'Apply' in type 'Shared.Services.Security.AddHeaderParameter' 
   from assembly 'Shared, Version=1.0.0.0' does not have an implementation.
   ```

The `--no-cache` flag ensures Docker downloads fresh NuGet packages instead of using cached layers.

### Troubleshooting

If the error persists after running this script:

1. **Check Docker logs:**
   ```bash
   docker-compose -f dj-panel-composer.yml logs <service-name>
   ```

2. **Nuclear option** (removes everything):
   ```bash
   docker-compose -f dj-panel-composer.yml down -v
   docker system prune -af
   ./rebuild-clean.sh
   ```

3. **Verify package versions** in Services/Shared/Shared.csproj:
   - Swashbuckle.AspNetCore: 6.9.0
   - Microsoft.OpenApi: 1.6.22
   - Microsoft.OpenApi.Readers: 1.6.22
