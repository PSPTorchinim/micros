using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Shared.Configurations;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.MessagesBroker.RabbitMQ;
using Shared.Services.Security;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Yarp.ReverseProxy.Swagger;
using Yarp.ReverseProxy.Swagger.Extensions;

namespace Shared.Services.Run
{
    public static class ServicesBuilder
    {
        public static IServiceCollection BuildBasicServices(this IServiceCollection services, ConfigurationManager configuration, string name, string version, bool isApiGW = false)
        {
            var systemConfig = configuration.Get<SystemConfiguration>();
            services.AddControllers().AddJsonOptions(ConfigureJsonOptions);
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
                // Add other logging providers/configuration as needed
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
                Console.WriteLine("Building Reverse Proxy for API Gateway.");
                services.BuildReverseProxy(configuration);
            }

            Console.WriteLine("Basic services built for: " + name);
            return services;
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
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
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
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_KEY") ?? ""))
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
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id="Bearer" }
                        }, new string[]{}
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
            var host = Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost";
            var port = Environment.GetEnvironmentVariable("REDIS_PORT") ?? "6379";
            var connection = $"{host}:{port}";
            var password = Environment.GetEnvironmentVariable("REDIS_PASSWORD");
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
            services.AddAutoMapper(typeof(P));
            services.AddScoped(typeof(S));
            Console.WriteLine($"Scope built for {typeof(P).Name}, {typeof(S).Name}, {typeof(Sc).Name}.");
            return services;
        }
    }
}
