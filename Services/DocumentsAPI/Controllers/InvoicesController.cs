using Shared.Services.App;

namespace DocumentsAPI.Controllers
{
    public class InvoicesController : BaseController<InvoicesController>
    {
        public InvoicesController(ILogger<InvoicesController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {

        }
    }
}
