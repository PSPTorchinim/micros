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
        public async Task<IActionResult> GetBrandsV1()
        {
            return await Handle(async () => await BrandsService.Get());
        }

        [HttpPost]
        public async Task<IActionResult> RegisterBrandV1(RegisterBrandDTO register)
        {
            return await Handle(
                async () => await BrandsService.RegisterBrand(register),
                result => CreatedAtAction(nameof(GetBrandsV1), result)
            );
        }
    }
}