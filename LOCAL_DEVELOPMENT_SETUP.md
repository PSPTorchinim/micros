# Local Development Setup for Microservices

This document describes the local development configuration for running all microservices locally with proper environment variables.

## Overview

I've added a "Local Development" launch profile to each microservice that includes all the required environment variables from the Services/Shared project. This allows you to run the microservices locally without Docker while maintaining proper configuration.

## Service Ports Configuration

| Service                     | Port | Launch Profile    | API Gateway Route  | Database Type | Database Name |
| --------------------------- | ---- | ----------------- | ------------------ | ------------- | ------------- |
| DJHostGateway (API Gateway) | 5000 | Local Development | -                  | SQL Server    | ApiGatewayDB  |
| IdentityAPI                 | 5001 | Local Development | `/identity/api/*`  | SQL Server    | IdentityDB    |
| MusicAPI                    | 5002 | Local Development | `/music/api/*`     | SQL Server    | MusicDB       |
| EquipmentAPI (Gear)         | 5003 | Local Development | `/gear/api/*`      | SQL Server    | GearDB        |
| DocumentsAPI                | 5004 | Local Development | `/documents/api/*` | MongoDB       | DocumentsDB   |
| CompanyAPI (Brand)          | 5005 | Local Development | `/brand/api/*`     | SQL Server    | BrandDB       |
| PartyAPI                    | 5006 | Local Development | `/party/api/*`     | SQL Server    | PartyDB       |
| MailingAPI                  | 5007 | Local Development | `/mailing/api/*`   | MongoDB       | MailingDB     |

## Environment Variables

Each service includes these environment variables in the "Local Development" profile:

### Core Configuration

- `ASPNETCORE_ENVIRONMENT`: "Development"
- `ASPNETCORE_SECURE_KEY`: "LocalDevelopmentSecureKey123456789"
- `ASPNETCORE_JWT_KEY`: "LocalDevelopmentJWTKey123456789012345678901234567890"

### Database Configuration (SQL Server)

Each service uses its own database catalog:

- DJHostGateway: `ASPNETCORE_DATABASE_CATALOG`: "ApiGatewayDB"
- IdentityAPI: `ASPNETCORE_DATABASE_CATALOG`: "IdentityDB"
- MusicAPI: `ASPNETCORE_DATABASE_CATALOG`: "MusicDB"
- EquipmentAPI (Gear): `ASPNETCORE_DATABASE_CATALOG`: "GearDB"
- CompanyAPI (Brand): `ASPNETCORE_DATABASE_CATALOG`: "BrandDB"
- PartyAPI: `ASPNETCORE_DATABASE_CATALOG`: "PartyDB"
- MailingAPI: `ASPNETCORE_DATABASE_CATALOG`: "MailingDB"
- DocumentsAPI: `ASPNETCORE_DATABASE_CATALOG`: "DocumentsDB"

Common SQL Server settings:

- `ASPNETCORE_DATABASE_HOST_SQLSERVER`: "localhost"
- `ASPNETCORE_DATABASE_PORT_SQLSERVER`: "1433"
- `ASPNETCORE_DATABASE_USER_SQLSERVER`: "sa"
- `ASPNETCORE_DATABASE_PASSWORD_SQLSERVER`: "YourStrong@Passw0rd"

### Database Configuration (MongoDB)

MongoDB services also use separate database names:

- DocumentsAPI: `ASPNETCORE_DATABASE_CATALOG`: "DocumentsDB"
- MailingAPI: `ASPNETCORE_DATABASE_CATALOG`: "MailingDB" (when enabled)

Common MongoDB settings:

- `ASPNETCORE_DATABASE_HOST_MONGODB`: "localhost"
- `ASPNETCORE_DATABASE_PORT_MONGODB`: "27017"
- `ASPNETCORE_DATABASE_USER_MONGODB`: "admin"
- `ASPNETCORE_DATABASE_PASSWORD_MONGODB`: "password"

### Redis Configuration

- `ASPNETCORE_REDIS_HOST`: "localhost"
- `ASPNETCORE_REDIS_PORT`: "6379"
- `ASPNETCORE_REDIS_PASSWORD`: "" (empty for local)

### RabbitMQ Configuration

- `ASPNETCORE_RABBITMQ_HOST`: "localhost"
- `ASPNETCORE_RABBITMQ_PORT`: "5672"
- `ASPNETCORE_RABBITMQ_USER`: "guest"
- `ASPNETCORE_RABBITMQ_PASSWORD`: "guest"

### User Seeding Configuration

- `ASPNETCORE_DJPANEL_USER_EMAIL`: "admin@djbeatblaster.com"
- `ASPNETCORE_DJPANEL_USER_PASSWORD`: "Admin123!"

### API Gateway Service URLs (DJHostGateway only)

- `ASPNETCORE_IDENTITY_BE_ADDRESS`: "http://localhost:5001"
- `ASPNETCORE_MUSIC_BE_ADDRESS`: "http://localhost:5002"
- `ASPNETCORE_GEAR_BE_ADDRESS`: "http://localhost:5003"
- `ASPNETCORE_DOCUMENTS_BE_ADDRESS`: "http://localhost:5004"
- `ASPNETCORE_BRAND_BE_ADDRESS`: "http://localhost:5005"
- `ASPNETCORE_PARTY_BE_ADDRESS`: "http://localhost:5006"
- `ASPNETCORE_MAILING_BE_ADDRESS`: "http://localhost:5007"

## Database Isolation

Each microservice uses its own database to ensure proper data isolation and microservice architecture principles:

- **SQL Server Services**: Each creates its own database catalog (IdentityDB, MusicDB, etc.)
- **MongoDB Services**: Each connects to its own database within the MongoDB instance
- **Database Independence**: Services can evolve their schemas independently
- **Data Isolation**: No cross-service data dependencies or conflicts

## Prerequisites

Before running the services locally, ensure you have the following infrastructure running:

1. **SQL Server**: Running on localhost:1433 with sa user
2. **MongoDB**: Running on localhost:27017 with admin user
3. **Redis**: Running on localhost:6379 (no password)
4. **RabbitMQ**: Running on localhost:5672 with guest/guest credentials

Note: The databases will be automatically created when services start for the first time.

## How to Use

1. **Start Infrastructure Services**: Make sure SQL Server, MongoDB, Redis, and RabbitMQ are running locally.

2. **Launch Services**: Use Visual Studio or VS Code to launch each service using the "Local Development" profile.

3. **Start Order**:

   - Start all individual services first (IdentityAPI, MusicAPI, etc.)
   - Start the API Gateway (DJHostGateway) last

4. **Access Services**:
   - API Gateway Swagger: http://localhost:5000/swagger
   - Individual Service Swagger: http://localhost:500X/swagger (where X is the service port)

## API Gateway Configuration

The DJHostGateway has been updated to include the Party service route that was missing:

- Added `/party/api/*` route mapping to PartyAPI
- All services are accessible through the API Gateway at http://localhost:5000

## Frontend Configuration

For the dj-panel frontend to work with this local setup, ensure these environment variables are set:

- `REACT_APP_API_GATEWAY`: "http://localhost:5000"
- `REACT_APP_API_SECURE_KEY`: "LocalDevelopmentSecureKey123456789"

## Security Notes

The JWT key and secure key used in these launch profiles are for local development only.
Never use these values in production environments.

## Troubleshooting

1. **Port Conflicts**: If any ports are in use, update the `applicationUrl` in the respective launchSettings.json and update the API Gateway configuration accordingly.

2. **Database Connection Issues**: Verify that your local databases are running and accessible with the configured credentials.

3. **Service Discovery**: The API Gateway uses environment variables to discover service endpoints. Make sure all services are running on their configured ports.
