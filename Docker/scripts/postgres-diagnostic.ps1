# PostgreSQL Diagnostic Script for TrueNAS/Docker troubleshooting (PowerShell)

param(
    [string]$ContainerName = "djpanel-strapi_db-1"
)

Write-Host "=== PostgreSQL Container Diagnostic ===" -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

Write-Host "🔍 Checking container: $ContainerName" -ForegroundColor Yellow

# Check if container is running
$runningContainer = docker ps -q -f "name=$ContainerName" 2>$null
if ($runningContainer) {
    Write-Host "✅ Container is running" -ForegroundColor Green
    
    # Show container logs
    Write-Host ""
    Write-Host "📋 Recent container logs:" -ForegroundColor Yellow
    docker logs --tail 50 $ContainerName
    
    # Check container processes
    Write-Host ""
    Write-Host "🔧 Container processes:" -ForegroundColor Yellow
    try {
        docker exec $ContainerName ps aux 2>$null
    } catch {
        Write-Host "❌ Cannot access container processes" -ForegroundColor Red
    }
    
    # Check data directory
    Write-Host ""
    Write-Host "📁 Data directory status:" -ForegroundColor Yellow
    try {
        docker exec $ContainerName ls -la /var/lib/postgresql/data 2>$null
    } catch {
        Write-Host "❌ Cannot access data directory" -ForegroundColor Red
    }
    
    # Check PGDATA directory
    Write-Host ""
    Write-Host "📁 PGDATA directory status:" -ForegroundColor Yellow
    try {
        docker exec $ContainerName ls -la /var/lib/postgresql/data/pgdata 2>$null
    } catch {
        Write-Host "❌ PGDATA directory not found" -ForegroundColor Red
    }
    
    # Check PostgreSQL status
    Write-Host ""
    Write-Host "🔌 PostgreSQL connection test:" -ForegroundColor Yellow
    try {
        docker exec $ContainerName pg_isready -U "strapi_user" -d "djpanel_strapi_db" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL is ready" -ForegroundColor Green
        } else {
            Write-Host "❌ PostgreSQL not ready" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Cannot test PostgreSQL connection" -ForegroundColor Red
    }
    
    # Check environment variables
    Write-Host ""
    Write-Host "🌍 Environment variables:" -ForegroundColor Yellow
    try {
        docker exec $ContainerName env | Select-String "POSTGRES"
    } catch {
        Write-Host "❌ Cannot access environment" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ Container is not running" -ForegroundColor Red
    
    # Show all containers with postgres/strapi in name
    Write-Host ""
    Write-Host "📋 Related containers:" -ForegroundColor Yellow
    docker ps -a | Select-String -Pattern "(postgres|strapi)"
    
    # Show recent logs if container exists but stopped
    $stoppedContainer = docker ps -aq -f "name=$ContainerName" 2>$null
    if ($stoppedContainer) {
        Write-Host ""
        Write-Host "📋 Last logs from stopped container:" -ForegroundColor Yellow
        docker logs --tail 30 $ContainerName
    }
}

Write-Host ""
Write-Host "=== Diagnostic Complete ===" -ForegroundColor Cyan