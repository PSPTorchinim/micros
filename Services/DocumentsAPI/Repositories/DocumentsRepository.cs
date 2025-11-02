using DocumentsAPI.Entities;
using MongoDB.Driver;

namespace DocumentsAPI.Repositories
{
    public interface IDocumentsRepository: IMongoDBRepository<DocumentsAPI.Entities.Document>
    {
    }

    public class DocumentsRepository : MongoDBRepository<DocumentsAPI.Entities.Document>, IDocumentsRepository
    {
        public DocumentsRepository(MongoClient client, ILogger<DocumentsRepository> logger) : base(client, logger, "Documents")
        {
        }
    }
}
