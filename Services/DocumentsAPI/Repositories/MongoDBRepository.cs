using MongoDB.Bson;
using MongoDB.Driver;
using Shared.Data.Exceptions;

namespace DocumentsAPI.Repositories
{
    public class MongoDBRepository<T>
    {

        public readonly IMongoCollection<T> Collection;
        public readonly ILogger _logger;

        public MongoDBRepository(MongoClient Client, ILogger logger, string collectionName)
        {
            IMongoDatabase database = Client.GetDatabase(Environment.GetEnvironmentVariable("DATABASE_CATALOG"));
            Collection = database.GetCollection<T>(collectionName);
            _logger = logger;
        }

        public async Task<bool> Add(T entity)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                await Collection.InsertOneAsync(entity);
                return true;
            }, _logger);
        }

        public async Task<IEnumerable<T>> Get()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return (await Collection.FindAsync(new BsonDocument())).ToList();
            }, _logger);
        }

        public async Task<IEnumerable<T>> Get(Func<T, bool> pred)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return (await Get()).Where(pred).ToList();
            }, _logger);
        }

        public async Task<int> Count()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return (await Get()).Count();
            }, _logger);
        }

        public async Task<int> Count(Func<T, bool> pred)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return (await Get()).Count(pred);
            }, _logger);
        }

        public async Task<bool> Empty()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var x = await Count();
                return x == 0;
            }, _logger);
        }
    }
}