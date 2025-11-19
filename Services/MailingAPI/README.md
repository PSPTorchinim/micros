# MailingAPI - Email Campaign & Communication Service

## 📋 Overview

The MailingAPI service handles email campaigns, templates, and communication management for the DJ Beat Blaster platform. It uses MongoDB for flexible storage of email templates and campaign data.

**Port**: 5007  
**Database**: MongoDB (MailingDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides comprehensive email management for:

- Email template management
- Campaign creation and scheduling
- Mailing list management
- Email analytics and tracking
- Automated email workflows
- Bulk email sending
- Email personalization

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│        MailingAPI Service           │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ TemplatesController (TBD)       │
│  ├─ CampaignsController (TBD)       │
│  └─ MailingListsController (TBD)    │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ EmailTemplateService            │
│  ├─ CampaignService                 │
│  └─ EmailDeliveryService            │
├─────────────────────────────────────┤
│  Data Layer (MongoDB Driver)        │
│  └─ MongoDB (MailingDB)             │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

*Note: Entity structure to be defined based on business requirements*

Planned entities:
- **EmailTemplate** - Reusable email templates
- **Campaign** - Email campaigns
- **MailingList** - Subscriber lists
- **EmailLog** - Sent email records
- **EmailAnalytics** - Open rates, click rates, etc.

## 🔌 API Endpoints

### Email Templates

- `GET /api/templates` - List all email templates (paginated)
- `GET /api/templates/{id}` - Get template details
- `POST /api/templates` - Create new template
- `PUT /api/templates/{id}` - Update template
- `DELETE /api/templates/{id}` - Delete template
- `POST /api/templates/{id}/preview` - Preview template with sample data
- `POST /api/templates/{id}/test` - Send test email

### Campaign Management

- `GET /api/campaigns` - List all campaigns (paginated, filterable)
- `GET /api/campaigns/{id}` - Get campaign details
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/{id}` - Update campaign
- `DELETE /api/campaigns/{id}` - Delete campaign
- `POST /api/campaigns/{id}/send` - Send campaign
- `POST /api/campaigns/{id}/schedule` - Schedule campaign
- `GET /api/campaigns/{id}/analytics` - Get campaign analytics

### Mailing Lists

- `GET /api/mailing-lists` - List all mailing lists
- `GET /api/mailing-lists/{id}` - Get mailing list details
- `POST /api/mailing-lists` - Create new mailing list
- `PUT /api/mailing-lists/{id}` - Update mailing list
- `DELETE /api/mailing-lists/{id}` - Delete mailing list
- `POST /api/mailing-lists/{id}/subscribers` - Add subscribers
- `DELETE /api/mailing-lists/{id}/subscribers/{email}` - Remove subscriber

### Email Sending

- `POST /api/mailings/send` - Send individual email
- `POST /api/mailings/bulk-send` - Send bulk emails
- `GET /api/mailings/logs` - Get email sending logs
- `GET /api/mailings/{id}/status` - Check email delivery status

### Analytics

- `GET /api/analytics` - Get overall email analytics
- `GET /api/analytics/campaign/{id}` - Campaign-specific analytics
- `GET /api/analytics/template/{id}` - Template performance analytics
- `GET /api/analytics/engagement` - Engagement metrics

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **MongoDB Driver** - NoSQL database access
- **MongoDB** - Document database
- **MailKit/MimeKit** - Email sending library
- **RazorEngine** - Template rendering
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Collections

The MailingDB MongoDB database will contain the following collections (planned):

- `emailtemplates` - Email template definitions
- `campaigns` - Campaign records
- `mailinglists` - Subscriber lists
- `emaillogs` - Sent email history
- `analytics` - Email performance data
- `unsubscribes` - Unsubscribe records

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- MongoDB 6.0 or higher
- SMTP server credentials (Gmail, SendGrid, etc.)
- Visual Studio 2022 or VS Code

### Local Development

1. **Configure MongoDB Connection**

   Edit `appsettings.Development.json`:

   ```json
   {
     "MongoDB": {
       "ConnectionString": "mongodb://localhost:27017",
       "DatabaseName": "MailingDB"
     },
     "EmailSettings": {
       "SmtpHost": "smtp.gmail.com",
       "SmtpPort": 587,
       "SmtpUsername": "your-email@gmail.com",
       "SmtpPassword": "your-app-password",
       "FromEmail": "noreply@djbeatblaster.com",
       "FromName": "DJ Beat Blaster"
     }
   }
   ```

2. **Start MongoDB**

   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Start the Service**

   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger Documentation**

   Navigate to: http://localhost:5007/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "MailingDB"
  },
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10"
  },
  "EmailSettings": {
    "SmtpHost": "smtp.example.com",
    "SmtpPort": 587,
    "EnableSSL": true,
    "MaxEmailsPerHour": 1000
  }
}
```

## ✉️ Email Features

### Template Features

- **HTML Templates** - Rich HTML email designs
- **Variable Substitution** - Personalized content
- **Conditional Content** - Show/hide based on data
- **Responsive Design** - Mobile-friendly emails
- **Pre-built Layouts** - Common email layouts

### Template Variables

Common template variables:
- `{{RecipientName}}` - Recipient's name
- `{{EventDate}}` - Event date and time
- `{{CompanyName}}` - Company name
- `{{UnsubscribeLink}}` - Unsubscribe URL
- Custom variables per template

### Campaign Features

- **Scheduled Sending** - Send at specific date/time
- **A/B Testing** - Test different subject lines
- **Segmentation** - Target specific audience groups
- **Tracking** - Open rates, click rates
- **Bounce Handling** - Handle failed deliveries

### Email Types

- **Transactional** - Order confirmations, receipts
- **Marketing** - Promotional emails, newsletters
- **Notification** - Event reminders, alerts
- **Welcome** - New user/client onboarding
- **Follow-up** - Post-event feedback requests

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/MailingAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **Role-Based Authorization** - Campaign manager access
- **Email Validation** - Prevent invalid email addresses
- **Rate Limiting** - Prevent spam and abuse
- **Unsubscribe Links** - CAN-SPAM compliance
- **DKIM/SPF** - Email authentication

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
MONGODB_CONNECTION_STRING=mongodb://mongodb:27017
MONGODB_DATABASE_NAME=MailingDB
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
FROM_EMAIL=noreply@djbeatblaster.com
MAX_EMAILS_PER_HOUR=1000
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t mailingapi:latest .
```

### Run Container

```bash
docker run -d -p 5007:5007 \
  -e MONGODB_CONNECTION_STRING=mongodb://mongodb:27017 \
  -e SMTP_HOST=smtp.sendgrid.net \
  -e SMTP_PASSWORD=your-api-key \
  mailingapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design

## 🤝 Integration with Other Services

The MailingAPI integrates with:

- **IdentityAPI** - User authentication
- **CompanyAPI** - Client contact information
- **PartyAPI** - Event notifications
- **DocumentsAPI** - Attach documents to emails
- **DJ Panel Frontend** - Campaign management interface

## 🔧 Development Guidelines

### Adding New Template Types

1. Define template schema
2. Create template entity
3. Implement rendering logic
4. Add controller endpoints
5. Update Swagger documentation
6. Write unit tests

### Working with MongoDB

```csharp
// Example: Accessing MongoDB collection
var collection = _database.GetCollection<EmailTemplate>("emailtemplates");
var template = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
```

## 🎯 Future Enhancements

- **Email Builder** - Drag-and-drop template editor
- **Advanced Analytics** - Heatmaps, engagement scores
- **Integration** - SendGrid, Mailchimp, AWS SES
- **SMS Support** - Text message campaigns
- **Automation** - Triggered email workflows
- **List Segmentation** - Advanced targeting
- **Compliance** - GDPR, CAN-SPAM tools
- **Webhooks** - Real-time email event notifications

## 📊 Email Best Practices

### Deliverability

- Authenticate with SPF, DKIM, DMARC
- Maintain clean mailing lists
- Monitor bounce rates
- Avoid spam trigger words
- Include unsubscribe links

### Design

- Use responsive templates
- Keep subject lines under 50 characters
- Include clear call-to-action
- Optimize images for web
- Test across email clients

## 📞 Support

For issues related to MailingAPI, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
