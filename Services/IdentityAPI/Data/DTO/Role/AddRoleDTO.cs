using IdentityAPI.Data.DTO.Permission;

namespace IdentityAPI.DTO.Role
{
    public class AddRoleDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual List<GetPermissionDTO> Permissions { get; set; }
    }
}
