using CompanyAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace CompanyAPI.Controllers
{
    public class CompanyTypesController : BaseController<CompanyTypesController>
    {
        private readonly ICompanyTypeService _companyTypeService;

        public CompanyTypesController(ILogger<CompanyTypesController> logger, IServiceProvider serviceProvider)
            : base(logger, serviceProvider)
        {
            _companyTypeService = serviceProvider.GetRequiredService<ICompanyTypeService>();
        }

        /// <summary>
        /// Get available company types for a given country.
        /// </summary>
        /// <param name="countryCode">ISO 3166-1 alpha-2 country code (e.g. "US", "DE")</param>
        /// <param name="languageCode">ISO 639-1 language code for localized names (e.g. "en", "de"). Defaults to "en".</param>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompanyTypesV1([FromQuery] string countryCode, [FromQuery] string languageCode = "en")
        {
            return await Handle(async () => await _companyTypeService.GetByCountry(countryCode, languageCode));
        }

        /// <summary>
        /// Get a company type with its full field definitions.
        /// </summary>
        /// <param name="id">Company type ID</param>
        /// <param name="languageCode">ISO 639-1 language code for localized content. Defaults to "en".</param>
        [HttpGet("{id}/fields")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCompanyTypeFieldsV1(Guid id, [FromQuery] string languageCode = "en")
        {
            return await Handle(async () => await _companyTypeService.GetWithFields(id, languageCode));
        }
    }
}
