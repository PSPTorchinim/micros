# DocumentsAPI - Document Templates & Generation Service

The Documents service manages document templates, contracts, proposals, and handles document generation for the DJ Beat Blaster platform.

## 📋 Overview

DocumentsAPI provides comprehensive document management:

- Document template management
- Dynamic document generation
- PDF creation and processing
- Contract and proposal creation
- Document versioning and history
- Digital signature support
- Template variable substitution

## 🏗️ Technology Stack

- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: MongoDB (DocumentsDB)
- **Driver**: MongoDB.Driver
- **Authentication**: JWT Bearer Tokens
- **PDF Generation**: iTextSharp or PdfSharp
- **Logging**: Serilog with structured logging
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
DocumentsAPI/
├── Controllers/         # API endpoint controllers
├── Data/               # MongoDB context and configuration
├── Entities/           # Domain models and entities
├── Repositories/       # Data access layer
├── Services/           # Business logic services
├── Templates/          # Document template files
├── Properties/         # Launch settings
├── Program.cs          # Application entry point
├── appsettings.json    # Configuration files
└── DocumentsAPI.csproj # Project file
```

## 🚀 Getting Started

### Prerequisites

- .NET 9 SDK
- MongoDB (local or container)
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
       "DatabaseName": "DocumentsDB"
     }
   }
   ```

3. **Run the service**:
   ```bash
   dotnet run --launch-profile "Local Development"
   ```

4. **Access Swagger UI**: http://localhost:5004/swagger

## 🔌 API Endpoints

### Document Templates

#### GET /api/templates
Get list of document templates.

**Query Parameters**:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `category` - Filter by category (contract, proposal, invoice, agreement)
- `search` - Search by name or description

**Response**:
```json
{
  "items": [
    {
      "id": "template-id",
      "name": "DJ Service Contract",
      "description": "Standard DJ service agreement template",
      "category": "contract",
      "version": "2.0",
      "variables": ["clientName", "eventDate", "price", "venue"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalCount": 25
}
```

#### GET /api/templates/{id}
Get specific template details including content.

**Response**:
```json
{
  "id": "template-id",
  "name": "DJ Service Contract",
  "content": "This Agreement made on {{eventDate}}...",
  "variables": [
    {
      "name": "clientName",
      "type": "string",
      "required": true,
      "description": "Client full name"
    },
    {
      "name": "eventDate",
      "type": "date",
      "required": true,
      "description": "Event date"
    }
  ]
}
```

#### POST /api/templates
Create new document template.

**Request**:
```json
{
  "name": "Wedding Package Proposal",
  "description": "Proposal template for wedding DJ services",
  "category": "proposal",
  "content": "Dear {{clientName}},\n\nThank you for considering our DJ services...",
  "variables": [
    {
      "name": "clientName",
      "type": "string",
      "required": true
    },
    {
      "name": "packagePrice",
      "type": "number",
      "required": true
    }
  ]
}
```

#### PUT /api/templates/{id}
Update template (creates new version).

#### DELETE /api/templates/{id}
Delete template (soft delete).

### Document Generation

#### POST /api/documents/generate
Generate document from template.

**Request**:
```json
{
  "templateId": "template-id",
  "outputFormat": "pdf",
  "variables": {
    "clientName": "John Smith",
    "eventDate": "2024-07-15",
    "venue": "Grand Hotel Ballroom",
    "price": "2500.00",
    "djName": "DJ Mike"
  },
  "metadata": {
    "generatedBy": "user-id",
    "relatedEventId": "event-id"
  }
}
```

**Response**:
```json
{
  "documentId": "generated-doc-id",
  "fileUrl": "/documents/generated/doc-12345.pdf",
  "fileName": "DJ_Service_Contract_20240115.pdf",
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

#### POST /api/documents/generate-batch
Generate multiple documents from templates.

### Document Management

#### GET /api/documents
Get list of generated documents.

**Query Parameters**:
- `page` / `pageSize` - Pagination
- `templateId` - Filter by template
- `category` - Filter by category
- `startDate` / `endDate` - Date range
- `search` - Search by filename or metadata

#### GET /api/documents/{id}
Get document details and download URL.

#### GET /api/documents/{id}/download
Download document file.

#### DELETE /api/documents/{id}
Delete generated document.

### Digital Signatures

#### POST /api/documents/{id}/sign
Add digital signature to document.

**Request**:
```json
{
  "signedBy": "user-id",
  "signatureData": "base64-encoded-signature-image",
  "signedAt": "2024-01-15T10:30:00Z",
  "ipAddress": "192.168.1.1"
}
```

#### GET /api/documents/{id}/signatures
Get all signatures for a document.

## 🗄️ MongoDB Collections

### Templates Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "category": "string",
  "content": "string",
  "variables": [
    {
      "name": "string",
      "type": "string",
      "required": "boolean",
      "description": "string",
      "defaultValue": "any"
    }
  ],
  "version": "string",
  "isActive": "boolean",
  "createdBy": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Documents Collection
```json
{
  "_id": "ObjectId",
  "templateId": "string",
  "fileName": "string",
  "fileUrl": "string",
  "outputFormat": "string",
  "variableValues": "object",
  "metadata": {
    "generatedBy": "string",
    "relatedEventId": "string",
    "relatedClientId": "string"
  },
  "signatures": [
    {
      "signedBy": "string",
      "signedAt": "ISODate",
      "signatureData": "string",
      "ipAddress": "string",
      "verified": "boolean"
    }
  ],
  "status": "string",
  "generatedAt": "ISODate",
  "expiresAt": "ISODate"
}
```

### DocumentVersions Collection
```json
{
  "_id": "ObjectId",
  "templateId": "string",
  "version": "string",
  "content": "string",
  "changes": "string",
  "createdBy": "string",
  "createdAt": "ISODate"
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
DOCUMENTS_DATABASE_CATALOG=DocumentsDB

# Security
SECURE_KEY=YourSecureAPIKeyHere
JWT_KEY=YourJWTKey

# Storage
DOCUMENTS_STORAGE_PATH=/var/documents/generated
DOCUMENTS_MAX_SIZE_MB=50

# PDF Generation
PDF_FONT_PATH=/usr/share/fonts
PDF_DEFAULT_FONT=Arial

# Application
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:8080
```

## 📄 Document Categories

### Available Categories
- **Contracts**: Service agreements, terms and conditions
- **Proposals**: Service proposals, quotes, packages
- **Invoices**: Payment invoices, receipts
- **Agreements**: Partnership agreements, confidentiality agreements
- **Checklists**: Event checklists, equipment lists
- **Reports**: Performance reports, analytics

## 🎨 Template Variables

### Common Variable Types
- `string` - Text values
- `number` - Numeric values
- `date` - Date values
- `boolean` - Yes/No values
- `array` - Lists of items
- `object` - Complex nested data

### Variable Syntax
```
{{variableName}}              - Simple variable
{{#if condition}}...{{/if}}   - Conditional blocks
{{#each items}}...{{/each}}   - Loops
{{format date "YYYY-MM-DD"}}  - Formatted output
```

## 🧪 Testing

### Run Unit Tests
```bash
cd ../Tests/DocumentsAPI.Tests
dotnet test
```

### Test Scenarios
- Template CRUD operations
- Document generation
- Variable substitution
- PDF generation quality
- Signature handling

## 📊 Health Checks

The service exposes health check endpoints:

- **Liveness**: `/healthz/live` - Service is running
- **Readiness**: `/healthz/ready` - Service is ready (MongoDB connected, storage accessible)

## 🔍 Logging

Structured logging includes:
- Template operations
- Document generation events
- PDF creation activities
- Signature operations
- Storage operations
- Error tracking

## 🚀 Deployment

### Docker Build

```bash
docker build -f ../../Docker/infra/microservice.Dockerfile \
  --build-arg MICROSERVICE_NAME=DocumentsAPI \
  -t djbeatblaster/documents-api:latest \
  ../..
```

### Docker Run

```bash
docker run -d \
  --name documents-api \
  -p 5004:8080 \
  -v /path/to/documents:/var/documents/generated \
  -e DATABASE_HOST_MONGODB=mongodb \
  djbeatblaster/documents-api:latest
```

## 🤝 Integration with Other Services

- **DJHostGateway**: Routes document-related requests
- **IdentityAPI**: User authentication and signatures
- **PartyAPI**: Event contracts and documentation
- **CompanyAPI**: Client agreements and proposals
- **MailingAPI**: Email document attachments

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Services Overview](../README.md)
- [API Gateway Documentation](../DJHostGateway/README.md)

## 🐛 Troubleshooting

### PDF generation fails
- Check font paths are correct
- Verify storage path permissions
- Ensure sufficient disk space
- Check PDF library dependencies

### Variable substitution not working
- Verify variable names match exactly
- Check template syntax
- Ensure all required variables provided
- Review variable type compatibility

### Document not found after generation
- Check storage path configuration
- Verify file permissions
- Ensure MongoDB record created
- Review generation logs

For more help, see the [main troubleshooting guide](../../README.md#troubleshooting).
