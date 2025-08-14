

using Microsoft.Extensions.Logging;

namespace Shared.Data.Exceptions
{
    public class ExceptionHandler
    {
        public static void LogException(Exception ex, ILogger logger)
        {
            if (ex == null)
                return;

            logger.LogCritical(ex.Message);
            LogException(ex.InnerException, logger);
        }

        public static async Task<T> Handle<T>(Func<Task<T>> action, ILogger logger)
        {
            try
            {
                return await action();
            }
            catch (AppException ex)
            {
                ExceptionHandler.LogException(ex, logger);
                throw new AppException(ex.Message);
            }
            catch (Exception ex) when (ex is not AppException)
            {
                ExceptionHandler.LogException(ex, logger);
                throw new Exception(ExceptionCodes.DefaultError);
            }
        }

        public static T Handle<T>(Func<T> action, ILogger logger)
        {
            try
            {
                return action();
            }
            catch (AppException ex)
            {
                ExceptionHandler.LogException(ex, logger);
                throw new AppException(ex.Message);
            }
            catch (Exception ex) when (ex is not AppException)
            {
                ExceptionHandler.LogException(ex, logger);
                throw new Exception(ExceptionCodes.DefaultError);
            }
        }
    }
}
