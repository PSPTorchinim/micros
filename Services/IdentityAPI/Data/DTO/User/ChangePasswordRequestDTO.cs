namespace IdentityAPI.DTO.User
{
    public class ChangePasswordRequestDTO
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
