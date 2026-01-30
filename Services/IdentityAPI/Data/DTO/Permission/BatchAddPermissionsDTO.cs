using System.ComponentModel.DataAnnotations;

namespace IdentityAPI.Data.DTO.Permission
{
    public class BatchAddPermissionsDTO
    {
        [Required]
        public List<AddPermissionDTO> Permissions { get; set; } = new List<AddPermissionDTO>();
    }
}
