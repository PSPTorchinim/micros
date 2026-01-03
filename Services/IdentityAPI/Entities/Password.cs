using IdentityAPI.Data;
using Shared.Entities;

namespace IdentityAPI.Entities
{
    public class Password : IIdentifier, ICreationDate, IEquatable<string>
    {
        public Guid Id { get; set; }
        public virtual User? User { get; set; }
        public Guid UserId { get; set; }
        public string? Value { get; set; }
        public DateTime CreatedDate { get; set; }

        public bool Equals(string? other)
        {
            if (string.IsNullOrEmpty(Value) || string.IsNullOrEmpty(other))
                return false;
                
            return PasswordManager.VerifyPassword(other, Value);
        }

        public override bool Equals(object? obj)
        {
            if (obj is string str)
                return Equals(str);
            
            return false;
        }

        public override int GetHashCode()
        {
            // Return a constant hash code since Equals() uses password verification
            // rather than value equality. This means Password objects should not be
            // used as keys in hash-based collections.
            return 0;
        }
    }
}
