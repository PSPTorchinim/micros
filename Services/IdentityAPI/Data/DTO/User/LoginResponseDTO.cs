using IdentityAPI.Data.DTO.User;

namespace IdentityAPI.DTO.User
{
    public class LoginResponseDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public GetUserDTO User { get; set; }
    }
}
