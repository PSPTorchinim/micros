#!/bin/bash
# =============================================================================
# DJ Beat Blaster - Development Services Startup Script
# =============================================================================
# This script starts all backend microservices and the frontend for development.
# It's automatically called by the devcontainer postStartCommand.
#
# USAGE:
#   ./scripts/start-services.sh [--wait]
#
# OPTIONS:
#   --wait    Wait for infrastructure services to be healthy before starting apps
#
# LOGS:
#   Each service logs to /tmp/djbb-<service>.log
#   View logs: tail -f /tmp/djbb-*.log
#
# STOP SERVICES:
#   pkill -f "dotnet run" && pkill -f "npm run dev"
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="/tmp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Wait for a service to be healthy
wait_for_service() {
    local name=$1
    local check_cmd=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    log_info "Waiting for $name to be ready..."
    while [ $attempt -le $max_attempts ]; do
        if eval "$check_cmd" > /dev/null 2>&1; then
            log_success "$name is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo ""
    log_warn "$name not ready after $max_attempts attempts, continuing anyway..."
    return 1
}

# Check if services are already running
check_running() {
    if pgrep -f "dotnet run.*IdentityAPI" > /dev/null 2>&1; then
        log_warn "Services appear to be already running. Use 'pkill -f dotnet' to stop them first."
        return 0
    fi
    return 1
}

# Start a .NET service in the background
start_dotnet_service() {
    local name=$1
    local port=$2
    local dir="$PROJECT_ROOT/Services/$name"
    local log_file="$LOG_DIR/djbb-$name.log"
    
    if [ ! -d "$dir" ]; then
        log_warn "Service directory not found: $dir"
        return 1
    fi
    
    log_info "Starting $name on port $port..."
    cd "$dir"
    ASPNETCORE_URLS="http://localhost:$port" nohup dotnet run --no-launch-profile > "$log_file" 2>&1 &
    echo $! > "$LOG_DIR/djbb-$name.pid"
    log_success "$name started (PID: $!, Log: $log_file)"
}

# Start frontend
start_frontend() {
    local dir="$PROJECT_ROOT/Frontends/dj-panel"
    local log_file="$LOG_DIR/djbb-frontend.log"
    
    if [ ! -d "$dir" ]; then
        log_warn "Frontend directory not found: $dir"
        return 1
    fi
    
    log_info "Starting DJ Panel Frontend on port 3080..."
    cd "$dir"
    nohup npm run dev > "$log_file" 2>&1 &
    echo $! > "$LOG_DIR/djbb-frontend.pid"
    log_success "Frontend started (PID: $!, Log: $log_file)"
}

# Main execution
main() {
    log_info "=========================================="
    log_info "DJ Beat Blaster - Starting Development Services"
    log_info "=========================================="
    
    cd "$PROJECT_ROOT"
    
    # Check if already running
    if check_running; then
        log_info "To restart, first run: pkill -f 'dotnet run' && pkill -f 'npm run dev'"
        exit 0
    fi
    
    # Wait for infrastructure if requested
    if [ "$1" = "--wait" ]; then
        log_info "Waiting for infrastructure services..."
        wait_for_service "SQL Server" "echo 'SELECT 1' | sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C -Q 'SELECT 1'" 60
        wait_for_service "MongoDB" "mongosh --host localhost -u admin -p password --authenticationDatabase admin --eval 'db.runCommand({ping:1})'" 30
        wait_for_service "Redis" "redis-cli ping" 30
        wait_for_service "RabbitMQ" "curl -s http://guest:guest@localhost:15672/api/overview" 30
    fi
    
    log_info ""
    log_info "Starting Backend Services..."
    log_info ""
    
    # Start all backend microservices
    start_dotnet_service "IdentityAPI" 5001
    start_dotnet_service "MusicAPI" 5002
    start_dotnet_service "EquipmentAPI" 5003
    start_dotnet_service "DocumentsAPI" 5004
    start_dotnet_service "CompanyAPI" 5005
    start_dotnet_service "PartyAPI" 5006
    start_dotnet_service "MailingAPI" 5007
    start_dotnet_service "DJHostGateway" 3000
    
    log_info ""
    log_info "Starting Frontend..."
    log_info ""
    
    # Start frontend
    start_frontend
    
    log_info ""
    log_info "=========================================="
    log_success "All services started!"
    log_info "=========================================="
    log_info ""
    log_info "Service URLs:"
    log_info "  - API Gateway:    http://localhost:3000"
    log_info "  - Frontend:       http://localhost:3080"
    log_info "  - Identity API:   http://localhost:5001"
    log_info "  - Music API:      http://localhost:5002"
    log_info "  - Equipment API:  http://localhost:5003"
    log_info "  - Documents API:  http://localhost:5004"
    log_info "  - Company API:    http://localhost:5005"
    log_info "  - Party API:      http://localhost:5006"
    log_info "  - Mailing API:    http://localhost:5007"
    log_info ""
    log_info "View logs: tail -f /tmp/djbb-*.log"
    log_info "Stop all:  pkill -f 'dotnet run' && pkill -f 'npm run dev'"
    log_info ""
}

main "$@"
