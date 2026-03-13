namespace IdentityAPI.Data.DTO.User
{
    public class UpdateUserRolesDTO
    {
        public Guid UserId { get; set; }
        public List<Guid> RoleIds { get; set; } = new();
    }
}
