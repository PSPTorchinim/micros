using IdentityAPI.DTO.Role;

namespace IdentityAPI.Data.DTO.User
{
    public class GetUsersListDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool Activated { get; set; }
        public List<GetRoleDTO> Roles { get; set; } = new();
        public DateTime CreatedDate { get; set; }
    }
}
