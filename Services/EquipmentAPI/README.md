# EquipmentAPI - DJ Equipment Management Service

## 📋 Overview

The EquipmentAPI service (also known as GearAPI) manages DJ equipment inventory, tracking, maintenance, and availability for the DJ Beat Blaster platform. It provides comprehensive equipment lifecycle management.

**Port**: 5003  
**Database**: SQL Server (GearDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides complete equipment management for:

- Equipment inventory and cataloging
- Equipment availability tracking
- Maintenance scheduling and records
- Rental and booking management
- Equipment specifications and documentation
- Equipment location tracking

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│       EquipmentAPI Service          │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ EquipmentController (TBD)       │
│  ├─ GearTypesController (TBD)       │
│  └─ MaintenanceController (TBD)     │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ EquipmentService                │
│  ├─ MaintenanceService              │
│  └─ AvailabilityService             │
├─────────────────────────────────────┤
│  Data Layer (EF Core)               │
│  └─ SQL Server (GearDB)             │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

- **Gear** - Individual equipment items (speakers, mixers, lights, etc.)
- **GearType** - Equipment categories and types

## 🔌 API Endpoints

### Equipment Management

- `GET /api/equipment` - List all equipment (paginated, filterable)
- `GET /api/equipment/{id}` - Get equipment details
- `POST /api/equipment` - Add new equipment
- `PUT /api/equipment/{id}` - Update equipment information
- `DELETE /api/equipment/{id}` - Remove equipment
- `GET /api/equipment/search` - Search equipment by name, type, or specs
- `GET /api/equipment/{id}/history` - Get equipment usage history

### Equipment Types

- `GET /api/gear-types` - List all equipment types
- `GET /api/gear-types/{id}` - Get gear type details
- `POST /api/gear-types` - Create new gear type
- `PUT /api/gear-types/{id}` - Update gear type
- `DELETE /api/gear-types/{id}` - Delete gear type

### Availability

- `GET /api/equipment/availability` - Check equipment availability
- `GET /api/equipment/{id}/availability` - Check specific equipment availability
- `POST /api/equipment/{id}/reserve` - Reserve equipment for event
- `DELETE /api/equipment/{id}/reservation/{reservationId}` - Cancel reservation

### Maintenance

- `GET /api/equipment/{id}/maintenance` - Get maintenance records
- `POST /api/equipment/{id}/maintenance` - Schedule maintenance
- `PUT /api/maintenance/{id}` - Update maintenance record
- `PUT /api/maintenance/{id}/complete` - Mark maintenance as complete

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core** - ORM for SQL Server
- **SQL Server** - Primary database
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Schema

The GearDB contains the following tables:

- `Gear` - Equipment inventory
- `GearTypes` - Equipment categories
- `MaintenanceRecords` - Maintenance history (planned)
- `Reservations` - Equipment bookings (planned)
- `EquipmentLocations` - Storage locations (planned)

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server 2022 or higher
- Visual Studio 2022 or VS Code

### Local Development

1. **Configure Database Connection**

   Edit `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=GearDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
     }
   }
   ```

2. **Run Database Migrations**

   ```bash
   dotnet ef database update
   ```

3. **Start the Service**

   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger Documentation**

   Navigate to: http://localhost:5003/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10"
  },
  "Equipment": {
    "MaintenanceIntervalDays": 90,
    "ReservationBufferHours": 2
  }
}
```

## 🎛️ Equipment Features

### Equipment Categories

- **Audio Equipment** - Speakers, mixers, amplifiers
- **Lighting** - Moving heads, lasers, LED fixtures
- **Video** - Projectors, screens, video walls
- **DJ Gear** - Controllers, turntables, CDJs
- **Accessories** - Cables, stands, cases
- **Power** - Generators, power distribution

### Equipment Specifications

Track detailed specifications:

- Make and model
- Serial number
- Purchase date and cost
- Warranty information
- Technical specifications
- Power requirements
- Weight and dimensions
- Storage location

### Equipment Status

- **Available** - Ready for use
- **In Use** - Currently deployed at event
- **Maintenance** - Under maintenance/repair
- **Reserved** - Booked for future event
- **Retired** - No longer in service

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/EquipmentAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **Role-Based Authorization** - Equipment manager access
- **Audit Logging** - Track equipment changes
- **Theft Prevention** - Serial number tracking

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
SQL_CONNECTION_STRING=your-connection-string
MAINTENANCE_INTERVAL_DAYS=90
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t equipmentapi:latest .
```

### Run Container

```bash
docker run -d -p 5003:5003 \
  -e SQL_CONNECTION_STRING=your-connection \
  equipmentapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design

## 🤝 Integration with Other Services

The EquipmentAPI integrates with:

- **IdentityAPI** - User authentication
- **PartyAPI** - Event equipment assignments
- **CompanyAPI** - Equipment ownership tracking
- **DocumentsAPI** - Equipment documentation
- **DJ Panel Frontend** - Equipment management interface

## 🔧 Development Guidelines

### Adding New Endpoints

1. Create controller method with proper routing
2. Implement business logic in service layer
3. Add authorization attributes
4. Update Swagger documentation
5. Write comprehensive unit tests

### Database Migrations

```bash
# Add new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

## 🎯 Future Enhancements

- QR code/barcode scanning for equipment
- GPS tracking for equipment location
- Equipment damage reporting
- Automated maintenance reminders
- Equipment replacement recommendations
- Integration with rental pricing systems
- Photo documentation and image gallery
- Equipment performance analytics

## 📞 Support

For issues related to EquipmentAPI, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
