using IdentityAPI.Data.DTO.Permission;

namespace IdentityAPI.DTO.Role
{
    public class GetRoleDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<GetPermissionsDTO> Permissions { get; set; }
    }
}
