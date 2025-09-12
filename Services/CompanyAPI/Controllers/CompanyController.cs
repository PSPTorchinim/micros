using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace CompanyAPI.Controllers
{
    public class CompanyController : BaseController<CompanyController>
    {
        public CompanyController(ILogger<CompanyController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanyInfoV1()
        {
            return await Handle<string?>(async () =>
            {
                return null;
            });
        }
    }
}
