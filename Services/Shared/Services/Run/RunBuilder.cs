using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shared.Services.Database;
using Shared.Services.Security;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace Shared.Services.App
{
    public static class RunBuilder
    {
        public static WebApplication BuildBasicApp(this WebApplication app, Action<SwaggerOptions>? options = null, Action<SwaggerUIOptions>? uiOptions = null)
        {
            app.Logger.LogInformation("CORS policy 'cors' is enabled");
            app.Logger.LogInformation("Configuring Swagger...");
            app.UseSwagger(options);
            app.Logger.LogInformation("Swagger is enabled");
            app.UseSwaggerUI(uiOptions);
            app.Logger.LogInformation("Swagger UI is enabled");
            app.UseRouting();
            app.UseCors("cors");
            app.Logger.LogInformation("Routing is enabled");
            app.UseStaticFiles();
            app.Logger.LogInformation("Static files middleware is enabled");
            app.UseAuthentication();
            app.Logger.LogInformation("Authentication middleware is enabled");
            app.UseAuthorization();
            app.Logger.LogInformation("Authorization middleware is enabled");
            app.MapHealthChecks("/healthz/live", new HealthCheckOptions
            {
            Predicate = _ => true // Perform all health checks
            });
            app.Logger.LogInformation("Health checks mapped to /healthz/live");
            app.MapControllers();
            app.Logger.LogInformation("Controllers mapped");
            return app;
        }

        public static async Task<WebApplication> BuildServicesAppAsync<S>(this WebApplication app, Func<WebApplication, Task<WebApplication>> func) where S : IDatabaseInitializer
        {
            ConfigureCommonMiddleware(app);
            await func(app);
            await InitializeDatabaseAsync<S>(app);
            return app;
        }

        public static async Task<WebApplication> BuildServicesAppAsync<S>(this WebApplication app) where S : IDatabaseInitializer
        {
            ConfigureCommonMiddleware(app);
            await InitializeDatabaseAsync<S>(app);
            return app;
        }

        private static void ConfigureCommonMiddleware(WebApplication app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseWhen(context => context.Request.Path.StartsWithSegments("/api"), appBuilder =>
            {
                appBuilder.UseMiddleware<SecureMiddleware>();
            });
        }

        private static async Task InitializeDatabaseAsync<S>(WebApplication app) where S : IDatabaseInitializer
        {
            using var scope = app.Services.CreateScope();
            var initializer = scope.ServiceProvider.GetRequiredService<S>();
            await initializer.InitializeAsync();
        }
    }
}
