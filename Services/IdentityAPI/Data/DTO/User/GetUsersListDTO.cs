using IdentityAPI.DTO.Role;

namespace IdentityAPI.Data.DTO.User
{
    public class GetUsersListDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; }
        public List<GetRoleDTO> Roles { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
