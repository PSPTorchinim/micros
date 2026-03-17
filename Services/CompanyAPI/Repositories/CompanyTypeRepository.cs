using CompanyAPI.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using Shared.Data.Exceptions;

namespace CompanyAPI.Repositories
{
    public interface ICompanyTypeRepository
    {
        Task<bool> Add(CompanyType entity);
        Task<bool> Update(CompanyType entity);
        Task<bool> Delete(Guid id);
        Task<List<CompanyType>> Get();
        Task<List<CompanyType>> GetByCountry(string countryCode);
        Task<CompanyType?> GetById(Guid id);
        Task<bool> Empty();
    }

    public class CompanyTypeRepository : ICompanyTypeRepository
    {
        private readonly IMongoCollection<CompanyType> _collection;
        private readonly ILogger<ICompanyTypeRepository> _logger;

        public CompanyTypeRepository(MongoClient client, ILogger<ICompanyTypeRepository> logger)
        {
            var database = client.GetDatabase(Environment.GetEnvironmentVariable("ASPNETCORE_DATABASE_CATALOG"));
            _collection = database.GetCollection<CompanyType>("CompanyTypes");
            _logger = logger;
        }

        public async Task<bool> Add(CompanyType entity)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                await _collection.InsertOneAsync(entity);
                return true;
            }, _logger);
        }

        public async Task<bool> Update(CompanyType entity)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                entity.UpdatedAt = DateTime.UtcNow;
                var filter = Builders<CompanyType>.Filter.Eq(ct => ct.Id, entity.Id);
                var result = await _collection.ReplaceOneAsync(filter, entity);
                return result.ModifiedCount > 0;
            }, _logger);
        }

        public async Task<bool> Delete(Guid id)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var filter = Builders<CompanyType>.Filter.Eq(ct => ct.Id, id);
                var result = await _collection.DeleteOneAsync(filter);
                return result.DeletedCount > 0;
            }, _logger);
        }

        public async Task<List<CompanyType>> Get()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                return (await _collection.FindAsync(new BsonDocument())).ToList();
            }, _logger);
        }

        public async Task<List<CompanyType>> GetByCountry(string countryCode)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var filter = Builders<CompanyType>.Filter.And(
                    Builders<CompanyType>.Filter.Eq(ct => ct.CountryCode, countryCode.ToUpperInvariant()),
                    Builders<CompanyType>.Filter.Eq(ct => ct.IsActive, true)
                );
                return (await _collection.FindAsync(filter)).ToList();
            }, _logger);
        }

        public async Task<CompanyType?> GetById(Guid id)
        {
            return await ExceptionHandler.Handle(async () =>
            {
                var filter = Builders<CompanyType>.Filter.Eq(ct => ct.Id, id);
                return (await _collection.FindAsync(filter)).FirstOrDefault();
            }, _logger);
        }

        public async Task<bool> Empty()
        {
            return await ExceptionHandler.Handle(async () =>
            {
                await _collection.Database.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1));
                var count = await _collection.CountDocumentsAsync(new BsonDocument());
                return count == 0;
            }, _logger);
        }
    }
}
