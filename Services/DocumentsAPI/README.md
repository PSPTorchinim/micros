# DocumentsAPI - Document & Template Management Service

## 📋 Overview

The DocumentsAPI service manages document templates, contract generation, invoicing, and document processing for the DJ Beat Blaster platform. It uses MongoDB for flexible document storage and supports PDF generation.

**Port**: 5004  
**Database**: MongoDB (DocumentsDB)  
**Framework**: .NET 9 + ASP.NET Core Web API

## 🎯 Purpose

This service provides comprehensive document management for:

- Contract template management
- Document generation from templates
- Invoice creation and management
- PDF generation and processing
- Document versioning and history
- Digital signature support (planned)

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│       DocumentsAPI Service          │
├─────────────────────────────────────┤
│  Controllers                        │
│  ├─ DocumentTemplatesController     │
│  ├─ DocumentsController             │
│  └─ InvoicesController              │
├─────────────────────────────────────┤
│  Services                           │
│  ├─ TemplateService                 │
│  ├─ DocumentGenerationService       │
│  └─ InvoiceService                  │
├─────────────────────────────────────┤
│  Data Layer (MongoDB Driver)        │
│  └─ MongoDB (DocumentsDB)           │
└─────────────────────────────────────┘
```

## 📦 Domain Entities

- **DocumentTemplate** - Reusable document templates
- **Document** - Generated documents from templates
- **Invoice** - Financial invoices and billing documents

## 🔌 API Endpoints

### Document Templates

- `GET /api/templates` - List all document templates (paginated)
- `GET /api/templates/{id}` - Get template details
- `POST /api/templates` - Create new template
- `PUT /api/templates/{id}` - Update template
- `DELETE /api/templates/{id}` - Delete template
- `GET /api/templates/search` - Search templates by type or name
- `POST /api/templates/{id}/clone` - Clone existing template

### Document Generation

- `GET /api/documents` - List all generated documents (paginated)
- `GET /api/documents/{id}` - Get document details
- `POST /api/documents/generate` - Generate document from template
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document
- `GET /api/documents/{id}/download` - Download document as PDF
- `POST /api/documents/{id}/send` - Email document to recipient

### Invoice Management

- `GET /api/invoices` - List all invoices (paginated, filterable)
- `GET /api/invoices/{id}` - Get invoice details
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/{id}` - Update invoice
- `DELETE /api/invoices/{id}` - Delete invoice
- `GET /api/invoices/{id}/pdf` - Generate invoice PDF
- `POST /api/invoices/{id}/send` - Send invoice via email
- `PUT /api/invoices/{id}/status` - Update invoice status (draft, sent, paid, etc.)

## 🛠️ Technology Stack

- **.NET 9** - Application framework
- **ASP.NET Core Web API** - REST API framework
- **MongoDB Driver** - NoSQL database access
- **MongoDB** - Document database
- **Redis** - Distributed caching
- **RazorEngine** - Template rendering
- **iTextSharp/QuestPDF** - PDF generation
- **AutoMapper** - Object mapping
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation

## 📊 Database Collections

The DocumentsDB MongoDB database contains the following collections:

- `documenttemplates` - Template definitions and content
- `documents` - Generated documents
- `invoices` - Invoice records
- `documenthistory` - Version history (planned)

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- MongoDB 6.0 or higher
- Visual Studio 2022 or VS Code

### Local Development

1. **Configure MongoDB Connection**

   Edit `appsettings.Development.json`:

   ```json
   {
     "MongoDB": {
       "ConnectionString": "mongodb://localhost:27017",
       "DatabaseName": "DocumentsDB"
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

   Navigate to: http://localhost:5004/swagger

### Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "DocumentsDB"
  },
  "TokenConfiguration": {
    "Audience": "JWTServicePostmanClient",
    "Issuer": "JWTServiceAccessToken",
    "TokenExpireTime": "10"
  },
  "DocumentSettings": {
    "TemplatePath": "/data/templates",
    "OutputPath": "/data/generated",
    "MaxFileSizeMB": 50
  }
}
```

## 📄 Template Features

### Template Variables

Templates support variable substitution:

- `{{ClientName}}` - Client name
- `{{EventDate}}` - Event date
- `{{TotalAmount}}` - Total amount
- `{{CompanyName}}` - Company name
- Custom variables per template type

### Template Types

- **Contract** - Service agreements and contracts
- **Proposal** - Event proposals and quotes
- **Invoice** - Financial invoices
- **Agreement** - Legal agreements
- **Receipt** - Payment receipts
- **Letter** - Correspondence templates

### Document Formats

- **HTML** - Web-friendly format
- **PDF** - Print-ready documents
- **Plain Text** - Simple text format
- **Markdown** - Structured text format

## 🧪 Testing

### Run Unit Tests

```bash
cd ../../Tests/DocumentsAPI.Tests
dotnet test
```

### Integration Tests

```bash
dotnet test --filter Category=Integration
```

## 🔐 Security Features

- **JWT Authentication** - Secure API access
- **Role-Based Authorization** - Document access control
- **File Type Validation** - Prevent malicious uploads
- **Size Limits** - Prevent resource exhaustion
- **Watermarking** - Document authenticity (planned)

## 📝 Environment Variables

Required environment variables for production:

```bash
JWT_SECRET_KEY=your-secret-key-here
MONGODB_CONNECTION_STRING=mongodb://mongodb:27017
MONGODB_DATABASE_NAME=DocumentsDB
TEMPLATE_PATH=/var/lib/djbeatblaster/templates
OUTPUT_PATH=/var/lib/djbeatblaster/documents
```

## 🐳 Docker

### Build Docker Image

```bash
docker build -t documentsapi:latest .
```

### Run Container

```bash
docker run -d -p 5004:5004 \
  -v /path/to/templates:/data/templates \
  -v /path/to/documents:/data/generated \
  -e MONGODB_CONNECTION_STRING=mongodb://mongodb:27017 \
  documentsapi:latest
```

## 📚 Related Documentation

- [Main Project README](../../README.md) - Platform overview
- [Services Overview](../README.md) - All microservices
- [Database Architecture](../../DATABASE_ARCHITECTURE.md) - Database design

## 🤝 Integration with Other Services

The DocumentsAPI integrates with:

- **IdentityAPI** - User authentication
- **CompanyAPI** - Client and brand data
- **PartyAPI** - Event information
- **MailingAPI** - Document distribution via email
- **DJ Panel Frontend** - Document management interface

## 🔧 Development Guidelines

### Adding New Template Types

1. Define template schema
2. Create template entity
3. Implement template service logic
4. Add controller endpoints
5. Update Swagger documentation
6. Write unit tests

### Working with MongoDB

```csharp
// Example: Accessing MongoDB collection
var collection = _database.GetCollection<DocumentTemplate>("documenttemplates");
var template = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
```

## 🎯 Future Enhancements

- Digital signature integration (DocuSign, Adobe Sign)
- Advanced PDF editing capabilities
- Template marketplace and sharing
- Version control and change tracking
- Collaborative document editing
- OCR for scanned documents
- Document archival and retention policies

## 📞 Support

For issues related to DocumentsAPI, please refer to the main project repository or contact the development team.

---

**Developed by PSPTorchinim**
