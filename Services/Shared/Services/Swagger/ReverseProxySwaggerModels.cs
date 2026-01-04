using System.Collections.Generic;

namespace Shared.Services.Swagger
{
    public class ReverseProxyDocumentFilterConfig
    {
        public Dictionary<string, ClusterConfig> Clusters { get; set; } = new();
    }

    public class ClusterConfig
    {
        public Dictionary<string, DestinationConfig> Destinations { get; set; } = new();
    }

    public class DestinationConfig
    {
        public string Address { get; set; } = string.Empty;
        public List<SwaggerConfig>? Swaggers { get; set; }
    }

    public class SwaggerConfig
    {
        public string PrefixPath { get; set; } = string.Empty;
        public List<string> Paths { get; set; } = new();
    }
}
