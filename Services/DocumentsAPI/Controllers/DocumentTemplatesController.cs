

using DocumentsAPI.Entities;
using DocumentsAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Services.App;

namespace DocumentsAPI.Controllers
{
    public class DocumentTemplatesController : BaseController<DocumentTemplatesController>
    {
        private readonly IDocumentTemplatesService _documentTemplatesService;
        public DocumentTemplatesController(ILogger<DocumentTemplatesController> logger, IServiceProvider serviceProvider) : base(logger, serviceProvider)
        {
            _documentTemplatesService = serviceProvider.GetRequiredService<IDocumentTemplatesService>();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetV1()
        {
            return await Handle(async () => await _documentTemplatesService.Get());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByTemplateIdV1(string id)
        {
            return await Handle(async () => await _documentTemplatesService.Get(new Guid(id)));
        }

        [HttpPost]
        public async Task<IActionResult> PostV1(DocumentTemplate documentTemplate)
        {
            return await Handle(async () => await _documentTemplatesService.Add(documentTemplate));
        }

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateV1([FromQuery] string Id, [FromBody] DocumentTemplate documentTemplate)
        {

            return NotFound();
        }
    }
}
