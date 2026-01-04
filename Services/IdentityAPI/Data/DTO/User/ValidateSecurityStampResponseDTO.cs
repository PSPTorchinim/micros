namespace IdentityAPI.Data.DTO.User
{
    public class ValidateSecurityStampResponseDTO
    {
        public bool IsValid { get; set; }
        public string? Reason { get; set; }
    }
}
