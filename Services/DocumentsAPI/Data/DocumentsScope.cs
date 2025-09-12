using DocumentsAPI.Repositories;
using DocumentsAPI.Services;
using Shared.Services.App;

internal class DocumentsScope : Scope
{
    public override void CreateScope(IServiceCollection services)
    {
        services.AddScoped<DocumentTemplatesRepository>();
        services.AddScoped<DocumentsRepository>();
        services.AddScoped<IDocumentsService, DocumentsService>();
        services.AddScoped<IDocumentTemplatesService, DocumentTemplatesService>();
    }
}