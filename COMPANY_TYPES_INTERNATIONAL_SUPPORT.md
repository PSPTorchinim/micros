# Company Types with International Support

## Overview

This feature will implement a comprehensive, flexible company type system with full international support, allowing the platform to accommodate different legal entity types across multiple countries with country-specific form fields, validation rules, and localized content.

## Problem Statement

Currently, the company creation system uses a generic form that doesn't account for:
- Different legal entity types (LLC, Corporation, GmbH, S.A.S., Ltd, etc.)
- Country-specific legal requirements and fields
- Regional validation rules (tax IDs, registration numbers, etc.)
- Localized field labels and help text
- Dynamic form rendering based on company type selection

## Goals

### Primary Goals
1. **Flexible Company Type Management**: Allow business users to add, modify, and remove company types without code changes
2. **Country-Specific Support**: Each country can have its own set of legal entity types with specific requirements
3. **Dynamic Form Generation**: Forms automatically adapt based on selected country and company type
4. **Full Internationalization**: All labels, help text, and validation messages support multiple languages
5. **Locale-Based Default**: System automatically suggests company types based on user's locale/country

### Secondary Goals
- Validation rules per company type and country
- Historical tracking of company type changes
- Migration path for existing companies to new type system
- API for external systems to query available company types

## Architecture

### Database Schema

#### CompanyType Entity
```csharp
public class CompanyType
{
    public Guid Id { get; set; }
    public string Code { get; set; }           // e.g., "LLC", "GMBH", "SAS"
    public string CountryCode { get; set; }    // ISO 3166-1 alpha-2 (e.g., "US", "DE", "FR")
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public ICollection<CompanyTypeTranslation> Translations { get; set; }
    public ICollection<CompanyTypeField> Fields { get; set; }
}
```

#### CompanyTypeTranslation Entity
```csharp
public class CompanyTypeTranslation
{
    public Guid Id { get; set; }
    public Guid CompanyTypeId { get; set; }
    public string LanguageCode { get; set; }   // ISO 639-1 (e.g., "en", "de", "fr")
    public string Name { get; set; }           // Localized name
    public string Description { get; set; }    // Localized description
    
    // Navigation property
    public CompanyType CompanyType { get; set; }
}
```

#### CompanyTypeField Entity
```csharp
public class CompanyTypeField
{
    public Guid Id { get; set; }
    public Guid CompanyTypeId { get; set; }
    public string FieldKey { get; set; }       // e.g., "taxId", "registrationNumber"
    public string FieldType { get; set; }      // "text", "number", "email", "select"
    public bool IsRequired { get; set; }
    public string ValidationRegex { get; set; }
    public string ValidationMessage { get; set; }
    public int DisplayOrder { get; set; }
    public string DefaultValue { get; set; }
    public string Placeholder { get; set; }
    public int? MaxLength { get; set; }
    public int? MinLength { get; set; }
    
    // Navigation properties
    public CompanyType CompanyType { get; set; }
    public ICollection<CompanyTypeFieldTranslation> Translations { get; set; }
    public ICollection<CompanyTypeFieldOption> Options { get; set; }  // For select fields
}
```

#### CompanyTypeFieldTranslation Entity
```csharp
public class CompanyTypeFieldTranslation
{
    public Guid Id { get; set; }
    public Guid CompanyTypeFieldId { get; set; }
    public string LanguageCode { get; set; }
    public string Label { get; set; }
    public string HelpText { get; set; }
    public string ValidationMessage { get; set; }
    
    // Navigation property
    public CompanyTypeField Field { get; set; }
}
```

#### CompanyTypeFieldOption Entity
```csharp
public class CompanyTypeFieldOption
{
    public Guid Id { get; set; }
    public Guid CompanyTypeFieldId { get; set; }
    public string Value { get; set; }
    public int DisplayOrder { get; set; }
    
    // Navigation properties
    public CompanyTypeField Field { get; set; }
    public ICollection<CompanyTypeFieldOptionTranslation> Translations { get; set; }
}
```

#### CompanyTypeFieldOptionTranslation Entity
```csharp
public class CompanyTypeFieldOptionTranslation
{
    public Guid Id { get; set; }
    public Guid CompanyTypeFieldOptionId { get; set; }
    public string LanguageCode { get; set; }
    public string Label { get; set; }
    
    // Navigation property
    public CompanyTypeFieldOption Option { get; set; }
}
```

#### Brand Entity Extension
```csharp
public class Brand
{
    // Existing fields...
    
    public Guid? CompanyTypeId { get; set; }
    public string CompanyTypeData { get; set; }  // JSON storage for dynamic fields
    
    // Navigation property
    public CompanyType CompanyType { get; set; }
}
```

### API Endpoints

#### Company API

**Get Available Company Types**
```
GET /api/v1/CompanyTypes?countryCode={code}&languageCode={lang}
Response: List of available company types for the country with localized names
```

**Get Company Type Details**
```
GET /api/v1/CompanyTypes/{id}/fields?languageCode={lang}
Response: Company type with all fields, translations, and validation rules
```

**Create Company with Type**
```
POST /api/v1/Company
Body: {
  "name": "string",
  "companyTypeId": "guid",
  "companyTypeData": {
    "taxId": "value",
    "registrationNumber": "value",
    // ... dynamic fields based on company type
  },
  // ... existing fields
}
```

#### Admin API (for managing company types)

**Create Company Type**
```
POST /api/v1/Admin/CompanyTypes
[Authorize(Roles = "SuperOwner")]
```

**Update Company Type**
```
PUT /api/v1/Admin/CompanyTypes/{id}
[Authorize(Roles = "SuperOwner")]
```

**Add Field to Company Type**
```
POST /api/v1/Admin/CompanyTypes/{id}/fields
[Authorize(Roles = "SuperOwner")]
```

**Update Field Translations**
```
PUT /api/v1/Admin/CompanyTypes/{typeId}/fields/{fieldId}/translations
[Authorize(Roles = "SuperOwner")]
```

### Frontend Components

#### CompanyTypeSelector Component
- Dropdown to select company type based on user's country
- Shows localized company type names
- Triggers form field update when selection changes

#### DynamicCompanyForm Component
- Renders form fields dynamically based on selected company type
- Supports various field types (text, number, email, select, date)
- Client-side validation based on field rules
- Localized labels and help text

#### CompanyTypeAdmin Component (CMS)
- UI for business users to manage company types
- WYSIWYG interface for adding/editing fields
- Multi-language translation management
- Preview functionality to see form before publishing

### CMS Integration

#### Strapi Content Types

**company-type** (Collection Type)
- Fields match CompanyType entity
- Relations to translations and fields

**company-type-translation** (Collection Type)
- Linked to company-type
- Supports multiple languages

**company-type-field** (Collection Type)
- Linked to company-type
- Defines dynamic form fields

## Implementation Phases

### Phase 1: Database & Backend Foundation (Week 1-2)
- [ ] Create all entity models
- [ ] Create database migrations
- [ ] Implement CompanyTypeService with CRUD operations
- [ ] Add API endpoints for querying company types
- [ ] Add validation logic for dynamic fields
- [ ] Create seeding scripts for initial company types (US LLC, UK Ltd, DE GmbH, FR SAS)

### Phase 2: Frontend Components (Week 3-4)
- [ ] Create CompanyTypeSelector component
- [ ] Create DynamicCompanyForm component
- [ ] Update CompanyBlock to use new components
- [ ] Add localization support (i18n)
- [ ] Implement client-side validation
- [ ] Add unit tests for components

### Phase 3: CMS Admin Interface (Week 5-6)
- [ ] Create Strapi content types
- [ ] Build admin UI for managing company types
- [ ] Add translation management interface
- [ ] Implement field builder UI
- [ ] Add preview functionality
- [ ] Create user documentation

### Phase 4: Migration & Testing (Week 7-8)
- [ ] Create migration script for existing companies
- [ ] Comprehensive integration testing
- [ ] Performance testing with large datasets
- [ ] User acceptance testing
- [ ] Security audit
- [ ] Documentation finalization

## Example Company Types

### United States
1. **LLC (Limited Liability Company)**
   - Fields: EIN (Tax ID), State of Formation, Registered Agent
   - Validation: EIN format XX-XXXXXXX

2. **Corporation (C-Corp)**
   - Fields: EIN, State of Incorporation, Stock Class
   - Validation: EIN format XX-XXXXXXX

3. **S-Corporation**
   - Fields: EIN, State of Incorporation, Shareholder Count
   - Validation: EIN format XX-XXXXXXX, Max 100 shareholders

### Germany
1. **GmbH (Gesellschaft mit beschränkter Haftung)**
   - Fields: Handelsregisternummer, Amtsgericht, Geschäftsführer
   - Validation: HRB XXXXX format

2. **AG (Aktiengesellschaft)**
   - Fields: Handelsregisternummer, Grundkapital
   - Validation: Minimum capital €50,000

### France
1. **SAS (Société par Actions Simplifiée)**
   - Fields: SIRET, SIREN, Code APE
   - Validation: SIRET 14 digits, SIREN 9 digits

2. **SARL (Société à Responsabilité Limitée)**
   - Fields: SIRET, Capital Social
   - Validation: SIRET 14 digits

### United Kingdom
1. **Ltd (Private Limited Company)**
   - Fields: Company Number, Registered Office Address
   - Validation: 8-digit company number

2. **PLC (Public Limited Company)**
   - Fields: Company Number, Share Capital
   - Validation: Minimum capital £50,000

## Validation Rules Examples

```json
{
  "US_LLC_EIN": {
    "regex": "^\\d{2}-\\d{7}$",
    "message": "EIN must be in format XX-XXXXXXX"
  },
  "DE_GMBH_HRB": {
    "regex": "^HRB\\s?\\d{1,6}$",
    "message": "Handelsregisternummer must be in format HRB XXXXX"
  },
  "FR_SIRET": {
    "regex": "^\\d{14}$",
    "message": "SIRET must be 14 digits"
  },
  "UK_COMPANY_NUMBER": {
    "regex": "^\\d{8}$",
    "message": "Company number must be 8 digits"
  }
}
```

## Localization Strategy

### Supported Languages (Initial)
- English (en)
- German (de)
- French (fr)
- Spanish (es)
- Polish (pl)

### Translation Keys Structure
```
companyTypes.{countryCode}.{typeCode}.name
companyTypes.{countryCode}.{typeCode}.description
companyTypes.fields.{fieldKey}.label
companyTypes.fields.{fieldKey}.helpText
companyTypes.fields.{fieldKey}.validationMessage
```

### Example Translations
```json
{
  "en": {
    "companyTypes.US.LLC.name": "Limited Liability Company (LLC)",
    "companyTypes.US.LLC.description": "A flexible business structure that combines the pass-through taxation of a partnership or sole proprietorship with the limited liability of a corporation.",
    "companyTypes.fields.ein.label": "Employer Identification Number (EIN)",
    "companyTypes.fields.ein.helpText": "Your 9-digit federal tax ID in format XX-XXXXXXX"
  },
  "de": {
    "companyTypes.US.LLC.name": "Gesellschaft mit beschränkter Haftung (LLC)",
    "companyTypes.US.LLC.description": "Eine flexible Unternehmensstruktur, die die Durchlaufbesteuerung einer Personengesellschaft oder eines Einzelunternehmens mit der beschränkten Haftung einer Kapitalgesellschaft kombiniert.",
    "companyTypes.fields.ein.label": "Arbeitgeber-Identifikationsnummer (EIN)",
    "companyTypes.fields.ein.helpText": "Ihre 9-stellige Bundessteuer-ID im Format XX-XXXXXXX"
  }
}
```

## Security Considerations

1. **Authorization**
   - Only SuperOwner role can create/modify company types
   - Company owners can update their company's type-specific data
   - Read access based on company membership

2. **Validation**
   - Server-side validation of all dynamic fields
   - Country-specific validation rules enforced
   - SQL injection prevention via parameterized queries
   - XSS prevention on dynamic field rendering

3. **Data Privacy**
   - Sensitive company data (tax IDs, registration numbers) properly protected
   - Audit logging for all company type changes
   - GDPR compliance for data storage and deletion

## Performance Considerations

1. **Caching Strategy**
   - Cache company types by country (5-minute TTL)
   - Cache field definitions (10-minute TTL)
   - Cache translations (1-hour TTL)
   - Invalidate on admin updates

2. **Database Optimization**
   - Indexes on CompanyType.CountryCode
   - Indexes on CompanyTypeField.CompanyTypeId
   - Indexes on translation language codes
   - Composite index on (CompanyTypeId, LanguageCode)

3. **Query Optimization**
   - Eager loading of translations and fields
   - Pagination for admin lists
   - Lazy loading of field options

## Migration Strategy

### For Existing Companies
1. **Default Assignment**
   - Assign "Generic Company" type to existing companies
   - Migrate existing fields to CompanyTypeData JSON

2. **Optional Upgrade**
   - Notify company owners to update their company type
   - Provide migration wizard in UI
   - Allow gradual adoption

3. **Data Preservation**
   - Keep existing fields in Brand entity for backward compatibility
   - Dual-write to both old fields and CompanyTypeData during transition period

## Testing Strategy

### Unit Tests
- CompanyTypeService CRUD operations
- Validation logic for each country/type
- Translation fallback logic
- Dynamic field rendering

### Integration Tests
- End-to-end company creation with types
- Type switching for existing companies
- Multi-language form rendering
- API endpoint responses

### Performance Tests
- Load testing with 1000+ company types
- Concurrent company creation
- Cache invalidation scenarios

## Documentation Requirements

1. **Developer Documentation**
   - API endpoint specifications
   - Database schema diagrams
   - Integration guide for new countries
   - Code examples

2. **Admin User Guide**
   - How to add new company types
   - Managing translations
   - Field configuration guide
   - Best practices

3. **End User Guide**
   - How to select company type
   - Understanding type-specific fields
   - Updating company type
   - FAQ

## Success Metrics

1. **Adoption Rate**
   - % of new companies using type-specific forms
   - % of existing companies upgrading to new system

2. **Performance**
   - Company creation time < 2 seconds
   - Form rendering time < 500ms
   - API response time < 200ms

3. **Usability**
   - Reduction in form validation errors
   - User satisfaction score
   - Support ticket reduction

## Future Enhancements

1. **Additional Features**
   - Company type recommendations based on business description
   - Integration with government registration APIs
   - Automated validation via external services
   - Document templates per company type

2. **Advanced Validation**
   - Cross-field validation rules
   - Conditional field visibility
   - Real-time tax ID verification
   - Integration with business registries

3. **Analytics**
   - Company type distribution by country
   - Field completion rates
   - Validation error patterns
   - User journey analytics

## Dependencies

- **Backend**: .NET 8.0, Entity Framework Core 8.0
- **Frontend**: React 18+, TypeScript 5+
- **CMS**: Strapi 4+
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Localization**: i18next library

## Risks & Mitigation

1. **Legal Compliance**
   - Risk: Incorrect legal entity definitions
   - Mitigation: Legal review for each country, regular updates

2. **Data Migration**
   - Risk: Data loss during migration
   - Mitigation: Comprehensive backups, gradual rollout, rollback plan

3. **Performance**
   - Risk: Slow form rendering with many types
   - Mitigation: Aggressive caching, lazy loading, pagination

4. **Maintenance**
   - Risk: Keeping country data up-to-date
   - Mitigation: Admin tools for business users, API for external updates

## Timeline

- **Phase 1**: Weeks 1-2 (Database & Backend)
- **Phase 2**: Weeks 3-4 (Frontend Components)
- **Phase 3**: Weeks 5-6 (CMS Admin)
- **Phase 4**: Weeks 7-8 (Migration & Testing)
- **Total**: 8 weeks (2 months)

## Budget Estimate

- Development: 8 weeks × developer time
- Legal review: Per country consultation
- Testing: QA time across phases
- Documentation: Technical writer time

## Stakeholders

- **Product Owner**: Define business requirements
- **Legal Team**: Review legal entity definitions
- **Development Team**: Implementation
- **QA Team**: Testing and validation
- **Support Team**: User assistance and feedback
- **Business Users**: Company type management

## Approval Required From

- [ ] Product Owner
- [ ] Technical Lead
- [ ] Legal Team
- [ ] Security Team
- [ ] UX Team

---

**Document Version**: 1.0  
**Created**: 2026-01-24  
**Last Updated**: 2026-01-24  
**Status**: Draft  
**Owner**: Development Team
