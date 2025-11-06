using ComponentsAPI.Entities;

namespace ComponentsAPI.Services
{
    public interface IComponentsService
    {
        Task<IEnumerable<Component>> GetAllComponentsAsync();
        Task<Component?> GetComponentByIdAsync(int id);
        Task<Component> CreateComponentAsync(Component component);
        Task<Component?> UpdateComponentAsync(int id, Component component);
        Task<bool> DeleteComponentAsync(int id);
    }
}
