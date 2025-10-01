import { microservicesClient } from '../models/api';
import { StrapiApi } from '../utils/strapi';

/**
 * Centralized service configuration
 * This integrates both microservices and Strapi APIs
 */
export class ApiServices {
  // Microservices client
  public static microservices = microservicesClient;

  // Strapi client
  public static strapi = StrapiApi;

  /**
   * Configure authentication for all services
   */
  public static setAuthToken(token: string | null) {
    if (token) {
      // Set token for microservices
      this.microservices.setSecurityData(token);

      // Set token for Strapi (if needed)
      if (this.strapi.instance) {
        this.strapi.instance.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
      }
    } else {
      // Clear tokens
      this.microservices.setSecurityData(null);

      if (this.strapi.instance) {
        delete this.strapi.instance.defaults.headers.common['Authorization'];
      }
    }
  }

  /**
   * Update base URLs if needed
   */
  public static updateBaseUrls(gatewayUrl?: string, strapiUrl?: string) {
    if (gatewayUrl) {
      this.microservices.setBaseURL(gatewayUrl);
    }

    if (strapiUrl && this.strapi.instance) {
      this.strapi.instance.defaults.baseURL = strapiUrl;
    }
  }
}

// Export individual service clients for convenience
export const {
  brand: brandService,
  documents: documentsService,
  gear: gearService,
  identity: identityService,
  mailing: mailingService,
  music: musicService,
  party: partyService,
} = microservicesClient;

export const contentService = StrapiApi;
