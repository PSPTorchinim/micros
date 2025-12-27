# TrueNAS Deployment Timeout - Root Cause Analysis & Solutions

## Executive Summary

The TrueNAS deployment timeout is caused by **cumulative healthcheck startup times** across the dependency chain, not missing healthchecks. With a theoretical minimum of **5+ minutes** and potential worst-case of **15+ minutes**, the startup time likely exceeds TrueNAS's internal timeout.

## Dependency Chain Analysis

Generated compose file analysis reveals:
- **24 total services**
- **16 services with dependencies** (66% have deps)
- **4 levels of dependency depth**
- **38 total dependency relationships**

### Startup Sequence

```
Level 0 (8 services - parallel):
├─ mongodb_container     (90s start period)  ⭐ LONGEST
├─ sqlserver             (60s start period)
├─ postgres (strapi_db)  (60s start period)
├─ redis                 (30s start period)
├─ rabbitmq              (60s start period)
├─ loki                  (30s start period)
├─ prometheus            (10s start period)
└─ storybook-dj-panel    (40s start period)

Level 1 (14 services - parallel after Level 0):
├─ strapi                (120s start period) ⭐ LONGEST
├─ identity_be           (60s start period)
├─ music_be              (60s start period)
├─ gear_be               (60s start period)
├─ documents_be          (60s start period)
├─ brand_be              (60s start period)
├─ mailing_be            (60s start period)
├─ party_be              (60s start period)
├─ grafana               (60s start period)
├─ mongodb-exporter      (no healthcheck)
├─ sqlserver-exporter    (no healthcheck)
├─ postgres-exporter     (no healthcheck)
├─ redis-exporter        (no healthcheck)
└─ promtail              (20s start period)

Level 2 (1 service - after all backends):
└─ apigateway            (60s start period)

Level 3 (1 service - final):
└─ dj-panel              (40s start period)
```

## Theoretical Startup Time

### Best Case Scenario
```
Level 0: 90s  (mongodb)
Level 1: 120s (strapi) 
Level 2: 60s  (apigateway)
Level 3: 40s  (dj-panel)
─────────────
TOTAL:   310s (~5.2 minutes)
```

### Realistic Case (with retries & delays)
```
Each level might need:
- 1-2 retry attempts on healthchecks
- Database initialization time
- Network stabilization
- Resource contention

Estimated: 8-12 minutes
```

### Worst Case (resource constrained)
```
Under heavy load or slow I/O:
- Extended healthcheck failures
- Database migration delays
- Memory/CPU pressure

Estimated: 15-20 minutes
```

## Root Causes

1. **Long Start Periods**
   - Strapi: 120s (longest single service)
   - MongoDB: 90s (longest infrastructure)
   - Backend services: 60s each (8 services)

2. **Deep Dependency Chains**
   - 4 levels of sequential dependencies
   - Critical path: mongodb → backend → apigateway → dj-panel

3. **Strict Health Requirements**
   - All 16 dependencies use `service_healthy` condition
   - No use of `service_started` for non-critical deps

## Proposed Solutions

### Solution 1: Optimize Healthcheck Timings (Low Risk)
**Impact:** Reduce startup time by ~40%

Adjust start periods in Dockerfiles:
```dockerfile
# Current
HEALTHCHECK --start-period=120s --interval=30s ...

# Optimized
HEALTHCHECK --start-period=60s --interval=15s --retries=3 ...
```

**Changes needed:**
- `strapi.Dockerfile`: 120s → 60s
- `mongodb.Dockerfile`: 90s → 60s
- All backend services: 60s → 45s

**New theoretical total:** ~200s (3.3 minutes)

### Solution 2: Relax Non-Critical Dependencies (Medium Risk)
**Impact:** Allow parallel startup, reduce time by ~60%

Convert to `service_started` for non-critical services:
```yaml
depends_on:
  loki:
    condition: service_started  # Changed from service_healthy
  prometheus:
    condition: service_started  # Changed from service_healthy
```

**Services to convert:**
- Exporters (mongodb-exporter, sqlserver-exporter, etc.)
- Monitoring (grafana, promtail)
- Optional services (storybook)

**New theoretical total:** ~150s (2.5 minutes)

### Solution 3: Hybrid Approach (Recommended)
**Impact:** Best balance of reliability and speed

Combine both strategies:
1. Optimize healthcheck timings (Solution 1)
2. Relax monitoring/exporter dependencies (Solution 2)
3. Keep critical path strict (databases, backends, gateway, panel)

**Expected result:**
- **Best case:** 2 minutes
- **Realistic case:** 3-4 minutes
- **Worst case:** 6-8 minutes

## Implementation Plan

### Phase 1: Quick Win (Relax Monitoring Dependencies)
File: `Docker/dj-panel-composer.yml`

Change these services from `service_healthy` → `service_started`:
- grafana dependencies: loki, prometheus
- All exporters: mongodb-exporter, sqlserver-exporter, postgres-exporter, redis-exporter
- promtail dependency: loki
- storybook (no dependencies needed)

**Estimated time reduction:** 2-3 minutes
**Risk:** Very low (monitoring services are non-critical)

### Phase 2: Optimize Critical Path (Reduce Start Periods)
Files: Various Dockerfiles

Reduce start periods on critical path:
1. `Docker/infra/strapi.Dockerfile`: 120s → 75s
2. `Docker/infra/mongodb.Dockerfile`: 90s → 60s
3. `Docker/services/dotnet.Dockerfile`: 60s → 45s

**Estimated time reduction:** 1-2 minutes
**Risk:** Low (still conservative timings)

### Phase 3: Fine-tune Based on Testing
- Monitor actual startup times
- Adjust intervals for faster checks (30s → 15s)
- Add retry logic where needed

## Testing Strategy

1. **Local Testing**
   ```bash
   docker compose -f test-compose.yml up --no-build
   # Monitor startup sequence
   # Record actual times for each service
   ```

2. **TrueNAS Testing**
   - Deploy with Phase 1 changes only
   - Monitor TrueNAS logs
   - Verify all services become healthy
   - Record total startup time

3. **Validation**
   - Ensure all healthchecks still pass
   - Verify service functionality
   - Check logs for errors

## Metrics to Track

- Total startup time (TrueNAS app.query state changes)
- Per-service healthcheck timing
- Number of healthcheck retries
- Any timeout errors in logs

## Rollback Plan

If deployment fails:
1. Revert composer.yml changes
2. Use existing backup compose file
3. Redeploy with original strict dependencies
4. Investigate specific service that failed

## Next Steps

1. Implement Phase 1 (relax monitoring dependencies)
2. Test on development environment
3. If successful, proceed with Phase 2
4. Monitor and fine-tune based on results

---

**Generated:** 2025-12-26  
**Analysis Tool:** Docker Compose dependency analyzer  
**Compose File:** dj-panel-composer.yml (24 services)
