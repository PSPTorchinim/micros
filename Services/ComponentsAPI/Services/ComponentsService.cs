using ComponentsAPI.Entities;
using ComponentsAPI.Repositories;

namespace ComponentsAPI.Services
{
    public class ComponentsService : IComponentsService
    {
        private readonly IComponentsRepository _repository;
        private readonly ILogger<ComponentsService> _logger;

        public ComponentsService(IComponentsRepository repository, ILogger<ComponentsService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IEnumerable<Component>> GetAllComponentsAsync()
        {
            _logger.LogInformation("Getting all components");
            return await _repository.Get();
        }

        public async Task<Component?> GetComponentByIdAsync(int id)
        {
            _logger.LogInformation("Getting component with id {Id}", id);
            var components = await _repository.Get(c => c.Id == id);
            return components.FirstOrDefault();
        }

        public async Task<Component> CreateComponentAsync(Component component)
        {
            _logger.LogInformation("Creating component {Name}", component.Name);
            await _repository.Add(component);
            await _repository.Save();
            return component;
        }

        public async Task<Component?> UpdateComponentAsync(int id, Component component)
        {
            _logger.LogInformation("Updating component with id {Id}", id);
            var existingComponents = await _repository.Get(c => c.Id == id);
            var existing = existingComponents.FirstOrDefault();
            if (existing == null) return null;

            existing.Name = component.Name;
            existing.Description = component.Description;
            existing.Category = component.Category;
            existing.Tags = component.Tags;
            existing.Props = component.Props;
            existing.UpdatedDate = DateTime.UtcNow;

            await _repository.Update(existing);
            return existing;
        }

        public async Task<bool> DeleteComponentAsync(int id)
        {
            _logger.LogInformation("Deleting component with id {Id}", id);
            var components = await _repository.Get(c => c.Id == id);
            var component = components.FirstOrDefault();
            if (component == null) return false;

            await _repository.Delete(component);
            return true;
        }
    }
}
