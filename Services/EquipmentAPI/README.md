# EquipmentAPI (GearAPI) - DJ Equipment Inventory Service

The Equipment service manages DJ equipment inventory, maintenance schedules, and availability tracking for the DJ Beat Blaster platform.

## 📋 Overview

EquipmentAPI provides comprehensive equipment management:

- Equipment inventory tracking
- Maintenance scheduling and history
- Availability calendar
- Equipment specifications and documentation
- Rental and booking management
- Equipment condition monitoring

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (GearDB)
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
EquipmentAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # Database context and seed data
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic services
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── EquipmentAPI.csproj # Project file
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- SQL Server (local or container)
- Visual Studio 2022 or VS Code

### Running Locally

1. **Ensure SQL Server is running**:
   ```bash
   docker run -d --name sqlserver -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Update connection string** in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1433;Database=GearDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5003/swagger

## 🔌 API Endpoints

### Equipment Management

#### GET /api/equipment
Get paginated list of equipment.

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `search` - Search by name or model
- `category` - Filter by category (e.g., speakers, mixers, lights)
- `status` - Filter by status (available, in-use, maintenance, retired)

**Response**:
```json
{
  "items": [
    {
      "id": "equipment-id",
      "name": "Pioneer CDJ-3000",
      "category": "CDJ Player",
      "manufacturer": "Pioneer DJ",
      "model": "CDJ-3000",
      "serialNumber": "SN12345678",
      "purchaseDate": "2023-01-15",
      "purchasePrice": 2299.00,
      "status": "available",
      "condition": "excellent",
      "lastMaintenanceDate": "2024-01-01"
    }
  ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20
}
```

#### GET /api/equipment/{id}
Get specific equipment details including maintenance history.

#### POST /api/equipment
Add new equipment to inventory.

**Request**:
```json
{
  "name": "Pioneer DJM-900NXS2",
  "category": "Mixer",
  "manufacturer": "Pioneer DJ",
  "model": "DJM-900NXS2",
  "serialNumber": "SN98765432",
  "purchaseDate": "2024-01-15",
  "purchasePrice": 2499.00,
  "condition": "new",
  "notes": "4-channel professional DJ mixer"
}
```

#### PUT /api/equipment/{id}
Update equipment information.

#### DELETE /api/equipment/{id}
Remove equipment from inventory (soft delete).

### Availability Management

#### GET /api/equipment/{id}/availability
Check equipment availability for date range.

**Query Parameters**:
- `startDate` - Start date (ISO 8601)
- `endDate` - End date (ISO 8601)

**Response**:
```json
{
  "equipmentId": "equipment-id",
  "isAvailable": true,
  "availableDates": ["2024-06-01", "2024-06-02"],
  "bookedDates": [],
  "maintenanceDates": []
}
```

#### GET /api/equipment/availability
Batch availability check for multiple items.

**Request**:
```json
{
  "equipmentIds": ["id1", "id2", "id3"],
  "startDate": "2024-06-01",
  "endDate": "2024-06-07"
}
```

### Maintenance Management

#### GET /api/equipment/{id}/maintenance
Get maintenance history for equipment.

#### POST /api/equipment/{id}/maintenance
Schedule or log maintenance.

**Request**:
```json
{
  "maintenanceType": "routine",
  "scheduledDate": "2024-02-01",
  "description": "Regular cleaning and calibration",
  "estimatedCost": 50.00,
  "assignedTo": "Tech Team"
}
```

#### PUT /api/maintenance/{id}/complete
Mark maintenance as complete.

**Request**:
```json
{
  "completedDate": "2024-02-01",
  "actualCost": 45.00,
  "notes": "All checks passed, equipment in excellent condition",
  "nextMaintenanceDate": "2024-08-01"
}
```

### Categories & Specifications

#### GET /api/categories
Get equipment categories.

#### GET /api/equipment/{id}/specifications
Get detailed specifications.

**Response**:
```json
{
  "equipmentId": "equipment-id",
  "specifications": {
    "powerRating": "120W",
    "weight": "4.5kg",
    "dimensions": "320 x 406.4 x 107.5mm",
    "connectivity": ["USB", "RCA", "XLR"],
    "features": ["Beat FX", "Sound Color FX", "4-band EQ"]
  }
}
```

## 🗄️ Database Schema

### Equipment Table
- Id (PK)
- Name
- Category
- Manufacturer
- Model
- SerialNumber (Unique)
- PurchaseDate
- PurchasePrice
- CurrentValue
- Status (Available, InUse, Maintenance, Retired)
- Condition (New, Excellent, Good, Fair, Poor)
- Location
- Notes
- CreatedAt
- UpdatedAt

### MaintenanceRecords Table
- Id (PK)
- EquipmentId (FK)
- MaintenanceType (Routine, Repair, Calibration, Upgrade)
- ScheduledDate
- CompletedDate
- Description
- Cost
- PerformedBy
- Notes
- NextMaintenanceDate

### EquipmentBookings Table
- Id (PK)
- EquipmentId (FK)
- EventId (FK to PartyAPI)
- BookedBy
- StartDate
- EndDate
- Status (Reserved, Confirmed, InUse, Returned)
- Notes

### EquipmentSpecifications Table
- Id (PK)
- EquipmentId (FK)
- SpecKey
- SpecValue

### EquipmentCategories Table
- Id (PK)
- Name
- Description
- ParentCategoryId (FK, nullable)

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_SQLSERVER=localhost
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
GEAR_DATABASE_CATALOG=GearDB

# Security
SECURE_KEY=YourSecureAPIKeyHere
JWT_KEY=YourJWTKey

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 🎛️ Equipment Categories

### Common Categories
- **Playback**: CDJ Players, Turntables, Media Players
- **Mixers**: DJ Mixers, Rotary Mixers, Scratch Mixers
- **Speakers**: PA Speakers, Subwoofers, Monitors
- **Amplifiers**: Power Amps, Pre-amps
- **Lighting**: LED Lights, Moving Heads, Strobes, Lasers
- **Effects**: Smoke Machines, Bubble Machines, CO2 Jets
- **Cables & Accessories**: Audio Cables, Power Cables, Stands
- **Cases**: Flight Cases, Soft Cases, Bags
- **Controllers**: MIDI Controllers, DJ Controllers

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/EquipmentAPI.Tests
dotnet test
```

### Test Scenarios
- Equipment CRUD operations
- Availability checking
- Maintenance scheduling
- Booking conflicts
- Equipment lifecycle

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready (DB connected)

## 🔍 Logging

Structured logging includes:
- Equipment additions/modifications
- Maintenance activities
- Availability queries
- Booking operations
- Status changes

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=EquipmentAPI \
  -t djbeatblaster/equipment-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name equipment-api \
  -p 5003:8080 \
  -e DATABASE_HOST_SQLSERVER=sqlserver \
  djbeatblaster/equipment-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes equipment-related requests
- **IdentityAPI**: User authentication
- **PartyAPI**: Event equipment assignments and bookings
- **DocumentsAPI**: Equipment rental agreements
- **CompanyAPI**: Equipment ownership and client assignments

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)

## 🐛 Troubleshooting

### Equipment shows as unavailable incorrectly
- Check booking records for conflicts
- Verify maintenance schedules
- Ensure status is not set to "retired"

### Maintenance reminders not working
- Verify NextMaintenanceDate is set
- Check notification service configuration
- Ensure proper date calculations

### Availability check performance issues
- Optimize database indexes on date columns
- Consider caching frequently checked items
- Review query performance

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
