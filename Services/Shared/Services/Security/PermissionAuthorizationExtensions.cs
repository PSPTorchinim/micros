using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Shared.Services.Security
{
    /// <summary>
    /// Extension methods for setting up permission-based authorization services.
    /// </summary>
    public static class PermissionAuthorizationExtensions
    {
        /// <summary>
        /// Adds permission-based authorization to the service collection.
        /// </summary>
        public static IServiceCollection AddPermissionAuthorization(this IServiceCollection services)
        {
            // Register the authorization handler
            services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
            
            // Register the custom policy provider
            services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();

            return services;
        }
    }
}
