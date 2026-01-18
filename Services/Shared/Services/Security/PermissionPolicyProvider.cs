using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Shared.Services.Security
{
    /// <summary>
    /// Custom authorization policy provider that creates policies dynamically for permissions.
    /// </summary>
    public class PermissionPolicyProvider : IAuthorizationPolicyProvider
    {
        private readonly DefaultAuthorizationPolicyProvider _fallbackPolicyProvider;

        public PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            _fallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }

        public Task<AuthorizationPolicy> GetDefaultPolicyAsync() =>
            _fallbackPolicyProvider.GetDefaultPolicyAsync();

        public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() =>
            _fallbackPolicyProvider.GetFallbackPolicyAsync();

        public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            // Check if this is a permission-based policy
            if (policyName.StartsWith(RequirePermissionAttribute.PolicyPrefix, StringComparison.OrdinalIgnoreCase))
            {
                var permission = policyName.Substring(RequirePermissionAttribute.PolicyPrefix.Length);
                var policy = new AuthorizationPolicyBuilder()
                    .AddRequirements(new PermissionRequirement(permission))
                    .Build();
                
                return Task.FromResult<AuthorizationPolicy?>(policy);
            }

            // Fall back to the default provider for other policies
            return _fallbackPolicyProvider.GetPolicyAsync(policyName);
        }
    }
}
