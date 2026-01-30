# Company API Permission-Based Authorization

## Overview

The Company API now implements permission-based authorization to control access to various endpoints. This system checks JWT token claims to verify if a user has the required permissions before allowing access to protected operations.

## Permission Model

The authorization system uses three distinct permissions for the Company API:

### 1. `company:read`
**Who should have it:** All company members

**Grants access to:**
- `GET /v1/Company` - View company details
- `GET /v1/Company/users` - View company users list
- `GET /v1/Company/structure` - View company organizational structure

### 2. `company:update`
**Who should have it:** Company owners and administrators

**Grants access to:**
- `PUT /v1/Company` - Update company details
- `PUT /v1/Company/structure` - Update company organizational structure

### 3. `company:users:manage`
**Who should have it:** Company owners and administrators

**Grants access to:**
- `POST /v1/Company/users` - Add users to the company
- `DELETE /v1/Company/users/{userId}` - Remove users from the company

### No Permission Required
These endpoints are available to all authenticated users:
- `GET /v1/Company/membership` - Check if user is a member of any company

## Implementation Details

### How It Works

1. **JWT Claims**: The system expects permissions to be included in the JWT token as a `permissions` claim
2. **Format**: Permissions should be comma-separated in the JWT claim: `"permissions": "company:read,company:update"`
3. **Authorization Handler**: The `PermissionAuthorizationHandler` validates the user's permissions on each request
4. **Policy Provider**: The `PermissionPolicyProvider` dynamically creates authorization policies for each permission

### JWT Token Example

```json
{
  "sub": "user-id-123",
  "userId": "user-id-123",
  "email": "user@example.com",
  "permissions": "company:read,company:update,company:users:manage",
  "exp": 1234567890
}
```

## Setup Instructions

### Backend Setup

The permission authorization is automatically registered in all services through the `BuildBasicServices` method in `ServicesBuilder.cs`. No additional configuration is needed in individual services.

### Adding Permissions to JWT Tokens

To use this system, the Identity service must be updated to include permissions in the JWT tokens it generates:

1. **Determine User Permissions**: Based on user's role or company membership
2. **Add to Claims**: Include permissions as a comma-separated string in the "permissions" claim
3. **Example** (in token generation code):
   ```csharp
   claims.Add(new Claim("permissions", string.Join(",", userPermissions)));
   ```

## Usage Examples

### Protected Endpoint

```csharp
[HttpPut]
[RequirePermission("company:update")]
public async Task<IActionResult> UpdateCompanyV1(UpdateCompanyDTO updateDto)
{
    return await Handle(async () => await CompanyService.UpdateCompany(updateDto));
}
```

### Multiple Permissions (use multiple attributes)

```csharp
[HttpPost("sensitive-operation")]
[RequirePermission("company:update")]
[RequirePermission("company:users:manage")]
public async Task<IActionResult> SensitiveOperationV1()
{
    // Requires BOTH permissions
    return await Handle(async () => await CompanyService.DoSensitiveOperation());
}
```

## Authorization Responses

- **200 OK**: User has the required permission and operation succeeded
- **401 Unauthorized**: User is not authenticated
- **403 Forbidden**: User is authenticated but lacks the required permission

## Recommended Permission Assignment

### Company Owner
```
company:read
company:update
company:users:manage
```

### Company Administrator
```
company:read
company:update
company:users:manage
```

### Company Member (Regular)
```
company:read
```

## Future Considerations

1. **Role-Based Assignment**: Consider implementing roles (Owner, Admin, Member) that automatically grant permission sets
2. **Permission Hierarchy**: Implement permission inheritance (e.g., `company:admin` includes all company permissions)
3. **Dynamic Permissions**: Allow permission assignment through the IdentityAPI
4. **Audit Logging**: Log permission checks for security auditing

## Testing

When testing endpoints with permission requirements, ensure your JWT token includes the necessary permissions in the claims. For development/testing, you can use tools like jwt.io to decode and verify token claims.
