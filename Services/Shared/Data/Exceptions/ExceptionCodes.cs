namespace Shared.Data.Exceptions
{
    public class ExceptionCodes
    {
        public static string DefaultError = "DEFAULT_ERROR";

        public static string CorruptedToken = "CORRUPTED_TOKEN";
        public static string DatabaseError = "DATABASE_ERROR";

        public static string UserNotFound = "USER_NOT_FOUND";
        public static string LoginUsernameNotFound = "LOGIN_USERNAME_NOT_FOUND";
        public static string LoginWrongPassword = "LOGIN_WRONG_PASSWORD";
        public static string LoginUserBlocked = "LOGIN_USER_BLOCKED";

        public static string RegisterEmailFound = "REGISTER_EMAIL_FOUND";
        public static string RegisterUsernameFound = "REGISTER_USERNAME_FOUND";

        public static string CountryCodeNotFound = "COUNTRY_CODE_NOT_FOUND";
        public static string RefreshTokenWrong = "REFRESHTOKEN_WRONG";

        public static string RoleNotExists = "ROLE_NOT_EXISTS";
        public static string AddRoleExists = "ADD_ROLE_EXISTS";
        public static string RoleHasUsers = "ROLE_HAS_USERS";
        public static string PasswordAlreadyUsed = "PASSWORD_ALREADY_USED";
        public static string WrongActivationCode = "WRONG_ACTIVATION_CODE";
    }
}
