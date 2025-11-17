# PartyAPI - Event & Booking Management Service

## 📋 Overview

The PartyAPI service manages events, parties, and the booking system for the DJ Beat Blaster platform. It handles event creation, scheduling, venue management, and event performance tracking.

**Port**: 5006  
**Database**: SQL Server (PartyDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides comprehensive event management for:

- Event creation and management
- Booking and scheduling system
- Event timeline and planning
- Venue and location management
- Event performance tracking
- Guest list management (planned)
- Event timeline and milestones

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         PartyAPI Service            │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ EventsController (TBD)          │
│  ├─ BookingsController (TBD)        │
│  └─ VenuesController (TBD)          │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ EventService                    │
│  ├─ BookingService                  │
│  └─ VenueService                    │
├─────────────────────────────────────┤
│  Data Layer (EF Core)               │
│  └─ SQL Server (PartyDB)            │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

*Note: Entity structure to be defined based on business requirements*

Planned entities:
- **Event/Party** - Event details and information
- **Booking** - Event bookings and reservations
- **Venue** - Event locations and venues
- **EventTimeline** - Event schedules and milestones
- **GuestList** - Event attendees

## 🔌 API Endpoints

### Event Management

- `GET /api/events` - List all events (paginated, filterable)
- `GET /api/events/{id}` - Get event details
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event information
- `DELETE /api/events/{id}` - Cancel/delete event
- `GET /api/events/search` - Search events by date, venue, client
- `GET /api/events/{id}/timeline` - Get event timeline and schedule

### Booking Management

- `GET /api/bookings` - List all bookings (paginated, filterable)
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking
- `PUT /api/bookings/{id}/status` - Update booking status
- `GET /api/bookings/calendar` - Get calendar view of bookings

### Venue Management

- `GET /api/venues` - List all venues
- `GET /api/venues/{id}` - Get venue details
- `POST /api/venues` - Add new venue
- `PUT /api/venues/{id}` - Update venue information
- `DELETE /api/venues/{id}` - Remove venue
- `GET /api/venues/{id}/events` - Get events at venue

### Event Schedule

- `GET /api/events/{id}/schedule` - Get event schedule
- `PUT /api/events/{id}/schedule` - Update event schedule
- `POST /api/events/{id}/milestones` - Add event milestone
- `PUT /api/milestones/{id}` - Update milestone

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **Entity Framework Core** - ORM for SQL Server
- **SQL Server** - Primary database
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Schema

The PartyDB will contain the following tables (planned):

- `Events` - Event information
- `Bookings` - Booking records
- `Venues` - Venue information
- `EventTimelines` - Event schedules
- `EventMilestones` - Timeline milestones
- `GuestLists` - Event attendees
- `EventEquipment` - Equipment assignments
- `EventPlaylists` - Music selections

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
       "DefaultConnection": "Server=localhost;Database=PartyDB;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
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

   Navigate to: http://localhost:5006/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10"
  },
  "EventSettings": {
    "DefaultEventDuration": "4",
    "MinimumBookingNoticeDays": "7",
    "MaxEventsPerDay": "3"
  }
}
```

## 🎉 Event Features

### Event Types

- **Wedding** - Wedding celebrations
- **Corporate Event** - Company events
- **Private Party** - Birthday, anniversary parties
- **Club Night** - Nightclub events
- **Festival** - Music festivals
- **Concert** - Live performances
- **Bar/Bat Mitzvah** - Religious celebrations
- **School Dance** - Proms, homecoming

### Event Status

- **Inquiry** - Initial contact
- **Quote Sent** - Proposal sent to client
- **Booked** - Event confirmed
- **In Progress** - Event currently happening
- **Completed** - Event finished
- **Cancelled** - Event cancelled

### Booking Features

- Date and time scheduling
- Venue information
- Client details
- Equipment requirements
- Playlist selection
- Special requests
- Pricing and deposits
- Payment tracking

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/PartyAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **Role-Based Authorization** - DJ, Client, Admin access
- **Data Privacy** - Client information protection
- **Booking Verification** - Prevent double bookings

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
SQL_CONNECTION_STRING=your-connection-string
MIN_BOOKING_NOTICE_DAYS=7
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t partyapi:latest .
```

### Run Container

```bash
docker run -d -p 5006:5006 \
  -e SQL_CONNECTION_STRING=your-connection \
  partyapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design

## 🤝 Integration with Other Services

The PartyAPI integrates with:

- **IdentityAPI** - User authentication
- **CompanyAPI** - Client information
- **MusicAPI** - Event playlists
- **EquipmentAPI** - Equipment assignments
- **DocumentsAPI** - Contracts and event documents
- **MailingAPI** - Event notifications
- **DJ Panel Frontend** - Event management interface

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

- Real-time event updates (SignalR)
- Calendar synchronization (Google Calendar, iCal)
- Guest list management and RSVP tracking
- Event photo galleries
- Post-event feedback and reviews
- Automated reminders and notifications
- Event templates for quick setup
- Weather integration for outdoor events
- Social media integration
- Mobile app for on-site event management

## 📞 Support

For issues related to PartyAPI, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
