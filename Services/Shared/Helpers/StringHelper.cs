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
    }
}
