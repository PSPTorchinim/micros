using ComponentsAPI.Entities;
using ComponentsAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace ComponentsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComponentsController : ControllerBase
    {
        private readonly IComponentsService _componentsService;
        private readonly ILogger<ComponentsController> _logger;

        public ComponentsController(IComponentsService componentsService, ILogger<ComponentsController> logger)
        {
            _componentsService = componentsService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Component>>> GetAll()
        {
            try
            {
                var components = await _componentsService.GetAllComponentsAsync();
                return Ok(components);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all components");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Component>> GetById(int id)
        {
            try
            {
                var component = await _componentsService.GetComponentByIdAsync(id);
                if (component == null)
                    return NotFound();
                return Ok(component);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting component {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Component>> Create(Component component)
        {
            try
            {
                var created = await _componentsService.CreateComponentAsync(component);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating component");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Component>> Update(int id, Component component)
        {
            try
            {
                var updated = await _componentsService.UpdateComponentAsync(id, component);
                if (updated == null)
                    return NotFound();
                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating component {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _componentsService.DeleteComponentAsync(id);
                if (!deleted)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting component {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
