using Shared.Entities;

namespace IdentityAPI.Entities
{
    public class Password : IIdentifier, ICreationDate
    {
        public Guid Id { get; set; }
        public virtual User? User { get; set; }
        public Guid UserId { get; set; }
        public string? Value { get; set; }
        public DateTime CreatedDate { get; set; }

        public bool Equals(string other)
        {
            return Value?.ToLower().Equals(other.ToLower()) ?? false;
        }
    }
}
