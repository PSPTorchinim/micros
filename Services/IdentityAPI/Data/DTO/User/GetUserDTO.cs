using IdentityAPI.DTO.Role;

namespace IdentityAPI.Data.DTO.User
{
    public class GetUserDTO
    {
        public Guid ID { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; }
        public List<GetRoleDTO> Roles { get; set; }
    }
}