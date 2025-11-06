using ComponentsAPI.Entities;
using ComponentsAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ComponentsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoriesController : ControllerBase
    {
        private readonly IStoriesService _storiesService;
        private readonly ILogger<StoriesController> _logger;

        public StoriesController(IStoriesService storiesService, ILogger<StoriesController> logger)
        {
            _storiesService = storiesService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Story>>> GetAll()
        {
            try
            {
                var stories = await _storiesService.GetAllStoriesAsync();
                return Ok(stories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all stories");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Story>> GetById(int id)
        {
            try
            {
                var story = await _storiesService.GetStoryByIdAsync(id);
                if (story == null)
                    return NotFound();
                return Ok(story);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting story {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("component/{componentId}")]
        public async Task<ActionResult<IEnumerable<Story>>> GetByComponentId(int componentId)
        {
            try
            {
                var stories = await _storiesService.GetStoriesByComponentIdAsync(componentId);
                return Ok(stories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting stories for component {ComponentId}", componentId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Story>> Create(Story story)
        {
            try
            {
                var created = await _storiesService.CreateStoryAsync(story);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating story");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Story>> Update(int id, Story story)
        {
            try
            {
                var updated = await _storiesService.UpdateStoryAsync(id, story);
                if (updated == null)
                    return NotFound();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating story {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _storiesService.DeleteStoryAsync(id);
                if (!deleted)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting story {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
