using DocumentsAPI.Entities;
using MongoDB.Driver;

namespace DocumentsAPI.Repositories
{
    public class DocumentTemplatesRepository : MongoDBRepository<DocumentTemplate>
    {
        public DocumentTemplatesRepository(MongoClient client, ILogger<DocumentTemplatesRepository> logger) : base(client, logger, "DocumentTemplates")
        {
        }
    }
}
