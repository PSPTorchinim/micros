namespace Shared.Services.Database
{
    public interface IDatabaseInitializer
    {
        public Task InitializeAsync();
    }
}
