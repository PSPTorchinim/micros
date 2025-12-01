# Fix Grafana permissions on Docker volume (PowerShell version)
# Run this script if you continue having permission issues

Write-Host "Fixing Grafana volume permissions..." -ForegroundColor Green

try {
    # Get the Docker volume path
    $volumeInfo = docker volume inspect dj-panel-composer_grafana_data 2>$null | ConvertFrom-Json
    $volumePath = $volumeInfo[0].Mountpoint
    
    if (-not $volumePath) {
        Write-Host "Could not find grafana_data volume. Creating it..." -ForegroundColor Yellow
        docker volume create dj-panel-composer_grafana_data
        $volumeInfo = docker volume inspect dj-panel-composer_grafana_data | ConvertFrom-Json
        $volumePath = $volumeInfo[0].Mountpoint
    }
    
    Write-Host "Volume path: $volumePath" -ForegroundColor Cyan
    
    # Use Docker container to fix permissions since direct access may not work on Windows
    Write-Host "Using Docker container to fix permissions..." -ForegroundColor Yellow
    
    $fixScript = @"
apk add --no-cache shadow
addgroup -g 472 grafana || true
adduser -D -u 472 -G grafana grafana || true
chown -R 472:472 /var/lib/grafana
chmod -R 755 /var/lib/grafana
mkdir -p /var/lib/grafana/plugins
mkdir -p /var/lib/grafana/dashboards
mkdir -p /var/lib/grafana/alerting
mkdir -p /var/lib/grafana/png
chmod 775 /var/lib/grafana/plugins
ls -la /var/lib/grafana
echo 'Permissions fixed successfully!'
"@
    
    docker run --rm -v "dj-panel-composer_grafana_data:/var/lib/grafana" alpine:latest sh -c $fixScript
    
    Write-Host "Permissions fixed using Docker container!" -ForegroundColor Green
    Write-Host "You can now restart your Grafana container." -ForegroundColor Green
    
} catch {
    Write-Host "Error fixing permissions: $_" -ForegroundColor Red
    Write-Host "Make sure Docker is running and you have the necessary permissions." -ForegroundColor Yellow
}