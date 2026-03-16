using OpenTelemetry;
using System.Diagnostics;

namespace Shared.Services.Telemetry
{
    /// <summary>
    /// Removes the <c>db.query.text</c> attribute from SQL traces in non-development environments
    /// to avoid exposing sensitive data in telemetry.
    /// </summary>
    public class SqlQueryTextRedactingProcessor : BaseProcessor<Activity>
    {
        private readonly bool _isDevelopment;

        public SqlQueryTextRedactingProcessor(bool isDevelopment)
        {
            _isDevelopment = isDevelopment;
        }

        public override void OnEnd(Activity activity)
        {
            if (!_isDevelopment && activity.GetTagItem("db.query.text") != null)
            {
                activity.SetTag("db.query.text", null);
            }
        }
    }
}
