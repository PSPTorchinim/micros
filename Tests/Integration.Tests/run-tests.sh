#!/bin/bash

# Integration Tests Runner Script
# This script helps run different levels of integration tests for the Micros platform

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
TEST_PROJECT="$PROJECT_ROOT/Tests/Integration.Tests/Integration.Tests.csproj"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}"
}

print_info() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

show_usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Run integration tests for the Micros platform.

OPTIONS:
    quick       Run quick validation tests (default)
                - Docker Compose configuration validation
                - Environment file validation
                - Dockerfile existence checks
    
    build       Run Docker image build tests
                - Tests building all Docker images
                - WARNING: This is slow and requires Docker
    
    system      Run full system integration tests
                - Starts the entire Docker Compose environment
                - Tests service health and connectivity
                - WARNING: Very slow, requires Docker and lots of resources
    
    all         Run all tests (quick + build + system)
                - WARNING: Extremely slow!
    
    help        Show this help message

EXAMPLES:
    $(basename "$0")              # Run quick tests
    $(basename "$0") quick        # Run quick tests
    $(basename "$0") build        # Run build tests
    $(basename "$0") system       # Run full system tests
    $(basename "$0") all          # Run everything

NOTES:
    - Quick tests run in seconds and don't require Docker
    - Build tests can take 10-30 minutes depending on your system
    - System tests can take 5-15 minutes and require significant resources
    - Make sure Docker is running before executing build or system tests

EOF
}

run_quick_tests() {
    print_header "Running Quick Validation Tests"
    print_info "These tests validate Docker Compose configuration and environment files..."
    
    cd "$PROJECT_ROOT"
    dotnet test "$TEST_PROJECT" \
        --filter "Category!=Integration&Speed!=Slow&Speed!=VerySlow" \
        --logger "console;verbosity=normal"
    
    echo ""
    print_info "✓ Quick tests completed successfully!"
}

run_build_tests() {
    print_header "Running Docker Build Tests"
    print_info "WARNING: These tests will build Docker images and may take 10-30 minutes..."
    print_info "Press Ctrl+C within 5 seconds to cancel..."
    sleep 5
    
    cd "$PROJECT_ROOT"
    dotnet test "$TEST_PROJECT" \
        --filter "Speed=Slow" \
        --logger "console;verbosity=normal"
    
    echo ""
    print_info "✓ Build tests completed!"
}

run_system_tests() {
    print_header "Running Full System Integration Tests"
    print_info "WARNING: These tests will start the entire Docker environment..."
    print_info "This requires significant resources and may take 5-15 minutes."
    print_info "Press Ctrl+C within 5 seconds to cancel..."
    sleep 5
    
    cd "$PROJECT_ROOT"
    dotnet test "$TEST_PROJECT" \
        --filter "Speed=VerySlow" \
        --logger "console;verbosity=normal"
    
    echo ""
    print_info "✓ System tests completed!"
}

run_all_tests() {
    print_header "Running ALL Integration Tests"
    print_info "WARNING: This will run all tests and may take 30-60 minutes!"
    print_info "Press Ctrl+C within 10 seconds to cancel..."
    sleep 10
    
    run_quick_tests
    echo ""
    run_build_tests
    echo ""
    run_system_tests
    
    echo ""
    print_header "ALL TESTS COMPLETED SUCCESSFULLY!"
}

# Main script logic
case "${1:-quick}" in
    quick)
        run_quick_tests
        ;;
    build)
        run_build_tests
        ;;
    system)
        run_system_tests
        ;;
    all)
        run_all_tests
        ;;
    help|--help|-h)
        show_usage
        exit 0
        ;;
    *)
        print_error "Unknown option: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac

exit 0
