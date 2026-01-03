using System.Security.Cryptography;

namespace Shared.Helpers
{
    public static class StringHelper
    {
        public static string GenerateRandomPassword(int length)
        {
            using (RNGCryptoServiceProvider cryptRNG = new RNGCryptoServiceProvider())
            {
                byte[] tokenBuffer = new byte[length];
                cryptRNG.GetBytes(tokenBuffer);
                return Convert.ToBase64String(tokenBuffer);
            }
        }

        public static bool Compare(this string value1, string value2)
        {
            return value1.ToLower().Equals(value2.ToLower());
        }

        /// <summary>
        /// Sanitizes a string for safe logging by removing or replacing characters that could be used for log injection attacks.
        /// Removes newlines, carriage returns, and other control characters.
        /// </summary>
        /// <param name="input">The string to sanitize</param>
        /// <returns>A sanitized string safe for logging, or empty string if input is null</returns>
        public static string SanitizeForLog(string? input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            // Replace newline characters and carriage returns with spaces
            // to prevent log injection attacks
            return input
                .Replace("\r", " ")
                .Replace("\n", " ")
                .Replace("\t", " ")
                .Trim();
        }
    }
}
