using ComponentsAPI.Entities;
using ComponentsAPI.Repositories;

namespace ComponentsAPI.Services
{
    public class StoriesService : IStoriesService
    {
        private readonly IStoriesRepository _repository;
        private readonly ILogger<StoriesService> _logger;

        public StoriesService(IStoriesRepository repository, ILogger<StoriesService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IEnumerable<Story>> GetAllStoriesAsync()
        {
            _logger.LogInformation("Getting all stories");
            return await _repository.Get();
        }

        public async Task<Story?> GetStoryByIdAsync(int id)
        {
            _logger.LogInformation("Getting story with id {Id}", id);
            var stories = await _repository.Get(s => s.Id == id);
            return stories.FirstOrDefault();
        }

        public async Task<IEnumerable<Story>> GetStoriesByComponentIdAsync(int componentId)
        {
            _logger.LogInformation("Getting stories for component {ComponentId}", componentId);
            return await _repository.Get(s => s.ComponentId == componentId);
        }

        public async Task<Story> CreateStoryAsync(Story story)
        {
            _logger.LogInformation("Creating story {Name}", story.Name);
            await _repository.Add(story);
            await _repository.Save();
            return story;
        }

        public async Task<Story?> UpdateStoryAsync(int id, Story story)
        {
            _logger.LogInformation("Updating story with id {Id}", id);
            var existingStories = await _repository.Get(s => s.Id == id);
            var existing = existingStories.FirstOrDefault();
            if (existing == null) return null;

            existing.Name = story.Name;
            existing.Description = story.Description;
            existing.Code = story.Code;
            existing.PreviewUrl = story.PreviewUrl;
            existing.UpdatedDate = DateTime.UtcNow;

            await _repository.Update(existing);
            await _repository.Save();
            return existing;
        }

        public async Task<bool> DeleteStoryAsync(int id)
        {
            _logger.LogInformation("Deleting story with id {Id}", id);
            var stories = await _repository.Get(s => s.Id == id);
            var story = stories.FirstOrDefault();
            if (story == null) return false;

            await _repository.Delete(story);
            return true;
        }
    }
}
