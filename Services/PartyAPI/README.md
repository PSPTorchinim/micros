# PartyAPI - Event & Booking Management Service

The Party service manages events, parties, bookings, and scheduling for the DJ Beat Blaster platform.

## 📋 Overview

PartyAPI provides comprehensive event management:

- Event creation and scheduling
- Booking management system
- Event timeline and planning
- Venue and location management
- Event performance tracking
- Client event history
- Event status workflow

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (PartyDB)
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
PartyAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # Database context and seed data
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic services
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── PartyAPI.csproj     # Project file
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
       "DefaultConnection": "Server=localhost,1433;Database=PartyDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5006/swagger

## 🔌 API Endpoints

### Event Management

#### GET /api/events
Get paginated list of events.

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `search` - Search by event name or venue
- `status` - Filter by status (pending, confirmed, in-progress, completed, cancelled)
- `type` - Filter by event type (wedding, corporate, birthday, club, festival)
- `startDate` / `endDate` - Date range filter
- `sortBy` - Sort field (date, name, status)

**Response**:
```json
{
  "items": [
    {
      "id": "event-id",
      "name": "Johnson Wedding Reception",
      "eventType": "wedding",
      "status": "confirmed",
      "eventDate": "2024-07-15T18:00:00Z",
      "startTime": "18:00",
      "endTime": "23:00",
      "venue": {
        "name": "Grand Hotel Ballroom",
        "address": "123 Main St, Los Angeles, CA"
      },
      "clientId": "client-id",
      "clientName": "Sarah Johnson",
      "attendees": 150,
      "packagePrice": 2500.00,
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ],
  "totalCount": 75,
  "page": 1,
  "pageSize": 20
}
```

#### GET /api/events/{id}
Get detailed event information.

**Response**:
```json
{
  "id": "event-id",
  "name": "Johnson Wedding Reception",
  "description": "Wedding reception for Sarah and Mike Johnson",
  "eventType": "wedding",
  "status": "confirmed",
  "eventDate": "2024-07-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "setupTime": "16:00",
  "venue": {
    "id": "venue-id",
    "name": "Grand Hotel Ballroom",
    "address": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "contactName": "Venue Manager",
    "contactPhone": "+1-555-0111"
  },
  "client": {
    "id": "client-id",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "phone": "+1-555-0456"
  },
  "djAssigned": {
    "id": "dj-id",
    "name": "DJ Mike"
  },
  "attendees": 150,
  "packageId": "package-id",
  "packagePrice": 2500.00,
  "addOns": [
    {
      "name": "Photo Booth",
      "price": 500.00
    }
  ],
  "totalPrice": 3000.00,
  "deposit": 1000.00,
  "depositPaid": true,
  "depositDate": "2024-02-01",
  "balanceDue": 2000.00,
  "musicPreferences": {
    "genres": ["Pop", "Dance", "Top 40"],
    "doNotPlay": ["Heavy Metal", "Rap"],
    "specialRequests": ["First Dance: 'Perfect' by Ed Sheeran"]
  },
  "equipment": [
    {
      "id": "eq-id",
      "name": "Pioneer CDJ-3000",
      "quantity": 2
    }
  ],
  "timeline": [
    {
      "time": "18:00",
      "activity": "Guest Arrival"
    },
    {
      "time": "19:00",
      "activity": "Grand Entrance"
    },
    {
      "time": "19:30",
      "activity": "First Dance"
    }
  ],
  "notes": "Couple prefers smooth transitions between songs",
  "createdAt": "2024-01-10T10:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

#### POST /api/events
Create new event.

**Request**:
```json
{
  "name": "Chen Corporate Gala",
  "description": "Annual corporate gala event",
  "eventType": "corporate",
  "eventDate": "2024-09-20",
  "startTime": "19:00",
  "endTime": "23:00",
  "setupTime": "17:00",
  "venueId": "venue-id",
  "clientId": "client-id",
  "attendees": 200,
  "packageId": "package-id",
  "notes": "Black tie event, sophisticated music required"
}
```

#### PUT /api/events/{id}
Update event information.

#### DELETE /api/events/{id}
Cancel event (soft delete).

### Event Timeline

#### GET /api/events/{id}/timeline
Get event timeline/schedule.

#### PUT /api/events/{id}/timeline
Update event timeline.

**Request**:
```json
{
  "timelineItems": [
    {
      "time": "19:00",
      "activity": "Cocktail Hour",
      "duration": 60,
      "notes": "Jazz background music"
    },
    {
      "time": "20:00",
      "activity": "Dinner Service",
      "duration": 90,
      "notes": "Soft background music"
    }
  ]
}
```

### Bookings

#### GET /api/bookings
Get all bookings with availability.

**Query Parameters**:
- `startDate` / `endDate` - Date range
- `status` - Filter by status
- `djId` - Filter by assigned DJ

#### POST /api/bookings/check-availability
Check availability for date/time.

**Request**:
```json
{
  "eventDate": "2024-08-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "djId": "dj-id"
}
```

**Response**:
```json
{
  "isAvailable": true,
  "conflicts": [],
  "suggestedAlternatives": []
}
```

### Venues

#### GET /api/venues
Get list of venues.

#### GET /api/venues/{id}
Get venue details.

#### POST /api/venues
Add new venue.

**Request**:
```json
{
  "name": "City Convention Center",
  "address": "789 Convention Blvd",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90003",
  "capacity": 500,
  "contactName": "Event Coordinator",
  "contactPhone": "+1-555-0999",
  "contactEmail": "events@convention.com",
  "notes": "Loading dock in rear, parking available"
}
```

### Event Status Management

#### PUT /api/events/{id}/status
Update event status.

**Request**:
```json
{
  "status": "confirmed",
  "notes": "Deposit received, contract signed"
}
```

**Available Status Values**:
- `pending` - Initial inquiry/quote
- `confirmed` - Booking confirmed
- `in-progress` - Event currently happening
- `completed` - Event finished
- `cancelled` - Event cancelled

## 🗄️ Database Schema

### Events Table
- Id (PK)
- Name
- Description
- EventType (Wedding, Corporate, Birthday, Club, Festival, Private, Other)
- Status (Pending, Confirmed, InProgress, Completed, Cancelled)
- EventDate
- StartTime
- EndTime
- SetupTime
- VenueId (FK)
- ClientId (FK to CompanyAPI)
- DJId (FK to Identity)
- Attendees
- PackageId (FK)
- PackagePrice
- TotalPrice
- Deposit
- DepositPaid
- DepositDate
- BalanceDue
- MusicPreferencesJson
- Notes
- CreatedAt
- UpdatedAt
- CancelledAt

### Venues Table
- Id (PK)
- Name
- Address
- City
- State
- ZipCode
- Country
- Capacity
- ContactName
- ContactPhone
- ContactEmail
- Website
- Notes
- CreatedAt
- UpdatedAt

### EventTimeline Table
- Id (PK)
- EventId (FK)
- Time
- Activity
- Duration (minutes)
- Notes
- SortOrder

### EventEquipment Table (Junction)
- Id (PK)
- EventId (FK)
- EquipmentId (FK to EquipmentAPI)
- Quantity
- Notes

### EventAddOns Table
- Id (PK)
- EventId (FK)
- Name
- Description
- Price

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_SQLSERVER=localhost
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
PARTY_DATABASE_CATALOG=PartyDB

# Security
SECURE_KEY=YourSecureAPIKeyHere
JWT_KEY=YourJWTKey

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 🎉 Event Types

### Supported Event Categories
- **Wedding**: Wedding receptions, ceremonies
- **Corporate**: Company parties, galas, conferences
- **Birthday**: Birthday parties, anniversaries
- **Club**: Nightclub events, club nights
- **Festival**: Music festivals, outdoor events
- **Private**: Private parties, house parties
- **Other**: Custom event types

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/PartyAPI.Tests
dotnet test
```

### Test Scenarios
- Event CRUD operations
- Booking availability checks
- Timeline management
- Status workflow
- Venue management

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready (DB connected)

## 🔍 Logging

Structured logging includes:
- Event operations
- Booking activities
- Status changes
- Timeline updates
- Availability checks

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=PartyAPI \
  -t djbeatblaster/party-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name party-api \
  -p 5006:8080 \
  -e DATABASE_HOST_SQLSERVER=sqlserver \
  djbeatblaster/party-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes event-related requests
- **IdentityAPI**: User authentication, DJ assignments
- **CompanyAPI**: Client information and relationships
- **EquipmentAPI**: Equipment bookings and availability
- **DocumentsAPI**: Event contracts and agreements
- **MusicAPI**: Event playlists and music preferences
- **MailingAPI**: Event confirmation emails and reminders

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)

## 🐛 Troubleshooting

### Double booking occurs
- Check availability before confirming
- Implement locking mechanism
- Verify date/time validation

### Event timeline not saving
- Check timeline item validation
- Verify proper JSON serialization
- Ensure sort order is set

### Venue information missing
- Verify venue foreign key
- Check for deleted venues
- Ensure venue creation before event

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
