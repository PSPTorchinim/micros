using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Sinks.Grafana.Loki;
using Shared.Configurations;
using Shared.Services.Database;
using Shared.Services.MessagesBroker.RabbitMQ;
using Shared.Services.Security;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Yarp.ReverseProxy.Swagger;
using Yarp.ReverseProxy.Swagger.Extensions;
using Yarp.ReverseProxy.Transforms;
using Scope = Shared.Services.App.Scope;

namespace Shared.Services.Run
{
    public static class ServicesBuilder
    {
        public static IServiceCollection BuildBasicServices(this IServiceCollection services, ConfigurationManager configuration, string name, string version, bool isApiGW = false)
        {
            var systemConfig = configuration.Get<SystemConfiguration>();
            services.AddControllers(options =>
            {
                // Configure cache profiles
                var cacheProfiles = Shared.Services.Cache.CacheProfiles.GetProfiles();
                foreach (var profile in cacheProfiles)
                {
                    options.CacheProfiles.Add(profile.Key, profile.Value);
                }
            }).AddJsonOptions(ConfigureJsonOptions);

            // Configure Serilog for structured logging with Loki
            ConfigureSerilog(name);
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.ClearProviders();
                loggingBuilder.AddSerilog();
            });

            services.ConfigureCors();
            services.ConfigureApiVersioning();
            services.ConfigureHealthChecks();
            services.ConfigureAuthentication(systemConfig);
            services.ConfigureSwagger(name, version, isApiGW);
            services.RegisterRabbitMQServices();

            if (!isApiGW)
            {
                Console.WriteLine("Configuring Redis for service: " + name);
                services.ConfigureRedis(name);
            }
            else
            {
                Console.WriteLine("Configuring Redis for API Gateway.");
                services.ConfigureRedis(name);
                Console.WriteLine("Building Reverse Proxy for API Gateway.");
                services.BuildReverseProxy(configuration);
            }

            // Add response caching
            services.AddResponseCaching();
            Console.WriteLine("Response caching configured.");

            Console.WriteLine("Basic services built for: " + name);
            return services;
        }

        private static void ConfigureSerilog(string serviceName)
        {
            try
            {
                var lokiUrlEnvVar = Environment.GetEnvironmentVariable("ASPNETCORE_LOKI_URL");
                var lokiUrl = lokiUrlEnvVar ?? "http://loki:3100";
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

                var loggerConfig = new LoggerConfiguration()
                    .MinimumLevel.Information()
                    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
                    .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Service", serviceName)
                    .Enrich.WithProperty("Environment", environment)
                    .Enrich.WithProperty("MachineName", System.Environment.MachineName)
                    .WriteTo.Console(
                        outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Service} {Message:lj}{NewLine}{Exception}"
                    );

                // Add Loki sink only if ASPNETCORE_LOKI_URL environment variable is explicitly set
                // This allows disabling Loki logging by not setting the environment variable
                if (!string.IsNullOrEmpty(lokiUrlEnvVar))
                {
                    try
                    {
                        var labels = new List<LokiLabel>
                        {
                            new() { Key = "service", Value = serviceName },
                            new() { Key = "environment", Value = environment },
                            new() { Key = "app", Value = "djbeatblaster" }
                        };

                        loggerConfig.WriteTo.GrafanaLoki(
                            lokiUrl,
                            labels: labels
                        );
                        Console.WriteLine($"Serilog configured for {serviceName} with Loki at {lokiUrl}");
                    }
#pragma warning disable CA1031 // Do not catch general exception types
                    catch (Exception ex)
#pragma warning restore CA1031 // Do not catch general exception types
                    {
                        // Intentionally catching all exceptions to ensure logging continues with console output
                        // if Loki sink configuration fails (e.g., network issues, invalid URL, library errors)
                        Console.WriteLine($"Warning: Failed to configure Loki sink: {ex.Message}. Continuing with console logging only.");
                    }
                }
                else
                {
                    Console.WriteLine($"Serilog configured for {serviceName} with console logging only (Loki URL not configured)");
                }

                Log.Logger = loggerConfig.CreateLogger();
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception ex)
#pragma warning restore CA1031 // Do not catch general exception types
            {
                // Intentionally catching all exceptions as a safety net to ensure the application
                // can still start with basic logging if Serilog configuration completely fails
                Console.WriteLine($"Error configuring Serilog: {ex.Message}. Using basic console logging.");
                Log.Logger = new LoggerConfiguration()
                    .WriteTo.Console()
                    .CreateLogger();
            }
        }

        private static void ConfigureJsonOptions(JsonOptions options)
        {
            options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            Console.WriteLine("Configured JSON options.");
        }

        private static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("cors", builder =>
                {
                    builder
                        .SetIsOriginAllowed(_ => true) // allow any origin dynamically
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });
            Console.WriteLine("CORS configured.");
        }

        private static void ConfigureApiVersioning(this IServiceCollection services)
        {
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1);
                options.ReportApiVersions = true;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = ApiVersionReader.Combine(
                    new UrlSegmentApiVersionReader(),
                    new HeaderApiVersionReader("X-Api-Version")
                );
            }).AddMvc().AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });
            Console.WriteLine("API Versioning configured.");
        }

        private static void ConfigureHealthChecks(this IServiceCollection services)
        {
            services.AddHealthChecks().AddCheck<SampleHealthCheck>("Sample");
            Console.WriteLine("Health checks configured.");
        }

        private static void ConfigureAuthentication(this IServiceCollection services, SystemConfiguration systemConfiguration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = systemConfiguration.TokenConfiguration.ValidateIssuer,
                        ValidIssuer = systemConfiguration.TokenConfiguration.Issuer,
                        ValidateAudience = systemConfiguration.TokenConfiguration.ValidateAudience,
                        ValidAudience = systemConfiguration.TokenConfiguration.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("ASPNETCORE_JWT_KEY") ?? ""))
                    };
                });
            Console.WriteLine("Authentication configured.");
        }

        private static void ConfigureSwagger(this IServiceCollection services, string name, string version, bool isApiGW)
        {
            services.AddSwaggerGen(c =>
            {
                if (isApiGW)
                    c.DocumentFilter<ReverseProxyDocumentFilter>();

                c.OperationFilter<AddHeaderParameter>();
                c.SwaggerDoc("v1", new OpenApiInfo { Title = $"{name} Microservice", Version = version });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT Token"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new List<string>()
                    }
                });
            });
            Console.WriteLine("Swagger configured.");
        }

        private static void ConfigureRedis(this IServiceCollection services, string name)
        {
            var connection = GetRedisConnectionString();
            services.AddStackExchangeRedisCache(options =>
            {
                options.InstanceName = $"{name}_";
                options.Configuration = connection;
            });

            // Register Redis ConnectionMultiplexer for advanced operations
            // Using lazy initialization to avoid blocking during startup
            services.AddSingleton<StackExchange.Redis.IConnectionMultiplexer>(sp =>
            {
                return StackExchange.Redis.ConnectionMultiplexer.Connect(connection);
            });

            // Register cache service
            services.AddScoped<Shared.Services.Cache.ICacheService>(provider =>
            {
                var distributedCache = provider.GetRequiredService<Microsoft.Extensions.Caching.Distributed.IDistributedCache>();
                var logger = provider.GetRequiredService<Microsoft.Extensions.Logging.ILogger<Shared.Services.Cache.RedisCacheService>>();
                var connectionMultiplexer = provider.GetRequiredService<StackExchange.Redis.IConnectionMultiplexer>();
                return new Shared.Services.Cache.RedisCacheService(distributedCache, logger, connectionMultiplexer, $"{name}_");
            });

            Console.WriteLine($"Redis configured with connection: {connection}");
            // services.AddEFSecondLevelCache(options => options.UseStackExchangeRedisCacheProvider(connection, TimeSpan.FromMinutes(5)));
        }

        private static IServiceCollection BuildReverseProxy(this IServiceCollection services, ConfigurationManager configuration)
        {
            var reverseProxyConfig = new ReverseProxyConfig();
            configuration.GetSection("ReverseProxy").Bind(reverseProxyConfig);
            foreach (var cluster in reverseProxyConfig.Clusters)
            {
                foreach (var destination in cluster.Value.Destinations)
                {
                    destination.Value.Address = Environment.GetEnvironmentVariable(destination.Value.Address.TrimStart('$', '{').TrimEnd('}')) ?? destination.Value.Address;
                    Console.WriteLine("Reverse proxy destination address: " + destination.Value.Address);
                }
            }

            var configBuilder = new ConfigurationBuilder();
            AddReverseProxyConfig(configBuilder, reverseProxyConfig, "ReverseProxy");

            var reverseProxyConfiguration = configBuilder.Build();

            services.AddReverseProxy()
                .LoadFromConfig(reverseProxyConfiguration.GetSection("ReverseProxy"))
                .AddSwagger(reverseProxyConfiguration.GetSection("ReverseProxy"))
                .AddTransforms(builderContext =>
                {
                    builderContext.AddRequestTransform(ctx =>
                    {
                        if (ctx.HttpContext.Request.Headers.TryGetValue("secure_key", out var val))
                        {
                            ctx.ProxyRequest.Headers.Remove("secure_key");
                            ctx.ProxyRequest.Headers.Add("secure_key", (IEnumerable<string>)val);
                        }
                        return ValueTask.CompletedTask;
                    });
                })
                .ConfigureHttpClient((context, handler) =>
                {
                    handler.ActivityHeadersPropagator = DistributedContextPropagator.CreatePassThroughPropagator();
                });

            Console.WriteLine("Reverse proxy built with secure_value header forwarding.");
            return services;
        }

        private static void AddReverseProxyConfig(ConfigurationBuilder builder, object config, string prefix)
        {
            foreach (var property in config.GetType().GetProperties())
            {
                var value = property.GetValue(config);

                if (value == null) continue;

                var fullKey = prefix == "" ? property.Name : $"{prefix}:{property.Name}";

                if (property.PropertyType.IsClass && !property.PropertyType.Namespace.StartsWith("System")) // Check if it's a custom class
                {
                    AddReverseProxyConfig(builder, value, fullKey); // Recursive call
                }
                else if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(Dictionary<,>))
                {
                    var keyType = property.PropertyType.GetGenericArguments()[0];
                    var valueType = property.PropertyType.GetGenericArguments()[1];
                    var dictionary = (System.Collections.IDictionary)value;

                    foreach (var key in dictionary.Keys)
                    {
                        var dictValue = dictionary[key];
                        if (dictValue != null)
                        {
                            if (dictValue.GetType().IsClass && !dictValue.GetType().Namespace.StartsWith("System"))
                            {
                                AddReverseProxyConfig(builder, dictValue, $"{fullKey}:{key}");
                            }
                            else
                            {
                                builder.AddInMemoryCollection(new[] { new KeyValuePair<string, string>($"{fullKey}:{key}", dictValue.ToString()) });
                            }
                        }
                    }
                }
                else if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(List<>))
                {
                    var listType = property.PropertyType.GetGenericArguments()[0];
                    var list = (System.Collections.IList)value;
                    for (int i = 0; i < list.Count; i++)
                    {
                        var listItem = list[i];
                        if (listItem != null)
                        {
                            if (listItem.GetType().IsClass && !listItem.GetType().Namespace.StartsWith("System"))
                            {
                                AddReverseProxyConfig(builder, listItem, $"{fullKey}:{i}");
                            }
                            else
                            {
                                builder.AddInMemoryCollection(new[] { new KeyValuePair<string, string>($"{fullKey}:{i}", listItem.ToString()) });
                            }
                        }

                    }
                }
                else
                {
                    builder.AddInMemoryCollection(new[] { new KeyValuePair<string, string>(fullKey, value.ToString()) });
                }
            }
        }

        private static string GetRedisConnectionString()
        {
            var host = Environment.GetEnvironmentVariable("ASPNETCORE_REDIS_HOST") ?? "localhost";
            var port = Environment.GetEnvironmentVariable("ASPNETCORE_REDIS_PORT") ?? "6379";
            var connection = $"{host}:{port}";
            var password = Environment.GetEnvironmentVariable("ASPNETCORE_REDIS_PASSWORD");
            Console.WriteLine("Using production Redis connection string.");
            return $"{connection}, password={password}";
        }

        private static void RegisterRabbitMQServices(this IServiceCollection services)
        {
            services.AddScoped<RabbitMQProducerService>();
            services.AddScoped<RabbitMQConsumerService>();
            Console.WriteLine("RabbitMQ services registered.");
        }

        public static IServiceCollection BuildScope<P, S, Sc>(this IServiceCollection services, Action<IServiceCollection> configureDbContext) where S : IDatabaseInitializer where Sc : Scope, new()
        {
            services.AddHttpContextAccessor();
            configureDbContext(services);
            new Sc().CreateScope(services);
            services.AddAutoMapper(cfg => cfg.AddMaps(typeof(P).Assembly));
            services.AddScoped(typeof(S));
            Console.WriteLine($"Scope built for {typeof(P).Name}, {typeof(S).Name}, {typeof(Sc).Name}.");
            return services;
        }
    }
}
