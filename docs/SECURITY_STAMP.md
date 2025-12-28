# Security Stamp Feature

## Overview

The security stamp feature forces users to be logged out from all devices when their password is changed. This is a critical security feature that prevents unauthorized access after a password change, ensuring that stolen or leaked credentials become invalid immediately.

## Architecture

### Components

1. **User Entity** - Extended with `SecurityStamp` and `LastPasswordChangeDate` fields
2. **SecurityStampService** - Manages security stamp generation and caching
3. **JWT Claims** - Security stamp is included in JWT tokens
4. **Validation Endpoint** - Identity API endpoint for validating security stamps
5. **API Gateway Transform** - YARP transform that validates security stamps on all requests

### Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Login                                                   │
│    - Generate new JWT with SecurityStamp claim                  │
│    - Return JWT to client                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Subsequent API Requests                                      │
│    - Gateway extracts SecurityStamp from JWT                    │
│    - Calls Identity API to validate stamp                       │
│    - Uses Redis cache (7-day TTL) to minimize DB queries        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. Password Change                                              │
│    - Generate new SecurityStamp                                 │
│    - Update LastPasswordChangeDate                              │
│    - Invalidate Redis cache                                     │
│    - All existing tokens become invalid                         │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Details

### Database Schema

Added fields to `Users` table:
- `SecurityStamp` (string, nullable): Unique identifier that changes when password changes
- `LastPasswordChangeDate` (DateTime, nullable): Timestamp of last password change

### Cache Strategy

- **Cache Key**: `user_security_{userId}`
- **TTL**: 7 days (configurable in SecurityStampService)
- **Purpose**: Reduce database load for frequent validation requests
- **Invalidation**: On password change (ChangePassword, ForgotPassword)

### JWT Token Structure

The security stamp is added as a claim in the JWT:

```json
{
  "Id": "user-guid",
  "Email": "user@example.com",
  "SecurityStamp": "32-character-hex-string",
  "role": ["permission1", "permission2"]
}
```

### API Gateway Validation

The gateway validation transform:
1. Skips validation for `/identity` endpoints (to avoid circular calls)
2. Skips validation for requests without Authorization header
3. Extracts SecurityStamp from JWT claims
4. Calls Identity API to validate against database/cache
5. Returns 401 if stamp is invalid or mismatched

### Circuit Breaker

Implements a simple circuit breaker to prevent cascading failures:
- Tracks consecutive validation service failures
- After 5 consecutive failures, denies all requests (fail-secure)
- Resets counter on successful validation

### Security Considerations

1. **Fail-Secure**: If validation service is unavailable, requests are denied (not allowed through)
2. **Timeout**: 5-second timeout on validation requests to prevent hanging
3. **No Bypass**: All authenticated requests (except identity endpoints) are validated
4. **Cache Invalidation**: Immediate invalidation ensures old tokens stop working quickly

## Usage

### For Users

When a user changes their password:
1. They will be immediately logged out from all devices
2. They must log in again with the new password
3. New JWT tokens will contain the updated security stamp

### For Developers

#### Generating a New Security Stamp

```csharp
var newStamp = _securityStampService.GenerateSecurityStamp();
user.SecurityStamp = newStamp;
user.LastPasswordChangeDate = DateTime.UtcNow;
await _usersRepository.Update(user);
await _securityStampService.InvalidateUserSecurityCacheAsync(user.Id);
```

#### Validating a Security Stamp

```csharp
var request = new ValidateSecurityStampRequestDTO 
{ 
    UserId = userId, 
    SecurityStamp = stampFromToken 
};
var result = await _usersService.ValidateSecurityStamp(request);

if (!result.IsValid) 
{
    // Return 401 Unauthorized
    // result.Reason contains explanation
}
```

## Testing

The feature includes comprehensive unit tests:
- SecurityStampService tests (6 tests)
- UsersService integration tests (5 additional tests)
- All existing tests continue to pass (48 total tests)

## Configuration

### Environment Variables

- `ASPNETCORE_IDENTITY_BE_ADDRESS`: URL of Identity API (required by Gateway)
- `ASPNETCORE_REDIS_HOST`: Redis host for caching (default: localhost)
- `ASPNETCORE_REDIS_PORT`: Redis port (default: 6379)
- `ASPNETCORE_REDIS_PASSWORD`: Redis password (optional)

### Cache TTL

To modify the cache duration, edit `SecurityStampService.cs`:

```csharp
private static readonly TimeSpan CacheDuration = TimeSpan.FromDays(7);
```

## Monitoring

### Logs

Key log messages to monitor:
- `"Security stamp validated successfully"` - Normal operation
- `"Security stamp validation failed"` - Invalid/expired stamp
- `"Circuit breaker open"` - Validation service down
- `"Security validation timeout"` - Performance issue

### Metrics to Track

- Validation request rate
- Cache hit ratio
- Circuit breaker trip count
- 401 response rate

## Future Enhancements

Potential improvements:
1. Per-device tracking with selective logout
2. Configurable cache TTL via configuration
3. Distributed circuit breaker with Redis
4. Metrics export to Prometheus/Grafana
5. Admin API to force logout specific users

## References

- [ASP.NET Core Identity Security Stamp](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-enable-qrcodes)
- [YARP Transforms Documentation](https://microsoft.github.io/reverse-proxy/articles/transforms.html)
- [Circuit Breaker Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
