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
import { Api as DocumentsApi } from './documents/apiMap';
import { Api as GearApi } from './gear/apiMap';
import { Api as IdentityApi } from './identity/apiMap';
import { Api as MailingApi } from './mailing/apiMap';
import { Api as MusicApi } from './music/apiMap';
import { Api as PartyApi } from './party/apiMap';

// Define basic types for API configuration - EXPORTED
export interface ApiConfig<SecurityDataType = unknown> {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  validateStatus?: (status: number) => boolean;
  securityWorker?: (securityData: SecurityDataType | null) => any;
  [key: string]: any;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: any;
  constructor(config: ApiConfig<SecurityDataType> = {}) {
    // Basic implementation - actual functionality comes from generated APIs
    this.instance = config;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type RequestParams = any;
export type FullRequestParams = any;

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
    if (this.brand.setSecurityData) {
      this.brand.setSecurityData(data);
    }
    if (this.documents.setSecurityData) {
      this.documents.setSecurityData(data);
    }
    if (this.gear.setSecurityData) {
      this.gear.setSecurityData(data);
    }
    if (this.identity.setSecurityData) {
      this.identity.setSecurityData(data);
    }
    if (this.mailing.setSecurityData) {
      this.mailing.setSecurityData(data);
    }
    if (this.music.setSecurityData) {
      this.music.setSecurityData(data);
    }
    if (this.party.setSecurityData) {
      this.party.setSecurityData(data);
    }
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
  config: ApiConfig<SecurityDataType> = {}
): UnifiedApi<SecurityDataType> {
  return new UnifiedApi<SecurityDataType>(config);
}

/**
 * Default unified API instance
 */
export const microservicesClient = createApi();

// Export individual service clients for direct access if needed
export const createBrandApi = <T = unknown>(config: ApiConfig<T> = {}) => new BrandApi(config);
export const createDocumentsApi = <T = unknown>(config: ApiConfig<T> = {}) => new DocumentsApi(config);
export const createGearApi = <T = unknown>(config: ApiConfig<T> = {}) => new GearApi(config);
export const createIdentityApi = <T = unknown>(config: ApiConfig<T> = {}) => new IdentityApi(config);
export const createMailingApi = <T = unknown>(config: ApiConfig<T> = {}) => new MailingApi(config);
export const createMusicApi = <T = unknown>(config: ApiConfig<T> = {}) => new MusicApi(config);
export const createPartyApi = <T = unknown>(config: ApiConfig<T> = {}) => new PartyApi(config);
