# CI/CD Testing Integration

This document describes how frontend tests are integrated into the CI/CD pipeline and Docker build process.

## Overview

The frontend testing is now separated into dedicated steps in the CI/CD pipeline and optionally included in the Docker build process as a separate stage.

## CI/CD Pipeline Integration

### Separate Test Job

The CI/CD pipeline has been updated to include a separate `test_react` job that runs independently from the `validate_react` build job.

**Pipeline Jobs:**
1. `validate_react` - Builds the React application
   - Installs dependencies
   - Runs linting
   - Checks code formatting
   - Builds the application

2. `test_react` - Tests the React application (NEW)
   - Installs dependencies
   - Runs Jest unit tests
   - Installs Playwright browsers
   - Runs Playwright E2E tests
   - Uploads test results as artifacts

### Test Template

A new GitHub Actions template has been created at `.github/templates/test-react-service/action.yml` that encapsulates all testing steps:

- **Jest Unit Tests**: Runs all unit and integration tests
- **Playwright E2E Tests**: Runs end-to-end tests with browser automation
- **Test Results Upload**: Automatically uploads test reports as artifacts with 30-day retention

### Workflow File Changes

**File**: `.github/workflows/ci-validation-pipeline.yml`

**Changes:**
- Added new `test_react` job
- Updated `report_status` to include `test_react` in success criteria
- Separated testing from build process for better pipeline visibility

## Docker Integration

### Multi-Stage Build with Test Stage

The Dockerfile has been updated to include a test stage:

**File**: `Docker/frontends/react.Dockerfile`

**Stages:**
1. **builder** - Builds the React application
2. **tester** (NEW) - Runs tests
   - Installs Playwright dependencies
   - Runs Jest unit tests
   - Attempts to run E2E tests (may skip if server is not available)
3. **runner** - Production runtime with lightweight server

### Building with Tests

To build the Docker image with tests:

```bash
# Build and run tests (default)
docker build -f Docker/frontends/react.Dockerfile \
  --build-arg MICROFRONTEND_NAME=dj-panel \
  --target tester \
  -t dj-panel:test .

# Build without running tests (skip to runner stage)
docker build -f Docker/frontends/react.Dockerfile \
  --build-arg MICROFRONTEND_NAME=dj-panel \
  --target runner \
  -t dj-panel:latest .
```

### Production Builds

Production builds can skip the test stage by targeting the final `runner` stage directly, which copies artifacts from the `builder` stage.

## Test Artifacts

When tests run in CI/CD:
- Test results are uploaded as GitHub Actions artifacts
- Reports are available in the Actions tab under "test-results-{service}"
- Artifacts are retained for 30 days
- Includes both Playwright HTML reports and test-results directory

## Running Tests Locally

### Jest Unit Tests
```bash
cd Frontends/dj-panel
npm install
npm test
```

### Playwright E2E Tests
```bash
cd Frontends/dj-panel
npm install
npx playwright install --with-deps chromium
npm run test:e2e
```

### All Tests
```bash
cd Frontends/dj-panel
npm install
npx playwright install --with-deps chromium
npm run test:all
```

## Benefits of This Approach

1. **Separation of Concerns**: Build and test are separate pipeline jobs
2. **Parallel Execution**: Tests can run in parallel with other validation jobs
3. **Better Visibility**: Easier to identify if failure is in build or test
4. **Flexible Docker Builds**: Tests can be included or excluded from Docker builds
5. **Artifact Preservation**: Test results are saved for analysis
6. **Resource Optimization**: Can skip tests in production Docker builds

## Troubleshooting

### E2E Tests Failing in Docker

E2E tests require a running server. In Docker builds, they may fail if the server is not available. The Dockerfile includes a fallback to continue the build:

```dockerfile
RUN npm run test:e2e || echo "E2E tests require running server, skipping in Docker build"
```

To run E2E tests properly in Docker, consider:
- Using docker-compose to run the server alongside tests
- Running E2E tests only in CI/CD where server can be started
- Mocking backend services for E2E tests

### CI/CD Test Failures

If tests fail in CI/CD:
1. Check the test results artifacts for detailed reports
2. Review the job logs for specific error messages
3. Run tests locally to reproduce the issue
4. Ensure all dependencies are properly installed

## Future Improvements

- Add test coverage reports
- Integrate code coverage thresholds
- Add visual regression testing
- Implement test result analytics
- Add performance testing metrics
