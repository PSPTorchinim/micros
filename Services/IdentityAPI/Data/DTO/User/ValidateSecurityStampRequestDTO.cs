namespace IdentityAPI.Data.DTO.User
{
    public class ValidateSecurityStampRequestDTO
    {
        public Guid UserId { get; set; }
        public string SecurityStamp { get; set; } = string.Empty;
    }
}
