namespace Shared.Configurations
{
    public class ReverseProxyConfig
    {
        public Dictionary<string, RouteConfig> Routes { get; set; }
        public Dictionary<string, ClusterConfig> Clusters { get; set; }
    }

    public class RouteConfig
    {
        public string ClusterId { get; set; }
        public MatchConfig Match { get; set; }
        public List<TransformConfig> Transforms { get; set; }
    }

    public class MatchConfig
    {
        public string Path { get; set; }
    }

    public class TransformConfig
    {
        public string PathPattern { get; set; }
    }

    public class ClusterConfig
    {
        public Dictionary<string, DestinationConfig> Destinations { get; set; }
    }

    public class DestinationConfig
    {
        public string Address { get; set; }
        public List<SwaggerConfig> Swaggers { get; set; }
    }

    public class SwaggerConfig
    {
        public string PrefixPath { get; set; }
        public List<string> Paths { get; set; }
    }
}