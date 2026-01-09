using Serilog.Core;
using Serilog.Events;
using System.Diagnostics;

namespace Shared.Services.Telemetry
{
    public class TraceContextEnricher : ILogEventEnricher
    {
        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            var activity = Activity.Current;
            if (activity != null)
            {
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(
                    "TraceId", activity.TraceId.ToString()));
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(
                    "SpanId", activity.SpanId.ToString()));
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(
                    "ParentId", activity.ParentSpanId.ToString()));
            }
            else
            {
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(
                    "TraceId", ""));
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(
                    "SpanId", ""));
            }
        }
    }
}
