/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA API MERGER SCRIPT            ##
 * ##                                                           ##
 * ## Combines all microservice APIs into a single client      ##
 * ---------------------------------------------------------------
 */

import { Api as BrandApi } from './brand/apiMap';
export * from './brand/apiMap';
import { Api as DocumentsApi } from './documents/apiMap';
export * from './documents/apiMap';
import { Api as GearApi } from './gear/apiMap';
export * from './gear/apiMap';
import { Api as IdentityApi } from './identity/apiMap';
export * from './identity/apiMap';
import { Api as MailingApi } from './mailing/apiMap';
export * from './mailing/apiMap';
import { Api as MusicApi } from './music/apiMap';
export * from './music/apiMap';
import { Api as PartyApi } from './party/apiMap';
export * from './party/apiMap';

import { ApiConfig } from './brand/apiMap';

const NUMBER_OF_RETRIES = 3;

/**
 * Unified API client that combines all microservice APIs
 */
export class UnifiedApi<SecurityDataType extends unknown> {
  public brand: BrandApi<SecurityDataType>;
  public documents: DocumentsApi<SecurityDataType>;
  public gear: GearApi<SecurityDataType>;
  public identity: IdentityApi<SecurityDataType>;
  public mailing: MailingApi<SecurityDataType>;
  public music: MusicApi<SecurityDataType>;
  public party: PartyApi<SecurityDataType>;

  constructor(config: ApiConfig<SecurityDataType> = {}) {
    // Apply default configuration
    const defaultConfig = {
      baseURL: process.env.REACT_APP_API_GATEWAY || '',
      withCredentials: true,
      validateStatus: (status: number) => status >= 200 && status < 300,
      ...config,
    };

    this.brand = new BrandApi(defaultConfig);
    this.documents = new DocumentsApi(defaultConfig);
    this.gear = new GearApi(defaultConfig);
    this.identity = new IdentityApi(defaultConfig);
    this.mailing = new MailingApi(defaultConfig);
    this.music = new MusicApi(defaultConfig);
    this.party = new PartyApi(defaultConfig);
  }

  /**
   * Set security data for all services
   */
  public setSecurityData(data: SecurityDataType | null) {
    this.brand.setSecurityData(data);
    this.documents.setSecurityData(data);
    this.gear.setSecurityData(data);
    this.identity.setSecurityData(data);
    this.mailing.setSecurityData(data);
    this.music.setSecurityData(data);
    this.party.setSecurityData(data);
  }

  /**
   * Update base URL for all services
   */
  public setBaseURL(baseUrl: string) {
    if (this.brand.instance) {
      this.brand.instance.defaults.baseURL = baseUrl;
    }
    if (this.documents.instance) {
      this.documents.instance.defaults.baseURL = baseUrl;
    }
    if (this.gear.instance) {
      this.gear.instance.defaults.baseURL = baseUrl;
    }
    if (this.identity.instance) {
      this.identity.instance.defaults.baseURL = baseUrl;
    }
    if (this.mailing.instance) {
      this.mailing.instance.defaults.baseURL = baseUrl;
    }
    if (this.music.instance) {
      this.music.instance.defaults.baseURL = baseUrl;
    }
    if (this.party.instance) {
      this.party.instance.defaults.baseURL = baseUrl;
    }
  }
}

/**
 * Create a new unified API instance with custom configuration
 */
export function createApi<SecurityDataType extends unknown>(
  config: ApiConfig<SecurityDataType> = {},
): UnifiedApi<SecurityDataType> {
  return new UnifiedApi<SecurityDataType>(config);
}

/**
 * Default unified API instance
 */
export const microservicesClient = createApi();

// Export individual service clients for direct access if needed
export const createBrandApi = (config?: ApiConfig) => new BrandApi(config);
export const createDocumentsApi = (config?: ApiConfig) =>
  new DocumentsApi(config);
export const createGearApi = (config?: ApiConfig) => new GearApi(config);
export const createIdentityApi = (config?: ApiConfig) =>
  new IdentityApi(config);
export const createMailingApi = (config?: ApiConfig) => new MailingApi(config);
export const createMusicApi = (config?: ApiConfig) => new MusicApi(config);
export const createPartyApi = (config?: ApiConfig) => new PartyApi(config);
