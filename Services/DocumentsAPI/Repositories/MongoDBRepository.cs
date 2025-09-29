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
            IMongoDatabase database = Client.GetDatabase(Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_CATALOG"));
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
                try
                {
                    // Try to ping the database to verify connection before counting
                    var pingResult = await Collection.Database.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1));
                    _logger.LogDebug("MongoDB ping successful");
                    
                    var count = await Count();
                    return count == 0;
                }
                catch (Exception ex) when (ex.GetType().Name.Contains("MongoAuthenticationException"))
                {
                    _logger.LogError(ex, "MongoDB authentication failed. Check username, password, and authSource.");
                    throw;
                }
                catch (Exception ex) when (ex.GetType().Name.Contains("MongoConnectionException"))
                {
                    _logger.LogError(ex, "MongoDB connection failed. Check host, port, and network connectivity.");
                    throw;
                }
                catch (Exception ex) when (ex.GetType().Name.Contains("MongoException"))
                {
                    _logger.LogError(ex, "MongoDB operation failed: {Message}", ex.Message);
                    throw;
                }
            }, _logger);
        }
    }
}