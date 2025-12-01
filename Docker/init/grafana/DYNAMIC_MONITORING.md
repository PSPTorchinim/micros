# Database Monitoring - Dynamic Configuration Guide

## Overview

The database monitoring system is designed to automatically support multiple instances of each database type without requiring changes to Grafana dashboards.

## How It Works

### Job-Based Service Discovery

Grafana dashboards use Prometheus **job labels** instead of hardcoded instance endpoints. This means:

- All SQL Server exporters should use `job_name: 'sqlserver'`
- All MongoDB exporters should use `job_name: 'mongodb'`  
- All PostgreSQL exporters should use `job_name: 'postgres'`
- All Redis exporters should use `job_name: 'redis'`

The dashboards automatically aggregate metrics from all exporters with the same job name.

## Adding New Database Instances

### Step 1: Add Exporter to Docker Compose

Example adding a second SQL Server:

```yaml
sqlserver-exporter-2:
  image: awaragi/prometheus-mssql-exporter:latest
  restart: unless-stopped
  ports:
    - "4001:4000"  # Different external port
  environment:
    SERVER: sqlserver2
    PORT: 1433
    USERNAME: ${DATABASE_USER_SQLSERVER}
    PASSWORD: ${DATABASE_PASSWORD_SQLSERVER}
  networks:
    - sql_net
    - logging_net
  depends_on:
    sqlserver2:
      condition: service_healthy
```

### Step 2: Update Prometheus Configuration

Edit `Docker/init/prometheus/prometheus.yml`:

```yaml
- job_name: 'sqlserver'  # Same job name as existing
  static_configs:
    # Existing exporter
    - targets: ['sqlserver-exporter:4000']
      labels:
        instance_name: 'primary'
        service: 'sqlserver'
        database_type: 'mssql'
    
    # New exporter - just add to the list
    - targets: ['sqlserver-exporter-2:4001']
      labels:
        instance_name: 'secondary'  # Unique name for this instance
        service: 'sqlserver'
        database_type: 'mssql'
```

### Step 3: Rebuild and Restart

```bash
# Rebuild Prometheus with new config
docker compose -f dj-panel-composer.yml build prometheus

# Restart services
docker compose -f dj-panel-composer.yml up -d prometheus sqlserver-exporter-2
```

### Step 4: Verify

Check Prometheus targets:
```bash
curl http://localhost:9090/api/v1/targets
```

The Grafana dashboards will automatically show metrics from both instances!

## Dashboard Query Examples

### All Instances (Default)
```promql
# Shows connections from ALL SQL Server instances
mssql_connections{job="sqlserver"}
```

### Specific Instance
```promql
# Shows connections from only the primary instance
mssql_connections{job="sqlserver",instance_name="primary"}
```

### Aggregated Metrics
```promql
# Total connections across all SQL Server instances
sum(mssql_connections{job="sqlserver"})

# Connections grouped by instance
sum by (instance_name) (mssql_connections{job="sqlserver"})
```

## Benefits

✅ **No Dashboard Changes**: Add new database instances without touching Grafana dashboards
✅ **Automatic Discovery**: Dashboards automatically show metrics from all instances
✅ **Flexible Queries**: Use `instance_name` label to filter by specific instance
✅ **Easy Scaling**: Add as many database instances as needed
✅ **Consistent Labels**: Use standard job names for all database types

## Label Conventions

Always use these labels in Prometheus configuration:

- `job_name`: Database type (sqlserver, mongodb, postgres, redis)
- `instance_name`: Unique identifier for this instance (primary, secondary, cache-1, etc.)
- `service`: Service name (sqlserver, mongodb, postgres, redis)
- `database_type`: Database type (mssql, mongodb, postgres, redis)

## Troubleshooting

### Metrics not appearing for new instance

1. Check Prometheus targets:
   ```bash
   curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="sqlserver")'
   ```

2. Verify exporter is running:
   ```bash
   docker compose ps | grep exporter
   ```

3. Test exporter endpoint:
   ```bash
   curl http://localhost:4001/metrics
   ```

### Dashboards showing duplicate data

Check that each exporter target has a unique `instance_name` label in Prometheus configuration.

## Migration Guide

If you have existing dashboards with hardcoded instance endpoints:

1. Replace `instance="sqlserver-exporter:4000"` with `job="sqlserver"`
2. Replace `instance="mongodb-exporter:9216"` with `job="mongodb"`
3. Replace `instance="postgres-exporter:9187"` with `job="postgres"`
4. Replace `instance="redis-exporter:9121"` with `job="redis"`

This is already done in all provided dashboard templates.
