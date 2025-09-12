using Shared.Entities;

namespace IdentityAPI.Data.Helpers
{
    public static class QueryHelper
    {
        public static T GetLatest<T>(this IEnumerable<T> values) where T : ICreationDate
        {
            var res = values.OrderByDescending(x => x.CreatedDate).ToList().First();
            return res;
        }
    }
}
