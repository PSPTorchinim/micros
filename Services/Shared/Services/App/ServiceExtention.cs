using Shared.Services.App;

namespace Shared.Services.App
{
    public static class ServiceExtention
    {
        public static async Task<T> FirstOrDefault<T>(this Task<IEnumerable<T>> action)
        {
            var list = await action;
            return list.FirstOrDefault();
        }
    }
}
