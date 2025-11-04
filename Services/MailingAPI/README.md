# MailingAPI - Email Campaigns & Templates Service

The Mailing service manages email campaigns, templates, mailing lists, and communication workflows for the DJ Beat Blaster platform.

## 📋 Overview

MailingAPI provides comprehensive email management:

- Email template management
- Campaign creation and scheduling
- Mailing list management
- Email analytics and tracking
- Automated email workflows
- Bulk email sending
- Email delivery tracking

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: MongoDB (MailingDB)
- **Driver**: MongoDB.Driver
- **Email Service**: SMTP / SendGrid / AWS SES
- **Authentication**: JWT Bearer Tokens
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
MailingAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # MongoDB context and configuration
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic and email services
├── Templates/          # Email template files
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── MailingAPI.csproj   # Project file
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- MongoDB (local or container)
- SMTP server or email service credentials
- Visual Studio 2022 or VS Code

### Running Locally

1. **Ensure MongoDB is running**:
   ```bash
   docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
   ```

2. **Update connection string** in `appsettings.Development.json`:
   ```json
   {
     "MongoDB": {
       "ConnectionString": "mongodb://admin:password@localhost:27017",
       "DatabaseName": "MailingDB"
     },
     "EmailSettings": {
       "SmtpServer": "smtp.gmail.com",
       "SmtpPort": 587,
       "SenderEmail": "noreply@djbeatblaster.com",
       "SenderName": "DJ Beat Blaster"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5007/swagger

## 🔌 API Endpoints

### Email Templates

#### GET /api/templates
Get list of email templates.

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `category` - Filter by category (marketing, transactional, notification)
- `search` - Search by name or subject

**Response**:
```json
{
  "items": [
    {
      "id": "template-id",
      "name": "Event Confirmation",
      "subject": "Your Event is Confirmed - {{eventName}}",
      "category": "transactional",
      "description": "Email sent when event booking is confirmed",
      "previewText": "Thank you for booking with DJ Beat Blaster",
      "variables": ["eventName", "eventDate", "clientName"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 35
}
```

#### GET /api/templates/{id}
Get specific template with HTML content.

**Response**:
```json
{
  "id": "template-id",
  "name": "Event Confirmation",
  "subject": "Your Event is Confirmed - {{eventName}}",
  "htmlContent": "<!DOCTYPE html><html>...",
  "textContent": "Thank you for booking...",
  "category": "transactional",
  "variables": [
    {
      "name": "eventName",
      "type": "string",
      "required": true,
      "description": "Name of the event"
    }
  ]
}
```

#### POST /api/templates
Create new email template.

**Request**:
```json
{
  "name": "Welcome Email",
  "subject": "Welcome to DJ Beat Blaster, {{firstName}}!",
  "htmlContent": "<!DOCTYPE html><html>...",
  "textContent": "Welcome {{firstName}}...",
  "category": "marketing",
  "variables": [
    {
      "name": "firstName",
      "type": "string",
      "required": true
    }
  ]
}
```

#### PUT /api/templates/{id}
Update email template.

#### DELETE /api/templates/{id}
Delete template (soft delete).

### Email Campaigns

#### GET /api/campaigns
Get list of email campaigns.

**Query Parameters**:
- `page` / `pageSize` - Pagination
- `status` - Filter by status (draft, scheduled, sending, sent, paused)
- `startDate` / `endDate` - Date range

**Response**:
```json
{
  "items": [
    {
      "id": "campaign-id",
      "name": "Summer Promotion 2024",
      "subject": "Special Summer Rates for DJ Services",
      "templateId": "template-id",
      "status": "sent",
      "scheduledAt": "2024-06-01T10:00:00Z",
      "sentAt": "2024-06-01T10:02:00Z",
      "recipientCount": 250,
      "sentCount": 248,
      "openedCount": 125,
      "clickedCount": 45,
      "bounceCount": 2,
      "createdAt": "2024-05-25T00:00:00Z"
    }
  ]
}
```

#### GET /api/campaigns/{id}
Get detailed campaign information with analytics.

**Response**:
```json
{
  "id": "campaign-id",
  "name": "Summer Promotion 2024",
  "subject": "Special Summer Rates for DJ Services",
  "templateId": "template-id",
  "status": "sent",
  "mailingListIds": ["list-id-1", "list-id-2"],
  "scheduledAt": "2024-06-01T10:00:00Z",
  "sentAt": "2024-06-01T10:02:00Z",
  "statistics": {
    "recipientCount": 250,
    "sentCount": 248,
    "deliveredCount": 246,
    "openedCount": 125,
    "openRate": 50.81,
    "clickedCount": 45,
    "clickRate": 18.29,
    "bounceCount": 2,
    "bounceRate": 0.81,
    "unsubscribeCount": 3,
    "spamCount": 0
  },
  "createdBy": "user-id",
  "createdAt": "2024-05-25T00:00:00Z"
}
```

#### POST /api/campaigns
Create new email campaign.

**Request**:
```json
{
  "name": "Winter Holiday Special",
  "subject": "Book Your Holiday Events Now!",
  "templateId": "template-id",
  "mailingListIds": ["list-id-1"],
  "scheduledAt": "2024-11-01T09:00:00Z",
  "variables": {
    "discount": "20%",
    "validUntil": "December 31, 2024"
  }
}
```

#### PUT /api/campaigns/{id}
Update campaign (only if not sent).

#### POST /api/campaigns/{id}/send
Send campaign immediately or schedule.

#### POST /api/campaigns/{id}/pause
Pause ongoing campaign.

#### POST /api/campaigns/{id}/resume
Resume paused campaign.

### Mailing Lists

#### GET /api/lists
Get mailing lists.

**Response**:
```json
{
  "items": [
    {
      "id": "list-id",
      "name": "Active Clients",
      "description": "All active clients who opted in for marketing",
      "subscriberCount": 450,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/lists/{id}
Get mailing list with subscribers.

#### POST /api/lists
Create new mailing list.

**Request**:
```json
{
  "name": "Wedding Clients 2024",
  "description": "Clients interested in wedding services"
}
```

#### POST /api/lists/{id}/subscribers
Add subscribers to list.

**Request**:
```json
{
  "subscribers": [
    {
      "email": "client@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "customFields": {
        "eventType": "wedding"
      }
    }
  ]
}
```

#### DELETE /api/lists/{listId}/subscribers/{email}
Remove subscriber from list.

### Direct Email Sending

#### POST /api/mailings/send
Send individual email.

**Request**:
```json
{
  "to": "client@example.com",
  "subject": "Your Event Details",
  "templateId": "template-id",
  "variables": {
    "clientName": "John Doe",
    "eventDate": "July 15, 2024"
  },
  "attachments": [
    {
      "fileName": "contract.pdf",
      "contentType": "application/pdf",
      "base64Content": "..."
    }
  ]
}
```

#### POST /api/mailings/send-bulk
Send bulk emails to multiple recipients.

### Analytics

#### GET /api/analytics/campaigns/{id}
Get detailed campaign analytics.

#### GET /api/analytics/templates/{id}
Get template performance across campaigns.

#### GET /api/analytics/overview
Get overall mailing statistics.

**Response**:
```json
{
  "totalCampaigns": 50,
  "totalEmailsSent": 12500,
  "averageOpenRate": 45.2,
  "averageClickRate": 15.8,
  "totalUnsubscribes": 125,
  "totalBounces": 250
}
```

## 🗄️ MongoDB Collections

### EmailTemplates Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "subject": "string",
  "htmlContent": "string",
  "textContent": "string",
  "category": "string",
  "description": "string",
  "previewText": "string",
  "variables": [
    {
      "name": "string",
      "type": "string",
      "required": "boolean",
      "description": "string",
      "defaultValue": "any"
    }
  ],
  "isActive": "boolean",
  "createdBy": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Campaigns Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "subject": "string",
  "templateId": "string",
  "status": "string",
  "mailingListIds": ["string"],
  "scheduledAt": "ISODate",
  "sentAt": "ISODate",
  "pausedAt": "ISODate",
  "completedAt": "ISODate",
  "variables": "object",
  "statistics": {
    "recipientCount": "number",
    "sentCount": "number",
    "deliveredCount": "number",
    "openedCount": "number",
    "clickedCount": "number",
    "bounceCount": "number",
    "unsubscribeCount": "number",
    "spamCount": "number"
  },
  "createdBy": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### MailingLists Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "subscribers": [
    {
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "status": "string",
      "subscribedAt": "ISODate",
      "unsubscribedAt": "ISODate",
      "customFields": "object"
    }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### EmailLogs Collection
```json
{
  "_id": "ObjectId",
  "campaignId": "string",
  "recipientEmail": "string",
  "subject": "string",
  "status": "string",
  "sentAt": "ISODate",
  "deliveredAt": "ISODate",
  "openedAt": "ISODate",
  "clickedAt": "ISODate",
  "bouncedAt": "ISODate",
  "bounceReason": "string",
  "events": [
    {
      "type": "string",
      "timestamp": "ISODate",
      "metadata": "object"
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_HOST_MONGODB=localhost
DATABASE_PORT_MONGODB=27017
DATABASE_USER_MONGODB=admin
DATABASE_PASSWORD_MONGODB=password
MAILING_DATABASE_CATALOG=MailingDB

# Email Service
EMAIL_PROVIDER=smtp
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@djbeatblaster.com
SENDER_NAME=DJ Beat Blaster

# Alternative: SendGrid
# EMAIL_PROVIDER=sendgrid
# SENDGRID_API_KEY=your-api-key

# Alternative: AWS SES
# EMAIL_PROVIDER=ses
# AWS_ACCESS_KEY=your-key
# AWS_SECRET_KEY=your-secret
# AWS_REGION=us-east-1

# Security
SECURE_KEY=YourSecureAPIKeyHere
JWT_KEY=YourJWTKey

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 📧 Email Categories

### Template Categories
- **Transactional**: Event confirmations, receipts, password resets
- **Marketing**: Promotions, newsletters, announcements
- **Notification**: Reminders, alerts, updates
- **System**: Welcome emails, account notifications

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/MailingAPI.Tests
dotnet test
```

### Test Scenarios
- Template CRUD operations
- Campaign creation and scheduling
- Email sending
- Analytics tracking
- Mailing list management

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready (MongoDB and email service accessible)

## 🔍 Logging

Structured logging includes:
- Email sending events
- Campaign operations
- Template usage
- Delivery failures
- Analytics events

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=MailingAPI \
  -t djbeatblaster/mailing-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name mailing-api \
  -p 5007:8080 \
  -e DATABASE_HOST_MONGODB=mongodb \
  -e SMTP_SERVER=smtp.gmail.com \
  djbeatblaster/mailing-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes mailing-related requests
- **IdentityAPI**: User authentication
- **CompanyAPI**: Client email lists and contacts
- **PartyAPI**: Event-related email notifications
- **DocumentsAPI**: Email document attachments

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)

## 🐛 Troubleshooting

### Emails not sending
- Verify SMTP credentials
- Check firewall/port settings
- Ensure sender email is verified
- Review email service logs

### High bounce rate
- Validate email addresses before adding
- Clean mailing lists regularly
- Check sender reputation
- Review email content for spam triggers

### Low open rates
- Improve subject lines
- Optimize send times
- Segment mailing lists
- Test with different audiences

### Template variables not substituting
- Check variable syntax
- Verify variable names match
- Ensure all required variables provided
- Review template compilation

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
