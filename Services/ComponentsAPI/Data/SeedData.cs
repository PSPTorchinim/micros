using ComponentsAPI.Entities;
using ComponentsAPI.Repositories;
using Shared.Services.Database;

namespace ComponentsAPI.Data
{
    internal class SeedData : IDatabaseInitializer
    {
        private readonly IComponentsRepository _componentsRepository;
        private readonly IStoriesRepository _storiesRepository;
        private readonly ILogger<SeedData> _logger;

        public SeedData(IServiceProvider serviceProvider)
        {
            _componentsRepository = serviceProvider.GetRequiredService<IComponentsRepository>();
            _storiesRepository = serviceProvider.GetRequiredService<IStoriesRepository>();
            _logger = serviceProvider.GetRequiredService<ILogger<SeedData>>();
        }

        public async Task InitializeAsync()
        {
            _logger?.LogInformation("Starting database initialization at {Time}", DateTime.UtcNow);
            
            if (await _componentsRepository.Empty())
            {
                _logger?.LogInformation("Seeding components at {Time}", DateTime.UtcNow);
                await SeedComponents();
            }
            
            await _componentsRepository.Save();
            _logger?.LogInformation("Database initialization completed at {Time}", DateTime.UtcNow);
        }

        private async Task SeedComponents()
        {
            _logger?.LogInformation("Seeding sample components at {Time}", DateTime.UtcNow);
            
            try
            {
                var buttonComponent = new Component
                {
                    Name = "Button",
                    Description = "A reusable button component",
                    Category = "Form Controls",
                    Tags = "button,form,input",
                    Props = "{\"variant\":\"primary|secondary|danger\",\"size\":\"small|medium|large\",\"disabled\":\"boolean\"}"
                };
                
                await _componentsRepository.Add(buttonComponent);
                await _componentsRepository.Save();

                await _storiesRepository.Add(new Story
                {
                    Name = "Primary Button",
                    Description = "A primary button example",
                    Code = "<Button variant=\"primary\">Click Me</Button>",
                    ComponentId = buttonComponent.Id
                });

                await _storiesRepository.Add(new Story
                {
                    Name = "Secondary Button",
                    Description = "A secondary button example",
                    Code = "<Button variant=\"secondary\">Cancel</Button>",
                    ComponentId = buttonComponent.Id
                });

                var cardComponent = new Component
                {
                    Name = "Card",
                    Description = "A card component for displaying content",
                    Category = "Layout",
                    Tags = "card,container,layout",
                    Props = "{\"title\":\"string\",\"footer\":\"string\",\"elevated\":\"boolean\"}"
                };
                
                await _componentsRepository.Add(cardComponent);
                await _componentsRepository.Save();

                await _storiesRepository.Add(new Story
                {
                    Name = "Basic Card",
                    Description = "A basic card with title and content",
                    Code = "<Card title=\"Card Title\">Card content goes here</Card>",
                    ComponentId = cardComponent.Id
                });

                _logger?.LogInformation("Sample components seeded successfully at {Time}", DateTime.UtcNow);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to seed components at {Time}", DateTime.UtcNow);
                throw;
            }
        }
    }
}
