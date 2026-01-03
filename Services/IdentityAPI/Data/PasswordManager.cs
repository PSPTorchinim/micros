using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace IdentityAPI.Data
{
    public static class PasswordManager
    {
        // Default work factor if configuration is not available
        private const int DefaultWorkFactor = 12;

        /// <summary>
        /// Hashes a password using BCrypt with automatic salt generation.
        /// BCrypt provides strong security through key stretching and salting.
        /// </summary>
        /// <param name="password">The plaintext password to hash</param>
        /// <param name="workFactor">BCrypt work factor (default: 12, range: 4-31)</param>
        /// <returns>BCrypt hash of the password, or null if input is null</returns>
        public static string? computeHash(this string password, int workFactor = DefaultWorkFactor)
        {
            if (password == null) return null;
            
            // Validate work factor range (BCrypt supports 4-31)
            if (workFactor < 4 || workFactor > 31)
            {
                throw new ArgumentOutOfRangeException(nameof(workFactor), 
                    "BCrypt work factor must be between 4 and 31");
            }
            
            // Use BCrypt with configurable work factor
            // BCrypt automatically generates and includes a unique salt
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: workFactor);
        }

        /// <summary>
        /// Verifies a password against a BCrypt hash.
        /// Also supports legacy SHA256 hashes for backward compatibility during migration.
        /// </summary>
        /// <param name="password">The plaintext password to verify</param>
        /// <param name="hash">The stored hash to compare against</param>
        /// <returns>True if password matches the hash</returns>
        public static bool VerifyPassword(string password, string hash)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
                return false;

            // Check if this is a valid BCrypt hash using proper regex
            // BCrypt format: $2[a|b|y]$[cost]$[salt+hash]
            // Example: $2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
            var bcryptPattern = @"^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$";
            if (Regex.IsMatch(hash, bcryptPattern))
            {
                try
                {
                    return BCrypt.Net.BCrypt.Verify(password, hash);
                }
                catch (Exception)
                {
                    // Invalid BCrypt hash format
                    return false;
                }
            }
            
            // Legacy SHA256 comparison for existing passwords
            // This allows gradual migration without breaking existing logins
            // SHA256 produces 64 character hex strings
            if (hash.Length == 64 && Regex.IsMatch(hash, "^[0-9a-fA-F]{64}$"))
            {
                using (var sha256Hash = SHA256.Create())
                {
                    byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                    var builder = new StringBuilder();
                    for (int i = 0; i < bytes.Length; i++)
                    {
                        builder.Append(bytes[i].ToString("x2"));
                    }
                    string sha256Result = builder.ToString();
                    return hash.Equals(sha256Result, StringComparison.OrdinalIgnoreCase);
                }
            }

            // Unknown hash format
            return false;
        }
    }
}
