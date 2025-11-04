# CompanyAPI (BrandAPI) - Brand & Client Management Service

The Company service manages brand information, client relationships, and business operations for the DJ Beat Blaster platform.

## 📋 Overview

CompanyAPI provides comprehensive business management:

- Brand and company profile management
- Client relationship management (CRM)
- Business contact management
- Service packages and pricing
- Client communication history
- Lead tracking and conversion
- Client engagement analytics

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: SQL Server (BrandDB)
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
CompanyAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # Database context and seed data
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic services
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── CompanyAPI.csproj   # Project file
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
       "DefaultConnection": "Server=localhost,1433;Database=BrandDB;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5005/swagger

## 🔌 API Endpoints

### Brand Management

#### GET /api/brands
Get DJ brand/company information.

**Response**:
```json
{
  "id": "brand-id",
  "name": "Beat Masters DJ",
  "tagline": "Making Every Event Unforgettable",
  "description": "Professional DJ services for all occasions",
  "logo": "/images/logo.png",
  "website": "https://beatmastersdj.com",
  "email": "info@beatmastersdj.com",
  "phone": "+1-555-0123",
  "socialMedia": {
    "facebook": "@beatmastersdj",
    "instagram": "@beatmasters_dj",
    "twitter": "@beatmastersdj"
  },
  "address": {
    "street": "123 Music Street",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA"
  }
}
```

#### PUT /api/brands/{id}
Update brand information.

### Client Management

#### GET /api/clients
Get paginated list of clients.

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `search` - Search by name, email, or phone
- `status` - Filter by status (active, inactive, lead, prospect)
- `sortBy` - Sort field (name, createdDate, lastContact)

**Response**:
```json
{
  "items": [
    {
      "id": "client-id",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah.johnson@example.com",
      "phone": "+1-555-0456",
      "company": "Johnson Events Inc.",
      "status": "active",
      "clientType": "corporate",
      "totalEvents": 12,
      "totalSpent": 45000.00,
      "lastContactDate": "2024-01-10T14:30:00Z",
      "createdAt": "2023-01-15T10:00:00Z"
    }
  ],
  "totalCount": 250,
  "page": 1,
  "pageSize": 20
}
```

#### GET /api/clients/{id}
Get detailed client information.

**Response**:
```json
{
  "id": "client-id",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "+1-555-0456",
  "alternatePhone": "+1-555-0457",
  "company": "Johnson Events Inc.",
  "position": "Event Manager",
  "address": {
    "street": "456 Event Plaza",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90002"
  },
  "status": "active",
  "clientType": "corporate",
  "source": "referral",
  "referredBy": "John Smith",
  "tags": ["vip", "corporate", "repeat-customer"],
  "preferences": {
    "musicGenres": ["Pop", "Dance", "Top 40"],
    "communicationMethod": "email",
    "specialRequests": "Prefer evening communications"
  },
  "statistics": {
    "totalEvents": 12,
    "totalSpent": 45000.00,
    "averageEventValue": 3750.00,
    "lastEventDate": "2024-01-05"
  },
  "createdAt": "2023-01-15T10:00:00Z",
  "updatedAt": "2024-01-10T14:30:00Z"
}
```

#### POST /api/clients
Add new client.

**Request**:
```json
{
  "firstName": "Michael",
  "lastName": "Chen",
  "email": "michael.chen@example.com",
  "phone": "+1-555-0789",
  "company": "Chen Corporation",
  "position": "Marketing Director",
  "clientType": "corporate",
  "source": "website",
  "notes": "Interested in monthly corporate events"
}
```

#### PUT /api/clients/{id}
Update client information.

#### DELETE /api/clients/{id}
Delete client (soft delete).

### Client Communication

#### GET /api/clients/{id}/communications
Get communication history with client.

**Response**:
```json
{
  "items": [
    {
      "id": "comm-id",
      "clientId": "client-id",
      "type": "email",
      "subject": "Event Proposal - Annual Gala",
      "summary": "Sent proposal for annual corporate gala event",
      "date": "2024-01-10T14:30:00Z",
      "direction": "outbound",
      "outcome": "proposal-sent",
      "followUpDate": "2024-01-17T00:00:00Z",
      "userId": "user-id"
    }
  ]
}
```

#### POST /api/clients/{id}/communications
Log new communication.

**Request**:
```json
{
  "type": "phone",
  "subject": "Follow-up on Wedding Package",
  "summary": "Discussed wedding package options and pricing",
  "date": "2024-01-15T10:00:00Z",
  "direction": "inbound",
  "outcome": "interested",
  "followUpDate": "2024-01-20T00:00:00Z",
  "notes": "Client wants to schedule venue visit"
}
```

### Service Packages

#### GET /api/packages
Get available service packages.

**Response**:
```json
{
  "items": [
    {
      "id": "package-id",
      "name": "Wedding Premium Package",
      "description": "Complete DJ service for your special day",
      "category": "wedding",
      "basePrice": 2500.00,
      "features": [
        "Professional DJ for 6 hours",
        "Premium sound system",
        "Wireless microphones (2)",
        "Uplighting (8 fixtures)",
        "Music consultation session",
        "Backup equipment"
      ],
      "addOns": [
        {
          "name": "Extra Hour",
          "price": 200.00
        },
        {
          "name": "Photo Booth",
          "price": 500.00
        }
      ],
      "isActive": true
    }
  ]
}
```

#### POST /api/packages
Create new service package.

#### PUT /api/packages/{id}
Update package details.

### Leads & Opportunities

#### GET /api/leads
Get leads and prospects.

**Query Parameters**:
- `status` - Filter by lead status (new, contacted, qualified, converted)
- `source` - Filter by lead source
- `dateFrom` / `dateTo` - Date range

#### POST /api/leads
Create new lead.

**Request**:
```json
{
  "firstName": "Emma",
  "lastName": "Davis",
  "email": "emma.davis@example.com",
  "phone": "+1-555-0321",
  "source": "facebook-ad",
  "interest": "wedding",
  "eventDate": "2024-09-15",
  "budget": "3000-4000",
  "notes": "Interested in full wedding package"
}
```

#### PUT /api/leads/{id}/convert
Convert lead to client.

## 🗄️ Database Schema

### Brands Table
- Id (PK)
- Name
- Tagline
- Description
- Logo
- Website
- Email
- Phone
- SocialMediaJson
- AddressJson
- CreatedAt
- UpdatedAt

### Clients Table
- Id (PK)
- FirstName
- LastName
- Email (Unique)
- Phone
- AlternatePhone
- Company
- Position
- AddressJson
- Status (Active, Inactive, Lead, Prospect)
- ClientType (Individual, Corporate, Agency)
- Source (Website, Referral, Social, Event)
- ReferredBy
- Tags (JSON array)
- PreferencesJson
- Notes
- CreatedAt
- UpdatedAt
- LastContactDate

### Communications Table
- Id (PK)
- ClientId (FK)
- UserId (FK to Identity)
- Type (Email, Phone, Meeting, SMS)
- Subject
- Summary
- Date
- Direction (Inbound, Outbound)
- Outcome
- FollowUpDate
- Notes
- CreatedAt

### ServicePackages Table
- Id (PK)
- Name
- Description
- Category (Wedding, Corporate, Birthday, Club, Festival)
- BasePrice
- FeaturesJson
- AddOnsJson
- IsActive
- CreatedAt
- UpdatedAt

### Leads Table
- Id (PK)
- FirstName
- LastName
- Email
- Phone
- Source
- Interest
- EventDate
- Budget
- Status (New, Contacted, Qualified, Converted, Lost)
- Notes
- CreatedAt
- ConvertedAt
- ClientId (FK, nullable)

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_SQLSERVER=localhost
DATABASE_PORT_SQLSERVER=1433
DATABASE_USER_SQLSERVER=sa
DATABASE_PASSWORD_SQLSERVER=YourStrong@Passw0rd
BRAND_DATABASE_CATALOG=BrandDB

# Security
SECURE_KEY=YourSecureAPIKeyHere
JWT_KEY=YourJWTKey

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/CompanyAPI.Tests
dotnet test
```

### Test Scenarios
- Client CRUD operations
- Communication logging
- Lead conversion flow
- Package management
- Search and filtering

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready (DB connected)

## 🔍 Logging

Structured logging includes:
- Client operations
- Communication events
- Lead conversions
- Package updates
- Search queries

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=CompanyAPI \
  -t djbeatblaster/company-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name company-api \
  -p 5005:8080 \
  -e DATABASE_HOST_SQLSERVER=sqlserver \
  djbeatblaster/company-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes company/client requests
- **IdentityAPI**: User authentication
- **PartyAPI**: Client event bookings
- **DocumentsAPI**: Client contracts and proposals
- **MailingAPI**: Client communications and marketing

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)

## 🐛 Troubleshooting

### Duplicate client emails
- Check unique constraint on email field
- Implement email validation
- Consider soft delete for inactive clients

### Communication history not showing
- Verify clientId foreign key
- Check date range filters
- Ensure proper pagination

### Lead conversion fails
- Verify all required fields present
- Check for existing client with same email
- Review validation rules

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
