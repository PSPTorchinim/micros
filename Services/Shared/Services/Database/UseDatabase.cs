using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Shared.Services.Database
{
    public static class UseDatabase
    {
        private static string GetSQLConnectionString()
        {
            var catalog = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_CATALOG");
            var user = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_USER_SQLSERVER");
            var host = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_HOST_SQLSERVER");
            var port = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_PORT_SQLSERVER");
            var password = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_PASSWORD_SQLSERVER");
            return $"Data Source={host},{port};Initial Catalog={catalog};User Id={user};Password={password};Trust Server Certificate=True";
        }

        private static string GetMongoDBConnectionString()
        {
            var host = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_HOST_MONGODB");
            var port = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_PORT_MONGODB");
            var user = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_USER_MONGODB");
            var password = Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_PASSWORD_MONGODB");
            return $"mongodb://{user}:{password}@{host}:{port}";
        }

        public static void ConfigureSqlServer<TContext>(IServiceCollection services) where TContext : DbContext
        {
            var connectionString = GetSQLConnectionString();
            services.AddDbContext<TContext>((provider, opt) =>
            {
                opt.UseSqlServer(connectionString, options =>
                {
                    options.EnableRetryOnFailure(5);
                })/*.AddInterceptors(provider.GetRequiredService<SecondLevelCacheInterceptor>())*/;
            }, ServiceLifetime.Singleton);
        }

        public static void ConfigureMongoDBServer(IServiceCollection services)
        {
            var settings = MongoClientSettings.FromConnectionString(GetMongoDBConnectionString());
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            var client = new MongoClient(settings);
            services.AddSingleton(client);
        }

        private static async Task<WebApplication> UseDatabaseScopeAsync<C, P>(this WebApplication app, Func<C, Task<bool>> action) where C : DbContext
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<C>();
                var logger = services.GetRequiredService<ILogger<P>>();
                
                try
                {
                    await action(context);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred during database operation.");
                    throw;
                }
            }
            return app;
        }

        public static async Task<WebApplication> UseSQLServerAsync<C, P>(WebApplication app) where C : DbContext
        {
            var logger = app.Services.GetRequiredService<ILogger<P>>();
            return await app.UseDatabaseScopeAsync<C, P>(async context =>
            {
                try
                {
                    if (await context.Database.EnsureCreatedAsync())
                    {
                        logger.LogInformation("Database {DatabaseName} was created successfully", context.Database.GetDbConnection().Database);
                        return true;
                    }
                    
                    logger.LogInformation("Database {DatabaseName} already exists", context.Database.GetDbConnection().Database);
                    return false;
                }
                catch (Exception ex)
                {
                    var logger = app.Services.GetRequiredService<ILogger<P>>();
                    logger.LogWarning(ex, "Database setup failed, but continuing application startup");
                    return false;
                }
            });
        }
    }
}