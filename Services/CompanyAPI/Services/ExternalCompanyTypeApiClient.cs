using System.Net.Http.Json;
using CompanyAPI.Data.Models;

namespace CompanyAPI.Services
{
    public interface IExternalCompanyTypeApiClient
    {
        /// <summary>
        /// Fetches company type definitions for a given country from the configured external API.
        /// </summary>
        /// <param name="countryCode">ISO 3166-1 alpha-2 country code (e.g. "US", "DE")</param>
        Task<List<ExternalCompanyTypeDefinition>> FetchCompanyTypesAsync(string countryCode);
    }

    public class ExternalCompanyTypeApiClient : IExternalCompanyTypeApiClient
    {
        /// <summary>Named HttpClient key registered in BrandScope.</summary>
        public const string HttpClientName = "ExternalCompanyTypesApi";

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<IExternalCompanyTypeApiClient> _logger;

        private static string GetApiBaseUrl() =>
            Environment.GetEnvironmentVariable("ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_URL")
            ?? "https://api.example.com";

        public ExternalCompanyTypeApiClient(IHttpClientFactory httpClientFactory, ILogger<IExternalCompanyTypeApiClient> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<List<ExternalCompanyTypeDefinition>> FetchCompanyTypesAsync(string countryCode)
        {
            var baseUrl = GetApiBaseUrl().TrimEnd('/');
            var url = $"{baseUrl}/company-types?countryCode={Uri.EscapeDataString(countryCode.ToUpperInvariant())}";

            _logger.LogInformation("Fetching company type definitions for country {CountryCode} from external API", countryCode);

            // Use the pre-configured named client (timeout is set at registration time in BrandScope)
            var client = _httpClientFactory.CreateClient(HttpClientName);

            // Set per-request headers to avoid polluting the pooled client's DefaultRequestHeaders
            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            var apiKey = Environment.GetEnvironmentVariable("ASPNETCORE_EXTERNAL_COMPANY_TYPES_API_KEY");
            if (!string.IsNullOrEmpty(apiKey))
            {
                request.Headers.Add("X-API-Key", apiKey);
            }

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("External company types API returned {StatusCode} for country {CountryCode}", response.StatusCode, countryCode);
                return new List<ExternalCompanyTypeDefinition>();
            }

            var result = await response.Content.ReadFromJsonAsync<List<ExternalCompanyTypeDefinition>>();
            _logger.LogInformation("Fetched {Count} company type definitions from external API for country {CountryCode}", result?.Count ?? 0, countryCode);
            return result ?? new List<ExternalCompanyTypeDefinition>();
        }
    }
}
