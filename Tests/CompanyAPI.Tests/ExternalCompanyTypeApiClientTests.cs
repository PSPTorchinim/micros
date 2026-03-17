using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using CompanyAPI.Data.Models;
using CompanyAPI.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;

namespace CompanyAPI.Tests
{
    /// <summary>
    /// Tests for <see cref="ExternalCompanyTypeApiClient"/> focusing on the GLEIF API
    /// integration and the internal mapping + field-definition logic.
    /// </summary>
    public class ExternalCompanyTypeApiClientTests : IDisposable
    {
        private readonly Mock<ILogger<IExternalCompanyTypeApiClient>> _loggerMock = new();
        private readonly List<IDisposable> _disposables = new();

        // ── FetchCompanyTypesAsync — HTTP layer ───────────────────────────────

        [Fact]
        public async Task FetchCompanyTypesAsync_WhenGleifReturnsActiveRecords_MapsThem()
        {
            // Arrange — return a minimal GLEIF response with one active US entity legal form
            var gleifJson = """
            {
              "data": [
                {
                  "type": "entity-legal-forms",
                  "id": "54M6",
                  "attributes": {
                    "country": "US",
                    "abbreviations": ["LLC"],
                    "names": [
                      { "languageCode": "en", "localName": "Limited Liability Company", "transliteratedName": "Limited Liability Company" }
                    ],
                    "status": "ACTIVE"
                  }
                }
              ],
              "meta": { "total": 1, "count": 1 }
            }
            """;

            var client = BuildClientWithResponse(gleifJson, HttpStatusCode.OK);
            var sut = new ExternalCompanyTypeApiClient(client, _loggerMock.Object);

            // Act
            var result = await sut.FetchCompanyTypesAsync("US");

            // Assert
            Assert.Single(result);
            var def = result[0];
            Assert.Equal("LLC", def.Code);
            Assert.Equal("US", def.CountryCode);
            Assert.True(def.IsActive);
            Assert.Contains(def.Translations, t => t.LanguageCode == "en" && t.Name == "Limited Liability Company");
        }

        [Fact]
        public async Task FetchCompanyTypesAsync_FiltersOutInactiveRecords()
        {
            // Arrange
            var gleifJson = """
            {
              "data": [
                {
                  "type": "entity-legal-forms",
                  "id": "ABCD",
                  "attributes": {
                    "country": "US",
                    "abbreviations": ["OLC"],
                    "names": [{ "languageCode": "en", "localName": "Obsolete Legal Co", "transliteratedName": "Obsolete Legal Co" }],
                    "status": "INACTIVE"
                  }
                }
              ],
              "meta": { "total": 1, "count": 1 }
            }
            """;

            var client = BuildClientWithResponse(gleifJson, HttpStatusCode.OK);
            var sut = new ExternalCompanyTypeApiClient(client, _loggerMock.Object);

            // Act
            var result = await sut.FetchCompanyTypesAsync("US");

            // Assert — inactive form is excluded
            Assert.Empty(result);
        }

        [Fact]
        public async Task FetchCompanyTypesAsync_WhenGleifReturns404_ReturnsEmptyList()
        {
            // Arrange
            var client = BuildClientWithResponse(string.Empty, HttpStatusCode.NotFound);
            var sut = new ExternalCompanyTypeApiClient(client, _loggerMock.Object);

            // Act
            var result = await sut.FetchCompanyTypesAsync("ZZ");

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task FetchCompanyTypesAsync_WhenGleifReturnsEmptyData_ReturnsEmptyList()
        {
            // Arrange
            var gleifJson = """{"data":[],"meta":{"total":0,"count":0}}""";
            var client = BuildClientWithResponse(gleifJson, HttpStatusCode.OK);
            var sut = new ExternalCompanyTypeApiClient(client, _loggerMock.Object);

            // Act
            var result = await sut.FetchCompanyTypesAsync("XX");

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public async Task FetchCompanyTypesAsync_WhenNoEnglishTranslation_SyntheticEnglishIsAdded()
        {
            // Arrange — GLEIF response has only a German name
            var gleifJson = """
            {
              "data": [
                {
                  "type": "entity-legal-forms",
                  "id": "9999",
                  "attributes": {
                    "country": "DE",
                    "abbreviations": ["GmbH"],
                    "names": [
                      { "languageCode": "de", "localName": "Gesellschaft mit beschränkter Haftung", "transliteratedName": "" }
                    ],
                    "status": "ACTIVE"
                  }
                }
              ],
              "meta": { "total": 1, "count": 1 }
            }
            """;

            var client = BuildClientWithResponse(gleifJson, HttpStatusCode.OK);
            var sut = new ExternalCompanyTypeApiClient(client, _loggerMock.Object);

            // Act
            var result = await sut.FetchCompanyTypesAsync("DE");

            // Assert — both "de" original and fallback "en" are present
            Assert.Single(result);
            Assert.Contains(result[0].Translations, t => t.LanguageCode == "de");
            Assert.Contains(result[0].Translations, t => t.LanguageCode == "en");
        }

        [Fact]
        public async Task FetchCompanyTypesAsync_NormalisesIso639ThreeLetterLanguageCodes()
        {
            // Arrange — GLEIF sometimes uses 3-letter ISO 639-2/T codes
            var gleifJson = """
            {
              "data": [
                {
                  "type": "entity-legal-forms",
                  "id": "1234",
                  "attributes": {
                    "country": "FR",
                    "abbreviations": ["SAS"],
                    "names": [
                      { "languageCode": "fra", "localName": "Société par actions simplifiée", "transliteratedName": "" }
                    ],
                    "status": "ACTIVE"
                  }
                }
              ],
              "meta": { "total": 1, "count": 1 }
            }
            """;

            var client = BuildClientWithResponse(gleifJson, HttpStatusCode.OK);
            var sut = new ExternalCompanyTypeApiClient(client, _loggerMock.Object);

            // Act
            var result = await sut.FetchCompanyTypesAsync("FR");

            // Assert — "fra" is normalised to "fr"
            Assert.Contains(result[0].Translations, t => t.LanguageCode == "fr");
        }

        // ── KnownRegistrationFields ───────────────────────────────────────────

        [Theory]
        [InlineData("LLC", "US", "ein")]
        [InlineData("C-CORP", "US", "ein")]
        [InlineData("GMBH", "DE", "hrb")]
        [InlineData("SAS", "FR", "siret")]
        [InlineData("SARL", "FR", "siret")]
        [InlineData("LTD", "GB", "companiesHouseNumber")]
        [InlineData("BV", "NL", "kvkNumber")]
        [InlineData("GMBH", "AT", "firmenbuchnummer")]
        [InlineData("GMBH", "CH", "uid")]
        // Polish entity types
        [InlineData("S.A.", "PL", "nip")]
        [InlineData("S.A.", "PL", "krs")]
        [InlineData("S.A.", "PL", "regon")]
        [InlineData("SP. Z O.O.", "PL", "nip")]
        [InlineData("SP. Z O.O.", "PL", "krs")]
        [InlineData("SP. Z O.O.", "PL", "regon")]
        public void KnownRegistrationFields_ReturnsExpectedKeyField(string code, string country, string expectedFieldKey)
        {
            var fields = KnownRegistrationFields.GetFields(code, country);

            Assert.NotEmpty(fields);
            Assert.Contains(fields, f => f.FieldKey == expectedFieldKey);
        }

        [Fact]
        public void KnownRegistrationFields_UnknownCountry_ReturnsEmptyList()
        {
            var fields = KnownRegistrationFields.GetFields("LLC", "ZZ");
            Assert.Empty(fields);
        }

        [Fact]
        public void KnownRegistrationFields_UnknownCodeInKnownCountry_ReturnsEmptyList()
        {
            var fields = KnownRegistrationFields.GetFields("UNKNOWN_TYPE", "US");
            Assert.Empty(fields);
        }

        [Fact]
        public void KnownRegistrationFields_UsLlc_EinFieldHasRegexAndMaxLength()
        {
            var fields = KnownRegistrationFields.GetFields("LLC", "US");
            var ein = fields.Single(f => f.FieldKey == "ein");

            Assert.NotNull(ein.ValidationRegex);
            Assert.Equal(10, ein.MaxLength);
            Assert.True(ein.IsRequired);
            // All three baseline languages should have a label
            Assert.Contains(ein.Translations, t => t.LanguageCode == "en");
            Assert.Contains(ein.Translations, t => t.LanguageCode == "de");
            Assert.Contains(ein.Translations, t => t.LanguageCode == "fr");
        }

        [Fact]
        public void KnownRegistrationFields_FrSas_SiretFieldHas14CharConstraint()
        {
            var fields = KnownRegistrationFields.GetFields("SAS", "FR");
            var siret = fields.Single(f => f.FieldKey == "siret");

            Assert.Equal(14, siret.MaxLength);
            Assert.Equal(14, siret.MinLength);
            Assert.NotNull(siret.ValidationRegex);
        }

        [Fact]
        public void KnownRegistrationFields_PlSa_NipFieldHasPolishTranslation()
        {
            var fields = KnownRegistrationFields.GetFields("S.A.", "PL");
            var nip = fields.Single(f => f.FieldKey == "nip");

            Assert.NotNull(nip.ValidationRegex);
            Assert.True(nip.IsRequired);
            Assert.Contains(nip.Translations, t => t.LanguageCode == "pl");
            Assert.Contains(nip.Translations, t => t.LanguageCode == "en");
        }

        [Fact]
        public void KnownRegistrationFields_PlSa_HasShareCapitalField()
        {
            var fields = KnownRegistrationFields.GetFields("S.A.", "PL");
            Assert.Contains(fields, f => f.FieldKey == "shareCapital");
        }

        [Fact]
        public void KnownRegistrationFields_PlSpZOO_HasRegisteredAddressField()
        {
            var fields = KnownRegistrationFields.GetFields("SP. Z O.O.", "PL");
            Assert.Contains(fields, f => f.FieldKey == "registeredAddress");
        }

        [Fact]
        public void KnownRegistrationFields_PlKrs_Has10CharConstraint()
        {
            var fields = KnownRegistrationFields.GetFields("S.A.", "PL");
            var krs = fields.Single(f => f.FieldKey == "krs");

            Assert.Equal(10, krs.MaxLength);
            Assert.Equal(10, krs.MinLength);
            Assert.NotNull(krs.ValidationRegex);
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        /// <summary>
        /// Builds a mocked <see cref="IHttpClientFactory"/> that returns a pre-canned response.
        /// </summary>
        private IHttpClientFactory BuildClientWithResponse(string json, HttpStatusCode statusCode)
        {
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            handlerMock
                .Protected()
                .Setup("Dispose", ItExpr.IsAny<bool>());
            handlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = statusCode,
                    Content = new StringContent(json, System.Text.Encoding.UTF8, "application/vnd.api+json")
                });

            var httpClient = new HttpClient(handlerMock.Object)
            {
                BaseAddress = new Uri("https://api.gleif.org/api/v1")
            };
            _disposables.Add(httpClient);

            var factoryMock = new Mock<IHttpClientFactory>();
            factoryMock
                .Setup(f => f.CreateClient(ExternalCompanyTypeApiClient.HttpClientName))
                .Returns(httpClient);

            return factoryMock.Object;
        }

        public void Dispose()
        {
            foreach (var disposable in _disposables)
                disposable.Dispose();
        }
    }
}
