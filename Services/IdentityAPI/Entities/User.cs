using Shared.Entities;

namespace IdentityAPI.Entities
{
    public class User : IIdentifier, ICreationDate
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; }
        public string ActivationCode { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public virtual List<Role> Roles { get; set; }
        public virtual List<Password> Passwords { get; set; }
        public virtual List<Block> Blocks { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
