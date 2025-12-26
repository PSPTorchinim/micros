# Docker Optimization Quick Reference

## Quick Start

### Building with Optimizations
```bash
# Enable BuildKit for cache mounts
export DOCKER_BUILDKIT=1

# Build all services
docker compose -f Docker/dj-panel-composer.yml build

# Build specific service
docker compose -f Docker/dj-panel-composer.yml build strapi
```

### Starting Services
```bash
# Start all services with resource limits
docker compose -f Docker/dj-panel-composer.yml up -d

# Check service health
docker compose -f Docker/dj-panel-composer.yml ps

# View logs
docker compose -f Docker/dj-panel-composer.yml logs -f [service-name]
```

## Key Changes Summary

### Health Check Intervals
| Previous | New | Savings |
|----------|-----|---------|
| 10 seconds | 30 seconds | 66% reduction |

### Start Periods
| Service Type | Previous | New | Improvement |
|--------------|----------|-----|-------------|
| Databases | 90-120s | 60-90s | 25-33% faster |
| Backend Services | 90s | 60s | 33% faster |
| Frontend | 30s | 40s | More reliable |
| Strapi | 180s | 120s | 33% faster |

### Resource Limits
| Service Type | CPU Limit | Memory Limit | Examples |
|--------------|-----------|--------------|----------|
| Databases | 2.0 | 2GB | postgres, mongodb, sqlserver |
| Backend Services | 0.5 | 512MB | identity_be, music_be, etc. |
| Frontend | 0.5 | 512MB | dj-panel, storybook |
| API Gateway | 1.0 | 1GB | apigateway |
| Monitoring | 0.25-0.5 | 256-512MB | prometheus, grafana, etc. |

## Troubleshooting

### Service Won't Start
1. Check logs: `docker compose logs [service-name]`
2. Verify dependencies are healthy: `docker compose ps`
3. If health check fails, check `start_period` is sufficient
4. Review resource limits - may need adjustment

### Build is Slow
1. Verify BuildKit is enabled: `echo $DOCKER_BUILDKIT` should return `1`
2. First build is always slow - subsequent builds use cache
3. Clear build cache if needed: `docker builder prune`

### Health Check Failing
1. Service may need more startup time - increase `start_period`
2. Check health check command works: `docker compose exec [service] [health-check-command]`
3. Review service logs for startup errors

### Out of Memory
1. Check resource usage: `docker stats`
2. May need to increase memory limits in compose file
3. Verify host has sufficient memory

### Cache Not Working
1. Ensure BuildKit is enabled
2. Check cache mounts in Dockerfile are correct
3. Clear cache and rebuild: `docker builder prune --all`

## Monitoring Commands

```bash
# View resource usage
docker stats

# Check health of all services
docker compose ps

# View health check results
docker inspect [container-id] | grep -A 10 Health

# Follow logs for specific service
docker compose logs -f [service-name]

# View all service dependencies
docker compose config
```

## Performance Tips

### For Fastest Builds
1. Keep BuildKit enabled: `export DOCKER_BUILDKIT=1`
2. Don't change dependencies frequently
3. Use cache mounts (already configured)
4. Build only changed services

### For Fastest Startup
1. Start databases first: `docker compose up -d mongodb_container strapi_db redis rabbitmq sqlserver`
2. Then start backend services
3. Finally start frontend services
4. Use `docker compose up -d` to start all at once (recommended)

### For Development
```bash
# Watch logs of multiple services
docker compose logs -f dj-panel strapi apigateway

# Restart single service
docker compose restart [service-name]

# Rebuild and restart service
docker compose up -d --build [service-name]
```

## Resource Allocation

### Total Maximum (All Services Running)
- **CPU**: ~13.5 cores
- **Memory**: ~14 GB
- **Minimum Host Specs**: 16 cores, 16GB RAM recommended

### Minimum Reserved (Guaranteed)
- **CPU**: ~4 cores
- **Memory**: ~5 GB

## Health Check Details

### Database Services
- **Interval**: 30 seconds
- **Timeout**: 10-15 seconds
- **Start Period**: 60-90 seconds
- **Retries**: 5

### Backend Services
- **Interval**: 30 seconds
- **Timeout**: 5 seconds
- **Start Period**: 60 seconds
- **Retries**: 5

### Frontend Services
- **Interval**: 30 seconds
- **Timeout**: 5 seconds
- **Start Period**: 40 seconds
- **Retries**: 3

### Strapi CMS
- **Interval**: 30 seconds
- **Timeout**: 15 seconds
- **Start Period**: 120 seconds
- **Retries**: 5

## Common Issues & Solutions

### "Service Unhealthy" Error
**Cause**: Health check failing
**Solution**: 
1. Increase `start_period` in compose file
2. Check service logs: `docker compose logs [service]`
3. Verify health check endpoint is correct

### "Not Enough Memory" Error
**Cause**: Resource limit too low
**Solution**: 
1. Check actual usage: `docker stats`
2. Increase `memory` limit in compose file
3. Or reduce `memory` reservation

### "Build Cache Not Working"
**Cause**: BuildKit not enabled or cache cleared
**Solution**:
1. Enable BuildKit: `export DOCKER_BUILDKIT=1`
2. Verify in build output: should see `=> [internal] load build definition`
3. Add to shell profile for persistence

### "Service Dependency Failed"
**Cause**: Dependent service not healthy
**Solution**:
1. Check all dependencies: `docker compose ps`
2. Start dependencies first if needed
3. Review `depends_on` conditions in compose file

## Additional Resources

- **Full Documentation**: See `DOCKER_OPTIMIZATION_SUMMARY.md`
- **Docker Compose Spec**: https://docs.docker.com/compose/compose-file/
- **BuildKit Guide**: https://docs.docker.com/build/buildkit/
- **Health Checks**: https://docs.docker.com/compose/compose-file/compose-file-v3/#healthcheck

## Support

For issues or questions:
1. Check logs first: `docker compose logs [service]`
2. Review this quick reference
3. Consult `DOCKER_OPTIMIZATION_SUMMARY.md`
4. Check GitHub issues for similar problems
5. Contact DevOps team if needed

---

Last Updated: December 2024
Version: 1.0
