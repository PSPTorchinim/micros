# CompanyAPI - Brand & Client Management Service

## 📋 Overview

The CompanyAPI service (also known as BrandAPI) manages brand information, client relationships, and business operations for the DJ Beat Blaster platform. It serves as the CRM (Customer Relationship Management) system for DJ businesses.

**Port**: 5005  
**Database**: SQL Server (BrandDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides comprehensive business management for:

- Brand and company profile management
- Client relationship management (CRM)
- Service packages and pricing
- Business contact management
- Custom field definitions for clients and brands
- Client communication history

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│        CompanyAPI Service           │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ BrandsController                │
│  ├─ ClientsController               │
│  ├─ CompanyController               │
│  ├─ PackagesController              │
│  └─ ElementsController              │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ BrandService                    │
│  ├─ ClientService                   │
│  └─ PackageService                  │
├─────────────────────────────────────┤
│  Data Layer (EF Core)               │
│  └─ SQL Server (BrandDB)            │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

- **Brand** - DJ brand/company profiles
- **BrandUser** - Users associated with brands
- **BrandCustomField** - Custom field definitions for brands
- **Client** - Customer/client records
- **ClientCustomField** - Custom field definitions for clients
- **Person** - Contact persons and stakeholders
- **Package** - Service packages and pricing
- **Element** - Package elements and components

## 🔌 API Endpoints

### Brand Management

- `GET /api/brands` - List all brands (paginated)
- `GET /api/brands/{id}` - Get brand details
- `POST /api/brands` - Create new brand
- `PUT /api/brands/{id}` - Update brand information
- `DELETE /api/brands/{id}` - Delete brand
- `GET /api/brands/{id}/users` - Get brand users
- `POST /api/brands/{id}/custom-fields` - Add custom field to brand

### Client Management

- `GET /api/clients` - List all clients (paginated, filterable)
- `GET /api/clients/{id}` - Get client details
- `POST /api/clients` - Add new client
- `PUT /api/clients/{id}` - Update client information
- `DELETE /api/clients/{id}` - Delete client
- `GET /api/clients/{id}/communication` - Get communication history
- `POST /api/clients/{id}/communication` - Log communication
- `POST /api/clients/{id}/custom-fields` - Add custom field value

### Package Management

- `GET /api/packages` - List all service packages
- `GET /api/packages/{id}` - Get package details
- `POST /api/packages` - Create new package
- `PUT /api/packages/{id}` - Update package
- `DELETE /api/packages/{id}` - Delete package
- `GET /api/packages/{id}/elements` - Get package elements

### Company Information

- `GET /api/company` - Get company/brand information
- `PUT /api/company` - Update company information

### Elements

- `GET /api/elements` - List package elements
- `GET /api/elements/{id}` - Get element details
- `POST /api/elements` - Create element
- `PUT /api/elements/{id}` - Update element
- `DELETE /api/elements/{id}` - Delete element

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core** - ORM for SQL Server
- **SQL Server** - Primary database
- **Redis** - Distributed caching
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Schema

The BrandDB contains the following tables:

- `Brands` - Brand/company information
- `BrandUsers` - Brand-User associations
- `BrandCustomFields` - Custom field definitions for brands
- `Clients` - Client/customer records
- `ClientCustomFields` - Custom field definitions for clients
- `Persons` - Contact persons
- `Packages` - Service packages and pricing
- `Elements` - Package components
- `Communications` - Client communication logs

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
       "DefaultConnection": "Server=localhost;Database=BrandDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
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

   Navigate to: http://localhost:5005/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10"
  },
  "Business": {
    "DefaultCurrency": "USD",
    "TaxRate": 0.0
  }
}
```

## 🏢 Business Features

### Custom Fields

Both Brands and Clients support custom fields for flexibility:

- Dynamic field definitions
- Various data types (text, number, date, boolean)
- Validation rules
- Field groups and categories

### Service Packages

Define reusable service packages with:

- Package name and description
- Base pricing
- Package elements/components
- Customizable offerings
- Package variations

### Client Communication

Track all client interactions:

- Email correspondence
- Phone calls
- Meetings
- Notes and comments
- Automated timestamps

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/CompanyAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **Role-Based Authorization** - Admin, DJ, Staff access levels
- **Data Isolation** - Brand-specific data separation
- **Audit Logging** - Track all data changes

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
SQL_CONNECTION_STRING=your-connection-string
DEFAULT_CURRENCY=USD
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t companyapi:latest .
```

### Run Container

```bash
docker run -d -p 5005:5005 \
  -e SQL_CONNECTION_STRING=your-connection \
  companyapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design

## 🤝 Integration with Other Services

The CompanyAPI integrates with:

- **IdentityAPI** - User authentication and brand association
- **PartyAPI** - Client events and bookings
- **DocumentsAPI** - Client contracts and documents
- **MailingAPI** - Client communication
- **DJ Panel Frontend** - CRM interface

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

- Advanced reporting and analytics
- Client portal for self-service
- Integration with accounting systems
- Lead scoring and pipeline management
- Marketing automation
- Client feedback and reviews

## 📞 Support

For issues related to CompanyAPI, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
