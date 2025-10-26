using DocumentsAPI.Entities;
using MongoDB.Driver;

namespace DocumentsAPI.Repositories
{
    public interface IDocumentTemplatesRepository:IMongoDBRepository<DocumentsAPI.Entities.DocumentTemplate>
    {
    }

    public class DocumentTemplatesRepository : MongoDBRepository<DocumentsAPI.Entities.DocumentTemplate>, IDocumentTemplatesRepository
    {
        public DocumentTemplatesRepository(MongoClient client, ILogger<DocumentTemplatesRepository> logger) : base(client, logger, "DocumentTemplates")
        {
        }
    }
}
