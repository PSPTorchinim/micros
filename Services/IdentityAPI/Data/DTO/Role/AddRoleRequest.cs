namespace IdentityAPI.DTO.Role
{
    public class AddRoleRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Guid> Permissions { get; set; }
    }
}
