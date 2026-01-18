using IdentityAPI.Data;
using IdentityAPI.Services.Security;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using Shared.Services.App;
using Shared.Services.Database;
using Shared.Services.Run;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();
builder.Services.BuildBasicServices(builder.Configuration, "Identity", "v0.0.1");
builder.Services.BuildScope<Program, SeedData, IdentityScope>(UseDatabase.ConfigureSqlServer<IdentityContext>);

// Register service API key authorization for service-to-service permission seeding
builder.Services.AddSingleton<IAuthorizationHandler, ServiceApiKeyAuthorizationHandler>();

// Add authorization policy for batch permission endpoint that allows either role-based or service API key auth
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PermissionBatchCreate", policy =>
    {
        policy.Requirements.Add(new ServiceApiKeyRequirement());
        // Users with permissions:create role can also use this endpoint
        policy.RequireAssertion(context =>
            context.User.IsInRole("permissions:create") ||
            context.HasSucceeded);
    });
});

var app = builder.Build();

app.BuildBasicApp();
await app.BuildServicesAppAsync<SeedData>(UseDatabase.UseSQLServerAsync<IdentityContext, Program>);

app.Run();
Log.CloseAndFlush();
