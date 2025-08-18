using IdentityAPI.Repositories;
using IdentityAPI.Services;
using Shared.Services.App;

namespace IdentityAPI.Data
{
    public class IdentityScope : Scope
    {
        public override void CreateScope(IServiceCollection services)
        {
            services.AddScoped<IUsersRepository, UsersRepository>();
            services.AddScoped<IRolesRepository, RolesRepository>();
            services.AddScoped<IPermissionsRepository, PermissionsRepository>();

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUsersService, UsersService>();
            services.AddScoped<IRolesService, RolesService>();
            services.AddScoped<IPermissionsService, PermissionsService>();
        }
    }
}