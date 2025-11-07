using Microsoft.AspNetCore.Mvc;

namespace Shared.Services.Cache
{
    /// <summary>
    /// Helper class for common response cache configurations
    /// </summary>
    public static class CacheProfiles
    {
        public const string Default = "Default";
        public const string Short = "Short";
        public const string Medium = "Medium";
        public const string Long = "Long";
        public const string NoCache = "NoCache";

        public static Dictionary<string, CacheProfile> GetProfiles()
        {
            return new Dictionary<string, CacheProfile>
            {
                {
                    Default,
                    new CacheProfile
                    {
                        Duration = 60, // 1 minute
                        Location = ResponseCacheLocation.Any,
                        VaryByHeader = "Accept,Accept-Language,Authorization"
                    }
                },
                {
                    Short,
                    new CacheProfile
                    {
                        Duration = 30, // 30 seconds
                        Location = ResponseCacheLocation.Any,
                        VaryByHeader = "Accept,Accept-Language,Authorization"
                    }
                },
                {
                    Medium,
                    new CacheProfile
                    {
                        Duration = 300, // 5 minutes
                        Location = ResponseCacheLocation.Any,
                        VaryByHeader = "Accept,Accept-Language,Authorization"
                    }
                },
                {
                    Long,
                    new CacheProfile
                    {
                        Duration = 900, // 15 minutes
                        Location = ResponseCacheLocation.Any,
                        VaryByHeader = "Accept,Accept-Language,Authorization"
                    }
                },
                {
                    NoCache,
                    new CacheProfile
                    {
                        Duration = 0,
                        Location = ResponseCacheLocation.None,
                        NoStore = true
                    }
                }
            };
        }
    }
}
