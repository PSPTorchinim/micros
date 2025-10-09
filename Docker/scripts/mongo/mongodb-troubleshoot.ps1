# MongoDB Troubleshooting Script (PowerShell)
# This script helps diagnose MongoDB connection and authentication issues

Write-Host "=== MongoDB Troubleshooting Script ===" -ForegroundColor Green
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

# Check if MongoDB container is running
Write-Host "1. Checking MongoDB container status..." -ForegroundColor Yellow
try {
    $mongoContainers = docker ps --filter "name=mongodb" --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}"
    if ([string]::IsNullOrWhiteSpace($mongoContainers)) {
        Write-Host "❌ No MongoDB container found running" -ForegroundColor Red
        Write-Host "Available containers:" -ForegroundColor Gray
        docker ps --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}"
    } else {
        Write-Host "✅ MongoDB container status:" -ForegroundColor Green
        Write-Host $mongoContainers
    }
} catch {
    Write-Host "❌ Error checking container status: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Get MongoDB container name
$mongoContainerName = ""
try {
    $mongoContainerName = (docker ps --filter "name=mongodb" --format "{{.Names}}" | Select-Object -First 1).Trim()
    if (![string]::IsNullOrWhiteSpace($mongoContainerName)) {
        Write-Host "MongoDB container name: $mongoContainerName" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Could not determine MongoDB container name" -ForegroundColor Red
}

# Check MongoDB logs
Write-Host "2. Recent MongoDB logs (last 50 lines)..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    if (![string]::IsNullOrWhiteSpace($mongoContainerName)) {
        docker logs --tail 50 $mongoContainerName
    } else {
        Write-Host "❌ Could not retrieve MongoDB logs - no container found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error retrieving logs: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Check environment variables
Write-Host "3. Checking environment variables..." -ForegroundColor Yellow
try {
    if (![string]::IsNullOrWhiteSpace($mongoContainerName)) {
        Write-Host "MongoDB container: $mongoContainerName" -ForegroundColor Cyan
        $envVars = docker exec $mongoContainerName env | Select-String "MONGO"
        if ($envVars) {
            $envVars | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
        } else {
            Write-Host "❌ No MONGO environment variables found" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ No MongoDB container found for environment check" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error checking environment variables: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test MongoDB connection without authentication
Write-Host "4. Testing MongoDB connection (no auth)..." -ForegroundColor Yellow
try {
    if (![string]::IsNullOrWhiteSpace($mongoContainerName)) {
        $result = docker exec $mongoContainerName mongosh --eval "db.adminCommand('ping')" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MongoDB is responding to ping" -ForegroundColor Green
        } else {
            Write-Host "❌ MongoDB is not responding" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ No MongoDB container found for connection test" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing connection: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test MongoDB connection with authentication
Write-Host "5. Testing MongoDB connection (with auth)..." -ForegroundColor Yellow
try {
    if (![string]::IsNullOrWhiteSpace($mongoContainerName)) {
        Write-Host "Attempting to connect with environment credentials..." -ForegroundColor Gray
        
        $rootUsername = docker exec $mongoContainerName env | Select-String "MONGO_INITDB_ROOT_USERNAME" | ForEach-Object { $_.ToString().Split('=')[1] }
        $rootPassword = docker exec $mongoContainerName env | Select-String "MONGO_INITDB_ROOT_PASSWORD" | ForEach-Object { $_.ToString().Split('=')[1] }
        
        if (![string]::IsNullOrWhiteSpace($rootUsername) -and ![string]::IsNullOrWhiteSpace($rootPassword)) {
            Write-Host "Username: $rootUsername" -ForegroundColor Gray
            $result = docker exec $mongoContainerName mongosh --username="$rootUsername" --password="$rootPassword" --authenticationDatabase=admin --eval "db.adminCommand('ping')" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Authenticated connection successful" -ForegroundColor Green
            } else {
                Write-Host "❌ Authenticated connection failed" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Could not find root credentials in environment variables" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ No MongoDB container found for authenticated connection test" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing authenticated connection: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# List databases
Write-Host "6. Listing available databases..." -ForegroundColor Yellow
try {
    if (![string]::IsNullOrWhiteSpace($mongoContainerName) -and ![string]::IsNullOrWhiteSpace($rootUsername) -and ![string]::IsNullOrWhiteSpace($rootPassword)) {
        docker exec $mongoContainerName mongosh --username="$rootUsername" --password="$rootPassword" --authenticationDatabase=admin --eval "db.adminCommand('listDatabases')" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Could not list databases" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Skipping database listing due to missing container or credentials" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error listing databases: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# List users
Write-Host "7. Listing users in admin database..." -ForegroundColor Yellow
try {
    if (![string]::IsNullOrWhiteSpace($mongoContainerName) -and ![string]::IsNullOrWhiteSpace($rootUsername) -and ![string]::IsNullOrWhiteSpace($rootPassword)) {
        docker exec $mongoContainerName mongosh --username="$rootUsername" --password="$rootPassword" --authenticationDatabase=admin --eval "db.getUsers()" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Could not list users" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Skipping user listing due to missing container or credentials" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error listing users: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Check network connectivity
Write-Host "8. Testing network connectivity..." -ForegroundColor Yellow
Write-Host "Checking if MongoDB port 27017 is accessible..." -ForegroundColor Gray
try {
    $tcpTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet
    if ($tcpTest) {
        Write-Host "✅ Port 27017 is accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Port 27017 is not accessible" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Could not test port connectivity: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Docker Compose service health
Write-Host "9. Checking Docker Compose service health..." -ForegroundColor Yellow
try {
    $composeFile = ""
    if (Test-Path "Docker\dj-panel-composer.yml") {
        $composeFile = "Docker\dj-panel-composer.yml"
    } elseif (Test-Path "docker-compose.yml") {
        $composeFile = "docker-compose.yml"
    }
    
    if (![string]::IsNullOrWhiteSpace($composeFile)) {
        Write-Host "Using compose file: $composeFile" -ForegroundColor Gray
        docker compose -f $composeFile ps mongodb_container
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Could not check service status" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ No docker-compose.yml file found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error checking service health: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Troubleshooting Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Common solutions:" -ForegroundColor Cyan
Write-Host "1. If container is not running: docker compose up -d mongodb_container" -ForegroundColor Gray
Write-Host "2. If authentication fails: Check environment variables in .env file" -ForegroundColor Gray
Write-Host "3. If initialization script fails: Remove volumes and recreate: docker compose down -v && docker compose up -d" -ForegroundColor Gray
Write-Host "4. To view initialization logs: docker logs <mongodb_container_name>" -ForegroundColor Gray
Write-Host "5. To manually recreate user: Connect without auth and run user creation commands" -ForegroundColor Gray