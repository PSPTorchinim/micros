using ComponentsAPI.Repositories;
using ComponentsAPI.Services;
using Shared.Services.App;

namespace ComponentsAPI.Data
{
    public class ComponentsScope : Scope
    {
        public override void CreateScope(IServiceCollection services)
        {
            services.AddScoped<IComponentsRepository, ComponentsRepository>();
            services.AddScoped<IStoriesRepository, StoriesRepository>();

            services.AddScoped<IComponentsService, ComponentsService>();
            services.AddScoped<IStoriesService, StoriesService>();
        }
    }
}
