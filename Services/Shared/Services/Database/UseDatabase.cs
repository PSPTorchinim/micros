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
            var catalog = Environment.GetEnvironmentVariable("DATABASE_CATALOG");
            var user = Environment.GetEnvironmentVariable("DATABASE_USER");
            var host = Environment.GetEnvironmentVariable("DATABASE_HOST");
            var port = Environment.GetEnvironmentVariable("DATABASE_PORT");
            var password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");
            return $"Data Source={host},{port};Initial Catalog={catalog};User Id={user};Password={password};Trust Server Certificate=True";
        }

        private static string GetMongoDBConnectionString()
        {
            var host = Environment.GetEnvironmentVariable("DATABASE_HOST");
            var port = Environment.GetEnvironmentVariable("DATABASE_PORT");
            var user = Environment.GetEnvironmentVariable("DATABASE_USER");
            var password = Environment.GetEnvironmentVariable("DATABASE_PASSWORD");
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
                try
                {
                    await action(context);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<P>>();
                    logger.LogError(ex, "An error occurred migration the DB.");
                }
            }
            return app;
        }

        public static async Task<WebApplication> UseSQLServerAsync<C, P>(WebApplication app) where C : DbContext
        {
            var x = await app.UseDatabaseScopeAsync<C, P>(async context =>
            {
                try
                {
                    await context.Database.EnsureCreatedAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            });
            return x;
        }
    }
}