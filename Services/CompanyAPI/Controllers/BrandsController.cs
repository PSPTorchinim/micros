using CompanyAPI.Data.Models;
using CompanyAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace CompanyAPI.Controlles
{
    public class BrandsController : BaseController<BrandsController>
    {
        private readonly IBrandsService BrandsService;
        public BrandsController(ILogger<BrandsController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            BrandsService = serviceProvider.GetRequiredService<IBrandsService>();
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetBrandsV1()
        {
            return Ok(await BrandsService.Get());
        }

        [HttpPost]
        public async Task<ActionResult<object>> RegisterBrandV1(RegisterBrandDTO register)
        {
            return Ok(await BrandsService.RegisterBrand(register));
        }
    }
}