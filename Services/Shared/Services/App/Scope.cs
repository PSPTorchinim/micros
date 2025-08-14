using Microsoft.Extensions.DependencyInjection;

namespace Shared.Services.App
{
    public abstract class Scope
    {
        public abstract void CreateScope(IServiceCollection services);
    }
}
