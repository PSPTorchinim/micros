using DocumentsAPI.Entities;
using MongoDB.Driver;

namespace DocumentsAPI.Repositories
{
    public class DocumentsRepository : MongoDBRepository<Document>
    {
        public DocumentsRepository(MongoClient client, ILogger<DocumentsRepository> logger) : base(client, logger, "Documents")
        {
        }
    }
}
