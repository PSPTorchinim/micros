using System.Security.Cryptography;
using System.Text;

namespace IdentityAPI.Data
{
    public static class PasswordManager
    {
        /// <summary>
        /// Hashes a password using BCrypt with automatic salt generation.
        /// BCrypt provides strong security through key stretching and salting.
        /// </summary>
        /// <param name="password">The plaintext password to hash</param>
        /// <returns>BCrypt hash of the password, or null if input is null</returns>
        public static string? computeHash(this string password)
        {
            if (password == null) return null;
            
            // Use BCrypt with work factor 12 (default, provides good security/performance balance)
            // BCrypt automatically generates and includes a unique salt
            return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
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

            // Check if this is a BCrypt hash (starts with $2a$, $2b$, or $2y$)
            if (hash.StartsWith("$2"))
            {
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }
            
            // Legacy SHA256 comparison for existing passwords
            // This allows gradual migration without breaking existing logins
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
    }
}
