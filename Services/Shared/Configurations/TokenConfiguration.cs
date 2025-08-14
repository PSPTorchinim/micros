namespace Shared.Configurations
{
    public class TokenConfiguration
    {
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public string Key { get; set; }
        public bool RequireHttpsMetadata { get; set; }
        public bool SaveToken { get; set; }
        public int TokenExpireTime { get; set; }
        public bool ValidateAudience { get; set; }
        public bool ValidateIssuer { get; set; }
        public long MonthTokenExpireTime { get; set; }
    }
}
