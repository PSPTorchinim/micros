using CompanyAPI.Services;
using Shared.Services.App;

namespace CompanyAPI.Controlles
{
    public class ClientsController : BaseController<ClientsController>
    {
        private readonly IClientsService ClientsService;
        public ClientsController(ILogger<ClientsController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            ClientsService = serviceProvider.GetRequiredService<IClientsService>();
        }
    }
}