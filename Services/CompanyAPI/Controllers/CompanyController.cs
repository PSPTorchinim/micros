using CompanyAPI.Data.Models;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace CompanyAPI.Controllers
{
    public class CompanyController : BaseController<CompanyController>
    {
        private readonly ICompanyService CompanyService;

        public CompanyController(ILogger<CompanyController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            CompanyService = serviceProvider.GetRequiredService<ICompanyService>();
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyInfoV1()
        {
            return await Handle(async () => await CompanyService.GetCompany());
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCompanyV1(UpdateCompanyDTO updateDto)
        {
            return await Handle(async () => await CompanyService.UpdateCompany(updateDto));
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetCompanyUsersV1()
        {
            return await Handle(async () => await CompanyService.GetCompanyUsers());
        }

        [HttpPost("users")]
        public async Task<IActionResult> AddCompanyUserV1(AddCompanyUserDTO addUserDto)
        {
            return await Handle(
                async () => await CompanyService.AddCompanyUser(addUserDto),
                result => CreatedAtAction(nameof(GetCompanyUsersV1), result)
            );
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> RemoveCompanyUserV1(Guid userId)
        {
            return await Handle(async () => await CompanyService.RemoveCompanyUser(userId));
        }

        [HttpGet("membership")]
        public async Task<IActionResult> IsUserCompanyMemberV1()
        {
            return await Handle(async () => await CompanyService.IsUserCompanyMember());
        }

        [HttpGet("structure")]
        public async Task<IActionResult> GetCompanyStructureV1()
        {
            return await Handle(async () => await CompanyService.GetCompanyStructure());
        }

        [HttpPut("structure")]
        public async Task<IActionResult> UpdateCompanyStructureV1(UpdateCompanyStructureDTO structureDto)
        {
            return await Handle(async () => await CompanyService.UpdateCompanyStructure(structureDto));
        }
    }
}
