using DocumentsAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace DocumentsAPI.Controllers
{
    public class DocumentsController : BaseController<DocumentsController>
    {
        private readonly IDocumentsService _documentsService;
        public DocumentsController(ILogger<DocumentsController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            _documentsService = serviceProvider.GetRequiredService<IDocumentsService>();
        }

        [HttpGet]
        public async Task<IActionResult> GetV1()
        {
            return await Handle(_documentsService.Get);
        }
    }
}
