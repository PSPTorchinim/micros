using CompanyAPI.Services;
using Shared.Services.App;

namespace CompanyAPI.Controlles
{
    public class ElementsController : BaseController<ElementsController>
    {

        private readonly IElementsService elementsService;

        public ElementsController(ILogger<ElementsController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            elementsService = serviceProvider.GetRequiredService<IElementsService>();
        }
    }
}
