using CompanyAPI.Data.Models;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;
using Shared.Services.Security;

namespace CompanyAPI.Controllers
{
    public class CompanyController : BaseController<CompanyController>
    {
        private readonly ICompanyService CompanyService;

        public CompanyController(ILogger<CompanyController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            CompanyService = serviceProvider.GetRequiredService<ICompanyService>();
        }

        /// <summary>
        /// Get company information for the current user's company.
        /// Requires: User must be a member of the company.
        /// </summary>
        [HttpGet]
        [RequirePermission("company:read")]
        public async Task<IActionResult> GetCompanyInfoV1()
        {
            return await Handle(async () => await CompanyService.GetCompany());
        }

        /// <summary>
        /// Update company details.
        /// Requires: company:update permission (typically company owners/admins).
        /// </summary>
        [HttpPut]
        [RequirePermission("company:update")]
        public async Task<IActionResult> UpdateCompanyV1(UpdateCompanyDTO updateDto)
        {
            return await Handle(async () => await CompanyService.UpdateCompany(updateDto));
        }

        /// <summary>
        /// Get list of all users in the company.
        /// Requires: company:read permission (all company members).
        /// </summary>
        [HttpGet("users")]
        [RequirePermission("company:read")]
        public async Task<IActionResult> GetCompanyUsersV1()
        {
            return await Handle(async () => await CompanyService.GetCompanyUsers());
        }

        /// <summary>
        /// Add a new user to the company.
        /// Requires: company:users:manage permission (typically company owners/admins).
        /// </summary>
        [HttpPost("users")]
        [RequirePermission("company:users:manage")]
        public async Task<IActionResult> AddCompanyUserV1(AddCompanyUserDTO addUserDto)
        {
            return await Handle(
                async () => await CompanyService.AddCompanyUser(addUserDto),
                result => CreatedAtAction(nameof(GetCompanyUsersV1), result)
            );
        }

        /// <summary>
        /// Remove a user from the company.
        /// Requires: company:users:manage permission (typically company owners/admins).
        /// </summary>
        [HttpDelete("users/{userId}")]
        [RequirePermission("company:users:manage")]
        public async Task<IActionResult> RemoveCompanyUserV1(Guid userId)
        {
            return await Handle(async () => await CompanyService.RemoveCompanyUser(userId));
        }

        /// <summary>
        /// Check if the current user is a member of any company.
        /// No special permission required - available to all authenticated users.
        /// </summary>
        [HttpGet("membership")]
        public async Task<IActionResult> IsUserCompanyMemberV1()
        {
            return await Handle(async () => await CompanyService.IsUserCompanyMember());
        }

        /// <summary>
        /// Get the company's organizational structure.
        /// Requires: company:read permission (all company members).
        /// </summary>
        [HttpGet("structure")]
        [RequirePermission("company:read")]
        public async Task<IActionResult> GetCompanyStructureV1()
        {
            return await Handle(async () => await CompanyService.GetCompanyStructure());
        }

        /// <summary>
        /// Update the company's organizational structure.
        /// Requires: company:update permission (typically company owners/admins).
        /// </summary>
        [HttpPut("structure")]
        [RequirePermission("company:update")]
        public async Task<IActionResult> UpdateCompanyStructureV1(UpdateCompanyStructureDTO structureDto)
        {
            return await Handle(async () => await CompanyService.UpdateCompanyStructure(structureDto));
        }
    }
}
