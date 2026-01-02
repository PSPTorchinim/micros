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

            var encodedUser = Uri.EscapeDataString(user ?? "");
            var encodedPassword = Uri.EscapeDataString(password ?? "");

            return $"mongodb://{encodedUser}:{encodedPassword}@{host}:{port}/?authSource=admin";
        }


        public static void ConfigureSqlServer<TContext>(IServiceCollection services) where TContext : DbContext
        {
            var connectionString = GetSQLConnectionString();
            services.AddDbContextFactory<TContext>((provider, opt) =>
            {
                opt.UseSqlServer(connectionString, options =>
                {
                    options.EnableRetryOnFailure(5);
                })/*.AddInterceptors(provider.GetRequiredService<SecondLevelCacheInterceptor>())*/;
            });
        }

        public static void ConfigureMongoDBServer(IServiceCollection services)
        {
            var connectionString = GetMongoDBConnectionString();
            Console.WriteLine($"MongoDB Connection String: {connectionString}");
            Console.WriteLine($"Attempting MongoDB connection with URI format (credentials masked)");

            var settings = MongoClientSettings.FromConnectionString(connectionString);
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);

            // Add connection timeout and retry settings for better reliability
            settings.ConnectTimeout = TimeSpan.FromSeconds(30);
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(30);
            settings.SocketTimeout = TimeSpan.FromSeconds(30);
            settings.MaxConnectionIdleTime = TimeSpan.FromSeconds(60);
            settings.MaxConnectionLifeTime = TimeSpan.FromSeconds(300);

            // Enable retryable writes for better reliability
            settings.RetryWrites = true;
            settings.RetryReads = true;

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
                    logger.LogInformation("Applying database migrations for {DatabaseName}", context.Database.GetDbConnection().Database);
                    await context.Database.MigrateAsync();
                    logger.LogInformation("Database migrations applied successfully for {DatabaseName}", context.Database.GetDbConnection().Database);
                    return true;
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Database migration failed for {DatabaseName}", context.Database.GetDbConnection().Database);
                    logger.LogWarning("Continuing application startup despite migration failure");
                    return false;
                }
            });
        }
    }
}