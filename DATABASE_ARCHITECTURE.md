# Database Architecture for Microservices

## Overview

This document describes the database architecture for the DJ Beat Blaster microservices platform. Each microservice maintains its own database to ensure proper data isolation and independence.

## Database Types and Services

### SQL Server Services

The following services use SQL Server with Entity Framework Core:

| Service                 | Database Name | Purpose                                      |
| ----------------------- | ------------- | -------------------------------------------- |
| **IdentityAPI**         | `IdentityDB`  | User authentication, roles, permissions      |
| **MusicAPI**            | `MusicDB`     | Music catalog, playlists, track metadata     |
| **EquipmentAPI (Gear)** | `GearDB`      | DJ equipment inventory and management        |
| **CompanyAPI (Brand)**  | `BrandDB`     | Brand/company information, client management |
| **PartyAPI**            | `PartyDB`     | Event/party management, bookings             |

### MongoDB Services

The following services use MongoDB with the MongoDB .NET driver:

| Service          | Database Name | Purpose                                   |
| ---------------- | ------------- | ----------------------------------------- |
| **DocumentsAPI** | `DocumentsDB` | Document templates, contracts, proposals  |
| **MailingAPI**   | `MailingDB`   | Email templates, mailing lists, campaigns |

### API Gateway

| Service           | Database Name  | Purpose                             |
| ----------------- | -------------- | ----------------------------------- |
| **DJHostGateway** | `ApiGatewayDB` | Gateway configuration, routing data |

## Connection String Configuration

### SQL Server Connection String Format

```
Data Source={host},{port};Initial Catalog={database};User Id={user};Password={password};Trust Server Certificate=True
```

### MongoDB Connection String Format

```
mongodb://{user}:{password}@{host}:{port}/{database}
```

## Environment Variables

Each service uses these environment variables for database configuration:

### SQL Server Services

- `ASPNETCORE_DATABASE_CATALOG`: Service-specific database name
- `ASPNETCORE_DATABASE_HOST_SQLSERVER`: SQL Server host (default: localhost)
- `ASPNETCORE_DATABASE_PORT_SQLSERVER`: SQL Server port (default: 1433)
- `ASPNETCORE_DATABASE_USER_SQLSERVER`: SQL Server username (default: sa)
- `ASPNETCORE_DATABASE_PASSWORD_SQLSERVER`: SQL Server password

### MongoDB Services

- `ASPNETCORE_DATABASE_CATALOG`: Service-specific database name
- `ASPNETCORE_DATABASE_HOST_MONGODB`: MongoDB host (default: localhost)
- `ASPNETCORE_DATABASE_PORT_MONGODB`: MongoDB port (default: 27017)
- `ASPNETCORE_DATABASE_USER_MONGODB`: MongoDB username
- `ASPNETCORE_DATABASE_PASSWORD_MONGODB`: MongoDB password

## Database Initialization

### SQL Server Services

- Use Entity Framework Core migrations
- `EnsureCreatedAsync()` is called on startup
- Database and tables are created automatically

### MongoDB Services

- No explicit schema creation required
- Collections are created on first document insert
- Database is created automatically when first accessed

## Benefits of This Architecture

1. **Data Isolation**: Each service owns its data completely
2. **Independent Evolution**: Services can change schemas without affecting others
3. **Technology Choice**: Services can use the most appropriate database technology
4. **Scalability**: Databases can be scaled independently based on service needs
5. **Fault Isolation**: Database issues in one service don't affect others
6. **Deployment Independence**: Services can be deployed and updated separately

## Local Development

For local development, all services connect to:

- Single SQL Server instance with multiple databases
- Single MongoDB instance with multiple databases
- Shared Redis instance (for caching)
- Shared RabbitMQ instance (for messaging)

## Production Considerations

In production environments, consider:

- Separate database servers for different services or service groups
- Database clustering and replication for high availability
- Backup strategies per service
- Monitoring and alerting per database
- Security isolation at the network and access level

## Database Schema Management

### SQL Server Services

- Entity Framework Core migrations handle schema changes
- Migration files stored in each service's `Data/Migrations` folder
- Migrations run automatically on service startup

### MongoDB Services

- Schema-less design allows for flexible document structures
- Application code handles any necessary data transformations
- Consider using MongoDB schema validation for critical collections

## Connection Pooling and Performance

### SQL Server

- Entity Framework manages connection pooling automatically
- Retry policies configured for transient failures
- Services configured with `ServiceLifetime.Singleton` for DbContext

### MongoDB

- MongoDB driver handles connection pooling
- MongoClient registered as singleton
- Database instances are lightweight and cached

## Backup and Recovery

Each database should have its own backup strategy:

- SQL Server: Regular full and transaction log backups
- MongoDB: Regular database dumps using `mongodump`
- Test restore procedures regularly
- Consider point-in-time recovery requirements

## Security

- Each service uses dedicated database credentials where possible
- Network isolation between services and databases
- Regular security audits and updates
- Encrypted connections (SSL/TLS) in production
- Database-level access controls and permissions
