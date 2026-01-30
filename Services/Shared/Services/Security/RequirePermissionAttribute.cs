using Microsoft.AspNetCore.Authorization;

namespace Shared.Services.Security
{
    /// <summary>
    /// Authorization attribute that requires a specific permission to access an endpoint.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class RequirePermissionAttribute : AuthorizeAttribute
    {
        public const string PolicyPrefix = "Permission:";

        public RequirePermissionAttribute(string permission)
        {
            Permission = permission;
            Policy = $"{PolicyPrefix}{permission}";
        }

        public string Permission { get; }
    }
}
