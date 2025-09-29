# MongoDB Files Organization

This document describes the reorganized structure for MongoDB-related files in the Docker setup.

## Directory Structure

```
Docker/
├── init/
│   └── mongo-init.js                    # MongoDB initialization script (used by Dockerfile)
├── scripts/
│   └── mongo/
│       ├── manual-mongo-setup.js        # Manual user creation script
│       ├── mongodb-troubleshoot.ps1     # PowerShell troubleshooting script
│       └── mongodb-troubleshoot.sh      # Bash troubleshooting script
└── infra/
    └── mongodb.Dockerfile               # MongoDB container definition
```

## File Purposes

### `Docker/init/mongo-init.js`

- **Purpose**: Automatic MongoDB initialization during container startup
- **Usage**: Automatically executed by MongoDB during first container startup
- **Features**:
  - Creates root user with proper permissions
  - Sets up application databases
  - Includes comprehensive logging and error handling

### `Docker/scripts/mongo/manual-mongo-setup.js`

- **Purpose**: Manual user creation when automatic initialization fails
- **Usage**: `docker exec -it <container> mongosh /path/to/manual-mongo-setup.js`
- **Features**:
  - Creates or updates MongoDB users
  - Sets up application databases
  - Includes authentication testing

### `Docker/scripts/mongo/mongodb-troubleshoot.ps1`

- **Purpose**: Comprehensive MongoDB diagnostics for Windows/PowerShell
- **Usage**: `.\Docker\scripts\mongo\mongodb-troubleshoot.ps1`
- **Features**:
  - Container status checking
  - Connection testing
  - Environment variable verification
  - Log analysis

### `Docker/scripts/mongo/mongodb-troubleshoot.sh`

- **Purpose**: Comprehensive MongoDB diagnostics for Linux/macOS/Bash
- **Usage**: `./Docker/scripts/mongo/mongodb-troubleshoot.sh`
- **Features**:
  - Container status checking
  - Connection testing
  - Environment variable verification
  - Log analysis

## Updated References

The following files have been updated to reflect the new structure:

1. **`Docker/infra/mongodb.Dockerfile`**

   - Updated COPY command to use `Docker/init/mongo-init.js`

2. **`Docker/README-MongoDB-Fix.md`**
   - Updated all script path references
   - Updated troubleshooting instructions

## Migration Notes

- All MongoDB-related scripts are now centralized under `Docker/scripts/mongo/`
- Initialization scripts are separated into `Docker/init/`
- This provides better organization and easier maintenance
- All old file locations have been cleaned up

## Usage Examples

### Run Troubleshooting (PowerShell)

```powershell
.\Docker\scripts\mongo\mongodb-troubleshoot.ps1
```

### Run Manual Setup

```powershell
docker cp Docker/scripts/mongo/manual-mongo-setup.js mongodb_container:/tmp/
docker exec -it mongodb_container mongosh /tmp/manual-mongo-setup.js
```

### Rebuild with New Structure

```powershell
docker compose -f Docker/dj-panel-composer.yml build --no-cache mongodb_container
```
