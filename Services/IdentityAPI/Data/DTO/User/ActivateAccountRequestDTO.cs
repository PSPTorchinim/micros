namespace IdentityAPI.DTO.User
{
    public class ActivateAccountRequestDTO
    {
        public string Email { get; set; }
        public string ActivationCode { get; set; }
    }
}
