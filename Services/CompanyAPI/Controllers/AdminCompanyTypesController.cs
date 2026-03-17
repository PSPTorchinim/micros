using CompanyAPI.Data.Models;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;
using System.Text.Json;

namespace CompanyAPI.Controllers
{
    [Authorize(Roles = "SuperOwner")]
    public class AdminCompanyTypesController : BaseController<AdminCompanyTypesController>
    {
        private readonly ICompanyTypeService _companyTypeService;

        public AdminCompanyTypesController(ILogger<AdminCompanyTypesController> logger, IServiceProvider serviceProvider)
            : base(logger, serviceProvider)
        {
            _companyTypeService = serviceProvider.GetRequiredService<ICompanyTypeService>();
        }

        /// <summary>
        /// Get all company types (all countries).
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllCompanyTypesV1([FromQuery] string languageCode = "en")
        {
            return await Handle(async () => await _companyTypeService.GetAll(languageCode));
        }

        /// <summary>
        /// Create a new company type.
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateCompanyTypeV1(CreateCompanyTypeDTO dto)
        {
            return await Handle(
                async () => await _companyTypeService.Create(dto),
                result => CreatedAtAction(nameof(CreateCompanyTypeV1), result)
            );
        }

        /// <summary>
        /// Update an existing company type.
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompanyTypeV1(Guid id, UpdateCompanyTypeDTO dto)
        {
            return await Handle(async () => await _companyTypeService.Update(id, dto));
        }

        /// <summary>
        /// Delete a company type.
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompanyTypeV1(Guid id)
        {
            return await Handle(async () => await _companyTypeService.Delete(id));
        }

        /// <summary>
        /// Add a field to a company type.
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpPost("{id}/fields")]
        public async Task<IActionResult> AddFieldV1(Guid id, CreateCompanyTypeFieldDTO dto)
        {
            return await Handle(async () => await _companyTypeService.AddField(id, dto));
        }

        /// <summary>
        /// Update translations for a company type field.
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpPut("{typeId}/fields/{fieldId}/translations")]
        public async Task<IActionResult> UpdateFieldTranslationsV1(Guid typeId, Guid fieldId, UpdateFieldTranslationsDTO dto)
        {
            return await Handle(async () => await _companyTypeService.UpdateFieldTranslations(typeId, fieldId, dto));
        }

        /// <summary>
        /// Sync company types for a country from the configured external API.
        /// New types are created and existing ones are updated (matched by code + country).
        /// Requires: SuperOwner role.
        /// </summary>
        /// <param name="countryCode">ISO 3166-1 alpha-2 country code (e.g. "US", "DE")</param>
        [HttpPost("sync")]
        public async Task<IActionResult> SyncFromExternalApiV1([FromQuery] string countryCode)
        {
            return await Handle(async () => await _companyTypeService.SyncFromExternalApiAsync(countryCode));
        }

        /// <summary>
        /// Import company type definitions from an uploaded JSON file.
        /// The file must contain an array of ExternalCompanyTypeDefinition objects.
        /// Requires: SuperOwner role.
        /// </summary>
        [HttpPost("import")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportFromFileV1(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file uploaded." });

            const long maxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
            if (file.Length > maxFileSizeBytes)
                return BadRequest(new { success = false, message = "File size exceeds the 10 MB limit." });

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".json")
                return BadRequest(new { success = false, message = "Only .json files are supported." });

            List<ExternalCompanyTypeDefinition>? definitions;
            try
            {
                using var stream = file.OpenReadStream();
                definitions = await JsonSerializer.DeserializeAsync<List<ExternalCompanyTypeDefinition>>(
                    stream,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse uploaded JSON file for company type import.");
                return BadRequest(new { success = false, message = "The uploaded file contains invalid JSON. Please check the file format and try again." });
            }

            if (definitions == null || definitions.Count == 0)
                return BadRequest(new { success = false, message = "The file contains no company type definitions." });

            return await Handle(async () => await _companyTypeService.ImportFromDefinitionsAsync(definitions));
        }
    }
}
