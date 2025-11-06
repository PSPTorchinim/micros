using ComponentsAPI.Entities;

namespace ComponentsAPI.Services
{
    public interface IStoriesService
    {
        Task<IEnumerable<Story>> GetAllStoriesAsync();
        Task<Story?> GetStoryByIdAsync(int id);
        Task<IEnumerable<Story>> GetStoriesByComponentIdAsync(int componentId);
        Task<Story> CreateStoryAsync(Story story);
        Task<Story?> UpdateStoryAsync(int id, Story story);
        Task<bool> DeleteStoryAsync(int id);
    }
}
