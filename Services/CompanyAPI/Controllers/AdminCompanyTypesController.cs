using CompanyAPI.Data.Models;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

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
    }
}
